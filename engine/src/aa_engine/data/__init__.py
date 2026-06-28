"""Data layer: interfacce astratte per l'accesso ai dati.

Principio chiave: il motore NON deve sapere DA DOVE arrivano i dati.
In prototipo i dati arrivano da file statici / yfinance; in produzione da
Bloomberg / Morningstar Direct. Cambiando il provider, il resto non cambia.

Due interfacce centrali:
    - PriceProvider   : fornisce serie storiche di prezzi/rendimenti.
    - RegimeProvider  : fornisce il regime Bull/Bear per asset class.
                        È IL PONTE verso il binario di ricerca sulle opzioni.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import IntEnum
from pathlib import Path

import pandas as pd


# --------------------------------------------------------------------------- #
# Tipi base
# --------------------------------------------------------------------------- #
class Regime(IntEnum):
    """Regime di mercato. Convenzione coerente con i report AlgoEagle:
    +1 = Bullish, -1 = Bearish."""

    BULL = 1
    BEAR = -1


@dataclass(frozen=True)
class PriceData:
    """Contenitore di prezzi e rendimenti per un universo di strumenti.

    Attributi
    ---------
    prices : pd.DataFrame
        Prezzi (o NAV) — index = date (DatetimeIndex), columns = ticker.
    returns : pd.DataFrame
        Rendimenti semplici giornalieri — stesso shape di `prices` meno una riga.
    """

    prices: pd.DataFrame
    returns: pd.DataFrame

    @classmethod
    def from_prices(cls, prices: pd.DataFrame) -> "PriceData":
        prices = prices.sort_index()
        returns = prices.pct_change().dropna(how="all")
        return cls(prices=prices, returns=returns)

    @property
    def tickers(self) -> list[str]:
        return list(self.prices.columns)


# --------------------------------------------------------------------------- #
# PriceProvider
# --------------------------------------------------------------------------- #
class PriceProvider(ABC):
    """Sorgente astratta di prezzi. Implementare per ogni backend dati."""

    @abstractmethod
    def get_prices(
        self,
        tickers: list[str],
        start: str | pd.Timestamp,
        end: str | pd.Timestamp | None = None,
    ) -> PriceData:
        """Restituisce un PriceData per i ticker e l'intervallo richiesti."""
        raise NotImplementedError


class StaticFileProvider(PriceProvider):
    """Provider da file statico (csv/parquet). Per prototipo e test.

    Il file deve avere una colonna data (index) e una colonna per ticker.
    """

    def __init__(self, path: str | Path):
        self.path = Path(path)

    def _load(self) -> pd.DataFrame:
        if self.path.suffix == ".parquet":
            df = pd.read_parquet(self.path)
        else:
            df = pd.read_csv(self.path, index_col=0, parse_dates=True)
        df.index = pd.to_datetime(df.index)
        return df.sort_index()

    def get_prices(self, tickers, start, end=None) -> PriceData:
        df = self._load()
        missing = [t for t in tickers if t not in df.columns]
        if missing:
            raise KeyError(f"Ticker non presenti nel file: {missing}")
        df = df.loc[pd.Timestamp(start) : (pd.Timestamp(end) if end else None), tickers]
        return PriceData.from_prices(df)


# TODO[fase-dati]: BloombergProvider(PriceProvider) usando xbbg/blpapi.
#   - get_prices -> blp.bdh(tickers, 'PX_LAST', start, end)
#   - gestire calendari/holiday, valute, total-return vs price-return.
# TODO[prototipo]: YFinanceProvider(PriceProvider) per smoke test rapidi.


# --------------------------------------------------------------------------- #
# RegimeProvider  —  IL PONTE VERSO LE OPZIONI
# --------------------------------------------------------------------------- #
class RegimeProvider(ABC):
    """Sorgente astratta del regime di mercato per asset class.

    Questa è l'interfaccia che disaccoppia il motore dal modello di regime.
    OGGI: implementazione proxy (ProxyRegimeProvider) basata su trend/vol.
    DOMANI: OptionsRegimeProvider alimentato dal modello sviluppato nel
            binario di ricerca research/options-regime/.

    Il resto del motore dipende SOLO da questa interfaccia, mai dal modello
    concreto: così i due binari (motore / opzioni) procedono in parallelo.
    """

    @abstractmethod
    def get_regime(
        self,
        asset_class: str,
        as_of: pd.Timestamp | str | None = None,
    ) -> Regime:
        """Regime corrente (o a una certa data) per una asset class."""
        raise NotImplementedError

    @abstractmethod
    def get_regime_series(
        self,
        asset_class: str,
        start: pd.Timestamp | str,
        end: pd.Timestamp | str | None = None,
    ) -> pd.Series:
        """Serie storica del regime (index=date, valori in {+1,-1})."""
        raise NotImplementedError


class ProxyRegimeProvider(RegimeProvider):
    """Implementazione PROVVISORIA del regime, senza opzioni.

    Regola semplice e trasparente (volutamente non sofisticata): regime BULL
    se il prezzo dell'indice di riferimento è sopra la sua media mobile lunga,
    BEAR altrimenti. Serve solo a sbloccare lo sviluppo del motore mentre il
    binario opzioni viene studiato a parte.

    Parametri
    ---------
    benchmarks : dict[str, str]
        Mappa asset_class -> ticker indice di riferimento.
    price_provider : PriceProvider
    window : int
        Finestra della media mobile (giorni).
    """

    def __init__(
        self,
        benchmarks: dict[str, str],
        price_provider: PriceProvider,
        window: int = 200,
    ):
        self.benchmarks = benchmarks
        self.price_provider = price_provider
        self.window = window

    def _signal(self, asset_class: str, start, end) -> pd.Series:
        if asset_class not in self.benchmarks:
            raise KeyError(f"Nessun benchmark definito per '{asset_class}'")
        tk = self.benchmarks[asset_class]
        pd_ = self.price_provider.get_prices([tk], start=start, end=end)
        px = pd_.prices[tk]
        ma = px.rolling(self.window, min_periods=self.window // 2).mean()
        reg = pd.Series(
            data=[Regime.BULL if p >= m else Regime.BEAR for p, m in zip(px, ma)],
            index=px.index,
            name=f"regime_{asset_class}",
        )
        return reg

    def get_regime(self, asset_class, as_of=None) -> Regime:
        end = pd.Timestamp(as_of) if as_of else None
        # carica abbastanza storia da calcolare la MA
        start = (end or pd.Timestamp.today()) - pd.Timedelta(days=self.window * 2)
        s = self._signal(asset_class, start=start, end=end)
        return Regime(int(s.iloc[-1]))

    def get_regime_series(self, asset_class, start, end=None) -> pd.Series:
        # estendi indietro per il warm-up della MA, poi taglia
        warmup_start = pd.Timestamp(start) - pd.Timedelta(days=self.window * 2)
        s = self._signal(asset_class, start=warmup_start, end=end)
        return s.loc[pd.Timestamp(start) :]


# TODO[binario-opzioni]: OptionsRegimeProvider(RegimeProvider)
#   Implementare get_regime/get_regime_series leggendo l'output del modello
#   di research/options-regime/ (scomposizione vol implicita long/short ->
#   segnale di regime). Stessa interfaccia: drop-in replacement del proxy.
