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


class BayesStein(OptModel):
    """Bayes-Stein (Jorion 1986): shrinkage della media verso il portafoglio a
    minima varianza, poi max Sharpe sui rendimenti corretti.

    Riduce l'errore di stima della media (il punto debole di Markowitz):
        μ_0 = rendimento del min-variance portfolio (grand mean)
        φ   = (N+2) / ((N+2) + T·(μ−μ_0)' Σ⁻¹ (μ−μ_0))
        μ_bs = (1−φ)·μ + φ·μ_0
    """

    name = "BayesStein"
    family = "bayesian"

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        mu = r.mean().to_numpy()
        sigma = r.cov().to_numpy()
        n, t = len(mu), len(r)
        inv = np.linalg.pinv(sigma)
        ones = np.ones(n)
        mu0 = float((ones @ inv @ mu) / (ones @ inv @ ones))      # mean del min-var port
        diff = mu - mu0
        denom = (n + 2) + t * float(diff @ inv @ diff)
        phi = (n + 2) / denom if denom > 0 else 0.0
        mu_bs = (1 - phi) * mu + phi * mu0

        port = make_portfolio(r, constraints)
        port.mu = pd.DataFrame(mu_bs.reshape(1, -1), columns=list(r.columns))
        w = port.optimization(model="Classic", rm="MV", obj="Sharpe", rf=0, l=0, hist=True)
        return weights_from_rf(w, r.columns, constraints)


class MeucciEntropyPooling(OptModel):
    """Entropy Pooling (Meucci), versione BASE documentata.

    Reweighta le probabilità degli scenari storici verso un prior uniforme con la
    minima entropia relativa, sotto una *view* conservativa: il rendimento medio
    di mercato è ridotto (shrink) rispetto allo storico. La soluzione duale è un
    tilting esponenziale ``p_i ∝ exp(λ·m_i)`` (λ risolto per matchare la view).
    Dai momenti p-pesati si calcola la max-Sharpe.

    NON è la versione completa (views multiple, vincoli su covarianza): è una
    variante ragionevole e documentata, da raffinare in seguito.

    TODO[opt]: generalizzare a views multiple (medie, vol, correlazioni).
    """

    name = "MeucciEP"
    family = "bayesian"

    def __init__(self, shrink: float = 0.5):
        self.shrink = shrink            # quota di shrink del rendimento di mercato

    def _entropy_pooling_probs(self, market: np.ndarray, target: float) -> np.ndarray:
        # p_i ∝ exp(λ m_i), trova λ tale che Σ p_i m_i = target (monotòno in λ)
        from scipy.optimize import brentq

        def mean_at(lam):
            w = np.exp(lam * (market - market.mean()))
            w /= w.sum()
            return float(w @ market) - target

        lo, hi = -500.0, 500.0
        try:
            lam = brentq(mean_at, lo, hi, maxiter=200)
        except ValueError:
            lam = 0.0                   # view non raggiungibile: resta sul prior
        w = np.exp(lam * (market - market.mean()))
        return w / w.sum()

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        X = r.to_numpy()
        market = X.mean(axis=1)                     # proxy "mercato" giornaliero
        target = self.shrink * float(market.mean())  # view conservativa sul mercato
        p = self._entropy_pooling_probs(market, target)

        mu_post = p @ X                              # media a posteriori per asset
        Xc = X - mu_post
        cov_post = (Xc * p[:, None]).T @ Xc          # covarianza p-pesata

        port = make_portfolio(r, constraints)
        port.mu = pd.DataFrame(mu_post.reshape(1, -1), columns=list(r.columns))
        port.cov = pd.DataFrame(cov_post, index=list(r.columns), columns=list(r.columns))
        w = port.optimization(model="Classic", rm="MV", obj="Sharpe", rf=0, l=0, hist=True)
        return weights_from_rf(w, r.columns, constraints)
