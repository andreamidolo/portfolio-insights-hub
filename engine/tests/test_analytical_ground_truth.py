"""Giudice analitico del risk engine (audit Fase 2, Parti C–D).

Questi test NON dipendono dai target AlgoEagle ma da matematica nota: una
Normale pura con volatilità giornaliera nota. Se l'annualizzazione o le formule
fossero sbagliate, falliscono. Sono il "giudice" che separa un bug da un semplice
"input diverso" rispetto ai report AlgoEagle.

Convenzioni dichiarate:
    - Tutte le metriche di coda/dispersione sono ANNUALIZZATE ×√252 (default).
    - Kurtosis = Pearson/raw (Normale → 3), non excess.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from aa_engine.risk import compute_measure

SIGMA_D = 0.01          # volatilità giornaliera nota
N = 100_000             # campione grande → stime stabili
SQRT_252 = np.sqrt(252)

# Costanti della Normale standard
Z_95 = 1.6449           # quantile 95%
ES_95 = 2.0627          # expected shortfall 95% = phi(z)/alpha
CVAR_OVER_VAR = ES_95 / Z_95   # ≈ 1.2538


@pytest.fixture(scope="module")
def normal_returns() -> tuple[pd.DataFrame, pd.Series]:
    rng = np.random.default_rng(12345)
    r = pd.DataFrame({"X": rng.normal(0.0, SIGMA_D, N)}, index=pd.RangeIndex(N))
    w = pd.Series([1.0], index=["X"])
    return r, w


# --------------------------------------------------------------------------- #
# PARTE C — ground truth analitico (annualizzazione)
# --------------------------------------------------------------------------- #
def test_stddev_annualized(normal_returns):
    r, w = normal_returns
    assert compute_measure(r, w, "MV") == pytest.approx(SIGMA_D * SQRT_252, rel=0.02)


def test_var_annualized(normal_returns):
    r, w = normal_returns
    expected = Z_95 * SIGMA_D * SQRT_252
    assert compute_measure(r, w, "VaR", alpha=0.05) == pytest.approx(expected, rel=0.02)


def test_cvar_annualized(normal_returns):
    r, w = normal_returns
    expected = ES_95 * SIGMA_D * SQRT_252
    assert compute_measure(r, w, "CVaR", alpha=0.05) == pytest.approx(expected, rel=0.03)


def test_cvar_over_var_ratio_normal(normal_returns):
    r, w = normal_returns
    var = compute_measure(r, w, "VaR", alpha=0.05)
    cvar = compute_measure(r, w, "CVaR", alpha=0.05)
    assert cvar / var == pytest.approx(CVAR_OVER_VAR, rel=0.02)


def test_skewness_zero(normal_returns):
    r, w = normal_returns
    assert compute_measure(r, w, "SKEW") == pytest.approx(0.0, abs=0.03)


def test_kurtosis_pearson_three(normal_returns):
    """Kurtosis = Pearson/raw: Normale → 3 (NON excess)."""
    r, w = normal_returns
    assert compute_measure(r, w, "KT") == pytest.approx(3.0, abs=0.1)


def test_drawdown_not_annualized():
    """I drawdown vivono nello spazio 'livello': nessun fattore √252.

    Su un'equity costruita ad hoc il MDD deve essere il valore grezzo, non
    moltiplicato per √252.
    """
    # equity: sale a 110 poi scende a 99 → drawdown massimo = (110-99)/110 = 0.1
    prices = pd.Series([100, 110, 99], dtype=float)
    rets = prices.pct_change().dropna().to_frame("X")
    w = pd.Series([1.0], index=["X"])
    mdd = compute_measure(rets, w, "MDD")
    assert mdd == pytest.approx(0.1, abs=1e-9)          # grezzo, NON ×√252


# --------------------------------------------------------------------------- #
# PARTE D — coerenze (devono restare verdi dopo le regole di annualizzazione)
# --------------------------------------------------------------------------- #
@pytest.fixture(scope="module")
def fat_tailed() -> tuple[pd.DataFrame, pd.Series]:
    rng = np.random.default_rng(7)
    dates = pd.bdate_range("2020-01-01", periods=1500)
    tickers = ["A", "B", "C", "D"]
    mkt = rng.standard_t(df=4, size=len(dates)) * 0.009
    betas = np.array([1.1, 0.9, -0.2, 0.4])
    idio = rng.normal(0, 0.006, size=(len(dates), len(tickers)))
    rets = pd.DataFrame(mkt[:, None] * betas[None, :] + idio, index=dates, columns=tickers)
    w = pd.Series([0.4, 0.3, 0.2, 0.1], index=tickers)
    return rets, w


def _val(rw, code):
    r, w = rw
    return compute_measure(r, w, code, alpha=0.05)


def test_tail_coherence_chain(fat_tailed):
    """VaR ≤ CVaR ≤ EVaR ≤ RLVaR ≤ WR."""
    chain = ["VaR", "CVaR", "EVaR", "RLVaR", "WR"]
    values = [_val(fat_tailed, c) for c in chain]
    assert values == sorted(values), dict(zip(chain, values))


def test_drawdown_coherence_chain(fat_tailed):
    """DaR ≤ CDaR ≤ EDaR ≤ RLDaR ≤ MDD."""
    chain = ["DaR", "CDaR", "EDaR", "RLDaR", "MDD"]
    values = [_val(fat_tailed, c) for c in chain]
    assert values == sorted(values), dict(zip(chain, values))


def test_semistd_leq_std(fat_tailed):
    """MSV ≤ MV (la semi-deviazione coglie solo il downside)."""
    assert _val(fat_tailed, "MSV") <= _val(fat_tailed, "MV")
