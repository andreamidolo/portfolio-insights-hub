"""Security selection — la parte DETERMINISTICA dei segnali (Stadio 1, spec §5).

Regola (slide 36-38 AlgoEagle): in una asset class in regime BULL si tengono
anche gli strumenti ad alto rischio; in regime BEAR si eliminano quelli a rischio
medio-alto. È l'input dell'ottimizzazione: decide *quali* strumenti entrano.

Il REGIME arriva SOLO da ``RegimeProvider`` (proxy oggi, opzioni domani): i
segnali lo CONSUMANO, non lo calcolano. Trend scanner, oscillatori, ensemble SVM
e alpha crash sono fasi successive — non qui.
"""

from __future__ import annotations

import pandas as pd

from aa_engine.data import Regime, RegimeProvider


def select_securities(
    universe: list[str],
    asset_class_map: dict[str, str],
    regime_provider: RegimeProvider,
    risk_by_security: pd.Series,
    *,
    as_of=None,
    risk_quantile: float = 0.5,
) -> list[str]:
    """Seleziona gli strumenti da passare all'ottimizzazione.

    Parametri
    ---------
    universe : list[str]              strumenti candidati
    asset_class_map : dict            ticker -> asset class
    regime_provider : RegimeProvider  fornisce il regime per asset class
    risk_by_security : pd.Series      rischio per strumento (dal risk engine)
    as_of : data | None               istante di valutazione del regime
    risk_quantile : float             soglia "rischio medio-alto": gli strumenti
                                      sopra questo quantile (sull'universo) sono
                                      considerati rischiosi e scartati in BEAR

    Regola
    ------
    - asset class BULL  → tieni TUTTI gli strumenti (anche gli ad alto rischio);
    - asset class BEAR  → scarta gli strumenti a rischio sopra ``risk_quantile``.

    Ritorna la lista (ordinata come ``universe``) degli strumenti selezionati.
    """
    if risk_by_security.empty:
        return list(universe)
    threshold = float(risk_by_security.quantile(risk_quantile))

    selected: list[str] = []
    regime_cache: dict[str, Regime] = {}
    for ticker in universe:
        ac = asset_class_map.get(ticker, "Other")
        if ac not in regime_cache:
            regime_cache[ac] = regime_provider.get_regime(ac, as_of=as_of)
        regime = regime_cache[ac]

        if regime == Regime.BULL:
            selected.append(ticker)                       # tieni tutto
        else:  # BEAR: scarta il rischio medio-alto
            risk = risk_by_security.get(ticker)
            if risk is None or risk <= threshold:
                selected.append(ticker)
    return selected
