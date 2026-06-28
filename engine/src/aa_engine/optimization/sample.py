"""Universo campione deterministico per demo/test dell'ottimizzazione.

Equity con rendimento atteso più alto (e più rischiosa): così i cap di profilo
"mordono" (il check di ordinamento del rischio ha senso) e la security selection
in BEAR scarta gli strumenti rischiosi.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

ASSET_CLASS_MAP: dict[str, str] = {
    "EQ_DM": "Equity",
    "EQ_EM": "Equity",
    "HY": "HY",
    "BOND": "Fixed Income",
    "GOLD": "Gold",
    "COMMOD": "Commodities",
    "CASH": "Money Market",
}

# (beta sul fattore di mercato, drift giornaliero, vol idiosincratica annua)
# Equity: alto rendimento E alto rischio → i cap di profilo mordono (check #2) e
# la selezione in BEAR la scarta (check #3). Money market ~ rendimento in eccesso
# nullo (niente Sharpe artificiale che fa collassare l'ottimizzazione su CASH).
_SPECS = {
    "EQ_DM": (1.0, 0.00055, 0.10),
    "EQ_EM": (1.2, 0.00060, 0.14),
    "HY": (0.5, 0.00026, 0.07),
    "BOND": (-0.2, 0.00010, 0.045),
    "GOLD": (0.1, 0.00022, 0.13),
    "COMMOD": (0.5, 0.00014, 0.17),
    "CASH": (0.0, 0.00002, 0.003),
}

TRADING_DAYS = 252


def sample_returns(periods: int = 900, seed: int = 20260628) -> pd.DataFrame:
    """Rendimenti giornalieri sintetici (date × ticker), code grasse + un crash.

    Il fattore di mercato include un episodio di **drawdown** (trend rialzista
    interrotto da una correzione): senza crash il rischio non ha nulla da gestire
    e 1/N è imbattibile (DeMiguel 2009). Con un drawdown realistico la gestione
    del rischio può aggiungere valore.
    """
    rng = np.random.default_rng(seed)
    dates = pd.bdate_range("2019-01-01", periods=periods)
    daily = 0.11 / np.sqrt(TRADING_DAYS)
    mkt = rng.standard_t(df=5, size=periods) * daily
    # crash: ~20 giorni di mercato negativo e volatile, nel tratto OOS
    c0 = int(periods * 0.82)
    crash = slice(c0, c0 + 20)
    mkt[crash] += rng.normal(-0.012, 0.015, size=20)
    cols = {}
    for tk, (beta, drift, vol) in _SPECS.items():
        idio = rng.normal(0.0, vol / np.sqrt(TRADING_DAYS), size=periods)
        cols[tk] = drift + beta * mkt + idio
    return pd.DataFrame(cols, index=dates)
