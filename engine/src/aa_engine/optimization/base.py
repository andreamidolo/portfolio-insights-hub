"""Ossatura dell'ottimizzazione — l'interfaccia ``OptModel`` e i vincoli.

Spec: ``docs/07_phase3_optimization_spec.md`` §1, §3. L'interfaccia è ciò che
rende il sistema scalabile a 40 modelli: aggiungere un modello = una classe in più
con ``fit_weights``. I modelli concreti si appoggiano a Riskfolio-Lib (import
"morbido": il package resta importabile anche dove non è installato; l'errore
emerge solo se si prova a usare un modello che lo richiede).
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass

import pandas as pd


# --------------------------------------------------------------------------- #
# Vincoli di portafoglio (§3)
# --------------------------------------------------------------------------- #
@dataclass
class PortfolioConstraints:
    """Vincoli di portafoglio. I profili di rischio si esprimono come vincoli.

    Attributi
    ---------
    w_min, w_max : float            peso minimo/massimo per strumento
    max_equity : float | None       cap sull'asset class "Equity" (es. 0.60 balanced)
    asset_class_caps : dict|None     cap per altre asset class {classe: cap}
    long_only : bool                 nessuna posizione corta
    asset_class_map : dict|None      mappa ticker -> asset class (per i cap di classe)
    equity_class : str               nome dell'asset class equity (default "Equity")
    """

    w_min: float = 0.0
    w_max: float = 1.0
    max_equity: float | None = None
    min_equity: float | None = None
    asset_class_caps: dict[str, float] | None = None
    asset_class_floors: dict[str, float] | None = None
    long_only: bool = True
    asset_class_map: dict[str, str] | None = None
    equity_class: str = "Equity"

    @classmethod
    def for_profile(
        cls, profile: str, asset_class_map: dict[str, str] | None = None
    ) -> "PortfolioConstraints":
        """Vincoli predefiniti per profilo: l'equity è un INTERVALLO per profilo.

        I profili non sono solo un tetto sull'equity (un ottimizzatore avverso al
        rischio non lo toccherebbe mai e i profili collasserebbero): sono un
        *range*. Così l'allocazione è coerentemente più/meno rischiosa.
        """
        ranges = {                       # (min_equity, max_equity)
            "moderate": (None, 0.30),
            "balanced": (0.30, 0.60),
            "aggressive": (0.60, None),
        }
        if profile not in ranges:
            raise ValueError(f"Profilo sconosciuto: {profile!r}")
        lo, hi = ranges[profile]
        return cls(
            w_max=0.40,
            min_equity=lo,
            max_equity=hi,
            long_only=True,
            asset_class_map=asset_class_map,
        )

    def class_caps(self) -> dict[str, float]:
        """Cap effettivi per asset class (max_equity + asset_class_caps)."""
        caps: dict[str, float] = dict(self.asset_class_caps or {})
        if self.max_equity is not None:
            caps[self.equity_class] = self.max_equity
        return caps

    def class_floors(self) -> dict[str, float]:
        """Floor effettivi per asset class (min_equity + asset_class_floors)."""
        floors: dict[str, float] = dict(self.asset_class_floors or {})
        if self.min_equity is not None:
            floors[self.equity_class] = self.min_equity
        return floors


# --------------------------------------------------------------------------- #
# Interfaccia comune (§1)
# --------------------------------------------------------------------------- #
class OptModel(ABC):
    """Contratto comune a ogni modello di ottimizzazione.

    Un modello mappa rendimenti (degli strumenti selezionati) → pesi (somma 1).
    """

    name: str = "OptModel"
    family: str = "base"  # "classics" | "bayesian" | "ai" | "baseline"

    @abstractmethod
    def fit_weights(
        self,
        returns: pd.DataFrame,
        *,
        regime_mask: pd.Series | None = None,
        views: dict | None = None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        """Pesi ottimi (index = ticker, somma = 1)."""
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover
        return f"{type(self).__name__}(name={self.name!r}, family={self.family!r})"


# --------------------------------------------------------------------------- #
# Helper condivisi
# --------------------------------------------------------------------------- #
def _rf():
    """Import "morbido" di Riskfolio-Lib con messaggio chiaro se assente."""
    try:
        import riskfolio as rf
    except Exception as exc:  # pragma: no cover
        raise ImportError(
            "Riskfolio-Lib è richiesto per questo modello di ottimizzazione. "
            "Installa con: pip install -e \".[dev]\" (o Riskfolio-Lib>=6)."
        ) from exc
    return rf


def apply_regime(returns: pd.DataFrame, regime_mask: pd.Series | None) -> pd.DataFrame:
    """Filtra i rendimenti sui giorni del regime corrente (coerente col risk engine)."""
    if regime_mask is None:
        return returns
    mask = regime_mask.reindex(returns.index).fillna(False).astype(bool)
    return returns.loc[mask]


def normalize_weights(
    w: pd.Series, tickers, constraints: PortfolioConstraints | None
) -> pd.Series:
    """Allinea ai ticker, applica long-only e rinormalizza a somma 1."""
    s = pd.Series(w, dtype=float).reindex(tickers).fillna(0.0)
    if constraints is None or constraints.long_only:
        s = s.clip(lower=0.0)
    total = s.sum()
    if total <= 0:
        return pd.Series(1.0 / len(tickers), index=tickers)
    return s / total


def equal_weights(tickers) -> pd.Series:
    return pd.Series(1.0 / len(tickers), index=list(tickers))


def _constraints_frame(
    tickers, constraints: PortfolioConstraints
) -> tuple[pd.DataFrame, pd.DataFrame] | tuple[None, None]:
    """Costruisce (constraints_df, asset_classes_df) per ``rf.assets_constraints``.

    Traduce ``PortfolioConstraints`` in righe nel formato Riskfolio:
    bound per-asset (``All Assets``) e cap per asset class (``Classes``).
    Ritorna (None, None) se non ci sono vincoli lineari da imporre.
    """
    rows = []
    if constraints.w_max < 1.0:
        rows.append(_row("All Assets", sign="<=", weight=constraints.w_max))
    if constraints.w_min > 0.0:
        rows.append(_row("All Assets", sign=">=", weight=constraints.w_min))

    acmap = constraints.asset_class_map or {}
    classes = pd.DataFrame(
        {"Assets": list(tickers), "Class": [acmap.get(t, "Other") for t in tickers]}
    )
    present = set(classes["Class"].values)
    for cls, cap in constraints.class_caps().items():
        if cls in present:
            rows.append(_row("Classes", sign="<=", weight=cap, set_="Class", position=cls))
    for cls, floor in constraints.class_floors().items():
        if cls in present:
            rows.append(_row("Classes", sign=">=", weight=floor, set_="Class", position=cls))

    if not rows:
        return None, None
    return pd.DataFrame(rows), classes


def _row(type_, *, sign, weight, set_="", position=""):
    return {
        "Disabled": False, "Type": type_, "Set": set_, "Position": position,
        "Sign": sign, "Weight": weight, "Type Relative": "", "Relative Set": "",
        "Relative": "", "Factor": "",
    }


def make_portfolio(returns: pd.DataFrame, constraints: PortfolioConstraints | None):
    """Crea e configura un ``rf.Portfolio`` (stats + vincoli) pronto da ottimizzare."""
    rf = _rf()
    port = rf.Portfolio(returns=returns)
    # Ledoit-Wolf: covarianza sempre definita positiva (evita i fallimenti del
    # solver su universi con strumenti a varianza minima / quasi collineari).
    port.assets_stats(method_mu="hist", method_cov="ledoit")
    port.sht = False if (constraints is None or constraints.long_only) else True
    port.budget = 1.0
    if constraints is not None:
        cons_df, classes_df = _constraints_frame(returns.columns, constraints)
        if cons_df is not None:
            A, B = rf.assets_constraints(cons_df, classes_df)
            port.ainequality = A
            port.binequality = B
    return port


def enforce_caps(w: pd.Series, constraints: PortfolioConstraints | None) -> pd.Series:
    """Impone per-asset bound e cap di asset class su pesi già calcolati.

    Usata dai modelli euristici (HRP/HERC/NCO) e come rete di sicurezza
    sull'allocazione finale dell'ensemble: clip per-asset + scaling iterativo
    delle classi oltre il cap, poi rinormalizzazione a somma 1.
    """
    if constraints is None:
        return w / w.sum()
    s = w.clip(lower=0.0).astype(float)
    w_max = constraints.w_max
    caps = constraints.class_caps()
    floors = constraints.class_floors()
    acmap = constraints.asset_class_map or {}
    tol = 1e-12
    for _ in range(300):
        s = s / s.sum()
        viol = False
        # cap per-asset: ridistribuisci l'eccesso agli strumenti sotto-cap
        over = s > w_max + tol
        if over.any() and (~over).any():
            viol = True
            excess = float((s[over] - w_max).sum())
            s[over] = w_max
            under = ~over
            s[under] = s[under] + excess * s[under] / s[under].sum()
        # cap per asset class: scala la classe e ridistribuisci alle altre
        for cls, cap in caps.items():
            members = [t for t in s.index if acmap.get(t) == cls]
            others = [t for t in s.index if acmap.get(t) != cls]
            cw = float(s[members].sum())
            if cw > cap + tol and others:
                viol = True
                s[members] = s[members] * (cap / cw)
                s[others] = s[others] + (cw - cap) * s[others] / s[others].sum()
        # floor per asset class: porta la classe al minimo prendendo dalle altre
        for cls, floor in floors.items():
            members = [t for t in s.index if acmap.get(t) == cls]
            others = [t for t in s.index if acmap.get(t) != cls]
            cw = float(s[members].sum())
            ow = float(s[others].sum())
            if cw < floor - tol and others and ow > 0:
                viol = True
                deficit = floor - cw
                if cw > 0:
                    s[members] = s[members] * (floor / cw)
                else:  # classe a zero: distribuisci il floor in parti uguali
                    s[members] = floor / len(members)
                s[others] = s[others] * (1.0 - deficit / ow)
        if not viol:
            break
    return s / s.sum()


def weights_from_rf(w_df, tickers, constraints) -> pd.Series:
    """Estrae la colonna 'weights' da un output Riskfolio e normalizza."""
    if w_df is None or len(w_df) == 0:
        # solver fallito/infeasible: fallback trasparente a equal weight
        return equal_weights(tickers)
    col = "weights" if "weights" in getattr(w_df, "columns", []) else w_df.columns[0]
    return normalize_weights(w_df[col], tickers, constraints)
