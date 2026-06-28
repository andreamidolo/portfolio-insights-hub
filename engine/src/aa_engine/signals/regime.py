"""Provider di regime semplici per test/demo (oltre al ProxyRegimeProvider).

``StaticRegimeProvider`` permette di FORZARE il regime per asset class — utile
per i test e per il check di sanità "cambiando regime cambia la selezione".
Il regime resta sempre dietro l'interfaccia ``RegimeProvider``: i segnali lo
consumano, non lo calcolano (il binario opzioni resta sganciato).
"""

from __future__ import annotations

import pandas as pd

from aa_engine.data import Regime, RegimeProvider


class StaticRegimeProvider(RegimeProvider):
    """Regime fisso per asset class (drop-in del ProxyRegimeProvider per i test)."""

    def __init__(self, regimes: dict[str, Regime], default: Regime = Regime.BULL):
        self.regimes = regimes
        self.default = default

    def get_regime(self, asset_class: str, as_of=None) -> Regime:
        return self.regimes.get(asset_class, self.default)

    def get_regime_series(self, asset_class, start, end=None) -> pd.Series:
        idx = pd.bdate_range(start, end or start)
        return pd.Series(int(self.get_regime(asset_class)), index=idx)
