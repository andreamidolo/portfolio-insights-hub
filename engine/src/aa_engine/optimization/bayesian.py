"""Modello bayesiano: Black-Litterman (famiglia "bayesian").

Implementa la posterior di Black-Litterman in forma chiusa (prior = equilibrio di
mercato con pesi equal-weight) e ottimizza i rendimenti a posteriori con
``rf.Portfolio`` (max Sharpe). Il parametro ``views`` è IL PONTE verso i segnali
(Stadio 1): oggi passabile a mano, domani prodotto dai forecast.

Formato `views` atteso (views ASSOLUTE):
    {ticker: rendimento_atteso_giornaliero}
es. {"EQ_US": 0.0006} = "mi aspetto +0.06%/giorno su EQ_US".
Views vuote/None → la posterior coincide con l'equilibrio (Pi).
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .base import (
    OptModel,
    PortfolioConstraints,
    apply_regime,
    make_portfolio,
    weights_from_rf,
)


class BlackLitterman(OptModel):
    """Black-Litterman: posterior bayesiana sui rendimenti → max Sharpe.

    Parametri
    ---------
    delta : float    coefficiente di avversione al rischio (equilibrio)
    tau : float      incertezza sul prior (scala di Sigma)
    """

    name = "BlackLitterman"
    family = "bayesian"

    def __init__(self, delta: float = 2.5, tau: float = 0.05):
        self.delta = delta
        self.tau = tau

    def _posterior_mu(
        self, returns: pd.DataFrame, views: dict | None
    ) -> np.ndarray:
        tickers = list(returns.columns)
        sigma = returns.cov().to_numpy()
        n = len(tickers)
        w_eq = np.full(n, 1.0 / n)
        pi = self.delta * sigma @ w_eq          # rendimenti di equilibrio
        if not views:
            return pi

        idx = {t: i for i, t in enumerate(tickers)}
        rows = [(idx[t], q) for t, q in views.items() if t in idx]
        if not rows:
            return pi
        k = len(rows)
        P = np.zeros((k, n))
        Q = np.zeros(k)
        for j, (i, q) in enumerate(rows):
            P[j, i] = 1.0
            Q[j] = q
        tau_sigma = self.tau * sigma
        omega = np.diag(np.diag(P @ tau_sigma @ P.T))   # incertezza delle view
        inv_ts = np.linalg.inv(tau_sigma)
        inv_om = np.linalg.inv(omega)
        post_cov = np.linalg.inv(inv_ts + P.T @ inv_om @ P)
        return post_cov @ (inv_ts @ pi + P.T @ inv_om @ Q)

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        mu_post = self._posterior_mu(r, views)
        port = make_portfolio(r, constraints)
        # Sostituisce i rendimenti attesi con la posterior BL, poi max Sharpe.
        port.mu = pd.DataFrame(mu_post.reshape(1, -1), columns=list(r.columns))
        w = port.optimization(model="Classic", rm="MV", obj="Sharpe", rf=0, l=0, hist=True)
        return weights_from_rf(w, r.columns, constraints)
