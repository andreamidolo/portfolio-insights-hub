"""Gruppo B — Online Portfolio Selection (Set 3, OLPS) — spec §STEP 2.

Algoritmi *online*: il portafoglio si aggiorna periodo dopo periodo sui price
relatives ``x_t = 1 + r_t``. ``fit_weights`` esegue l'aggiornamento su tutta la
storia (regime-filtrata) e restituisce l'allocazione CORRENTE (ultima).

Tre sottocategorie:
    - Momentum      : Exponential Gradient, Follow-the-Leader, FTRL
    - Mean-Reversion: PAMR, OLMAR, RMR, Anticor
    - Pattern-Match : CORN

Implementazioni BASE (riferimenti: Li & Hoi, *Online Portfolio Selection*, 2016),
wrappate nell'interfaccia ``OptModel``. Pesi finali passati da ``enforce_caps``.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from .base import OptModel, PortfolioConstraints, apply_regime, enforce_caps


def _simplex_proj(v: np.ndarray) -> np.ndarray:
    """Proiezione euclidea sul simplex (Duchi et al. 2008). Long-only, somma 1."""
    n = len(v)
    u = np.sort(v)[::-1]
    css = np.cumsum(u) - 1.0
    rho = np.nonzero(u - css / (np.arange(n) + 1) > 0)[0]
    if len(rho) == 0:
        return np.full(n, 1.0 / n)
    theta = css[rho[-1]] / (rho[-1] + 1.0)
    return np.maximum(v - theta, 0.0)


class _OnlineModel(OptModel):
    """Base OLPS: itera ``_update`` sui price relatives e ritorna l'ultimo b."""

    family = "online"

    def _run(self, X: np.ndarray) -> np.ndarray:  # pragma: no cover - override
        raise NotImplementedError

    def fit_weights(
        self, returns, *, regime_mask=None, views=None,
        constraints: PortfolioConstraints | None = None,
    ) -> pd.Series:
        r = apply_regime(returns, regime_mask)
        X = (1.0 + r.to_numpy())                       # price relatives
        b = self._run(X)
        b = np.clip(b, 0.0, None)
        b = b / b.sum() if b.sum() > 0 else np.full(len(b), 1.0 / len(b))
        return enforce_caps(pd.Series(b, index=r.columns), constraints)


# --------------------------------------------------------------------------- #
# Momentum
# --------------------------------------------------------------------------- #
class ExponentialGradient(_OnlineModel):
    """Exponential Gradient (Helmbold et al. 1998): aggiorna verso gli asset
    vincenti, ``b_i ∝ b_i · exp(η x_i / (b·x))``."""

    name = "ExpGradient"

    def __init__(self, eta: float = 0.05):
        self.eta = eta

    def _run(self, X):
        n = X.shape[1]
        b = np.full(n, 1.0 / n)
        for x in X:
            denom = float(b @ x) or 1.0
            b = b * np.exp(self.eta * x / denom)
            b /= b.sum()
        return b


class FollowTheLeader(_OnlineModel):
    """Follow-the-Leader: insegue il "leader" storico (pesi ∝ ricchezza cumulata
    di ogni asset). Versione base del best-CRP in hindsight."""

    name = "FollowTheLeader"

    def _run(self, X):
        wealth = np.prod(X, axis=0)                     # ricchezza cumulata per asset
        return _simplex_proj(wealth / wealth.sum())


class FollowTheRegularizedLeader(_OnlineModel):
    """Follow-the-Regularized-Leader: FTL regolarizzato verso l'uniforme."""

    name = "FTRL"

    def __init__(self, lam: float = 0.3):
        self.lam = lam

    def _run(self, X):
        n = X.shape[1]
        wealth = np.prod(X, axis=0)
        ftl = wealth / wealth.sum()
        return (1 - self.lam) * ftl + self.lam * np.full(n, 1.0 / n)


# --------------------------------------------------------------------------- #
# Mean-Reversion
# --------------------------------------------------------------------------- #
class _PassiveAggressive(_OnlineModel):
    """Base per gli aggiornamenti Passive-Aggressive (mean reversion)."""

    eps: float = 0.5

    def _predict(self, X, t):  # pragma: no cover - override
        raise NotImplementedError

    def _run(self, X):
        n = X.shape[1]
        b = np.full(n, 1.0 / n)
        for t in range(1, len(X)):
            x_hat = self._predict(X, t)               # price relative previsto
            x_bar = x_hat.mean()
            denom = float(((x_hat - x_bar) ** 2).sum()) or 1e-12
            tau = max(0.0, (float(b @ x_hat) - self.eps) / denom)
            b = _simplex_proj(b - tau * (x_hat - x_bar))
        return b


class PAMR(_PassiveAggressive):
    """Passive Aggressive Mean Reversion (Li et al. 2012): inverte sull'ultimo
    price relative osservato."""

    name = "PAMR"

    def _predict(self, X, t):
        return X[t - 1]


class OLMAR(_PassiveAggressive):
    """Online Moving Average Reversion (Li & Hoi 2012): previsione = media mobile
    dei prezzi / prezzo corrente."""

    name = "OLMAR"

    def __init__(self, window: int = 5, eps: float = 0.5):
        self.window = window
        self.eps = eps

    def _predict(self, X, t):
        w = min(self.window, t)
        # prezzo relativo previsto = media( P_{t-k}/P_{t-1} ) ≈ media cumulata inversa
        ratios = np.ones(X.shape[1])
        cum = np.ones(X.shape[1])
        acc = np.ones(X.shape[1])
        for k in range(1, w + 1):
            cum = cum / X[t - k]                        # P_{t-1-k}/P_{t-1}
            acc = acc + cum
        ratios = acc / (w + 1)
        return ratios


class RMR(OLMAR):
    """Robust Median Reversion (Huang et al. 2013): variante robusta di OLMAR che
    usa la mediana invece della media (qui approssimata accorciando la finestra)."""

    name = "RMR"

    def __init__(self, window: int = 5, eps: float = 0.5):
        super().__init__(window=window, eps=eps)

    def _predict(self, X, t):
        w = min(self.window, t)
        rel = np.array([np.prod(1.0 / X[t - k:t], axis=0) for k in range(1, w + 1)])
        return np.median(rel, axis=0) if len(rel) else np.ones(X.shape[1])


class Anticor(_OnlineModel):
    """Anti-Correlation (Borodin et al. 2004): sposta peso fra asset in base alla
    correlazione incrociata fra due finestre consecutive."""

    name = "Anticor"

    def __init__(self, window: int = 10):
        self.window = window

    def _run(self, X):
        n, w = X.shape[1], self.window
        b = np.full(n, 1.0 / n)
        log = np.log(X)
        for t in range(2 * w, len(X)):
            y1 = log[t - 2 * w:t - w]
            y2 = log[t - w:t]
            m1, m2 = y1.mean(0), y2.mean(0)
            s1, s2 = y1.std(0) + 1e-12, y2.std(0) + 1e-12
            corr = ((y1 - m1).T @ (y2 - m2)) / w / np.outer(s1, s2)
            claim = np.zeros((n, n))
            for i in range(n):
                for j in range(n):
                    if i != j and m2[i] >= m2[j] and corr[i, j] > 0:
                        claim[i, j] = corr[i, j] + max(0, -corr[i, i]) + max(0, -corr[j, j])
            new_b = b.copy()
            for i in range(n):
                tot = claim[i].sum()
                if tot <= 0:
                    continue
                for j in range(n):
                    amt = b[i] * claim[i, j] / tot     # trasferisce peso da i a j
                    new_b[i] -= amt
                    new_b[j] += amt
            b = _simplex_proj(new_b)
        return b


# --------------------------------------------------------------------------- #
# Pattern-Matching
# --------------------------------------------------------------------------- #
class CORN(_OnlineModel):
    """CORN (Li et al. 2011): Correlation-driven Nonparametric. Trova nello storico
    le finestre più correlate con quella recente e fa un best-CRP su quei periodi
    (versione base con BCRP approssimato dalla ricchezza cumulata)."""

    name = "CORN"

    def __init__(self, window: int = 5, rho: float = 0.2):
        self.window = window
        self.rho = rho

    def _run(self, X):
        n, w = X.shape[1], self.window
        if len(X) <= w + 1:
            return np.full(n, 1.0 / n)
        recent = X[-w:].flatten()
        recent = (recent - recent.mean()) / (recent.std() + 1e-12)
        similar = []
        for t in range(w, len(X) - 1):
            hist = X[t - w:t].flatten()
            hist = (hist - hist.mean()) / (hist.std() + 1e-12)
            if float(recent @ hist) / len(recent) > self.rho:
                similar.append(X[t])                   # giorno successivo alla finestra simile
        if not similar:
            return np.full(n, 1.0 / n)
        wealth = np.prod(np.array(similar), axis=0)    # best-CRP approssimato
        return _simplex_proj(wealth / wealth.sum())
