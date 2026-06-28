"""Test del backtest backbone (Fase 2.5): performance, splitter, runner."""

from __future__ import annotations

from math import comb

import numpy as np
import pandas as pd
import pytest

from aa_engine.backtest import (
    CombinatorialPurgedCV,
    WalkForwardSplitter,
    cpcv_backtest,
    performance_summary,
    walk_forward_backtest,
)
from aa_engine.backtest.strategies import equal_weight, inverse_volatility


@pytest.fixture
def returns() -> pd.DataFrame:
    rng = np.random.default_rng(11)
    dates = pd.bdate_range("2020-01-01", periods=900)
    tickers = ["A", "B", "C", "D"]
    mkt = rng.standard_t(df=6, size=len(dates)) * 0.008
    betas = np.array([1.0, 0.8, -0.2, 0.4])
    idio = rng.normal(0, 0.006, size=(len(dates), len(tickers)))
    rets = mkt[:, None] * betas[None, :] + idio + 0.0003
    return pd.DataFrame(rets, index=dates, columns=tickers)


# --------------------------------------------------------------------------- #
# Performance
# --------------------------------------------------------------------------- #
def test_performance_basic_relationships():
    rng = np.random.default_rng(0)
    r = pd.Series(rng.normal(0.0005, 0.01, 750))
    stats = performance_summary(r)
    assert stats.n_obs == 750
    assert stats.volatility > 0
    assert stats.max_drawdown >= 0
    assert 0.0 <= stats.hit_ratio <= 1.0
    # vol annualizzata ≈ std giornaliera × √252
    assert stats.volatility == pytest.approx(r.std(ddof=1) * np.sqrt(252), rel=1e-6)


def test_performance_positive_drift_has_positive_sharpe():
    r = pd.Series([0.001] * 252)  # rendimento costante positivo
    stats = performance_summary(r)
    assert stats.total_return > 0
    assert stats.cagr > 0
    assert stats.max_drawdown == pytest.approx(0.0, abs=1e-12)  # nessun drawdown


# --------------------------------------------------------------------------- #
# WalkForwardSplitter
# --------------------------------------------------------------------------- #
def test_walkforward_windows_disjoint_and_sized():
    wf = WalkForwardSplitter(train_size=100, test_size=20)
    splits = list(wf.split(300))
    assert wf.n_splits(300) == len(splits)
    seen_test: list[int] = []
    for train_idx, test_idx in splits:
        assert len(train_idx) == 100
        assert len(test_idx) == 20
        assert train_idx.max() < test_idx.min()          # train precede test
        assert set(train_idx).isdisjoint(test_idx)
        seen_test.extend(test_idx.tolist())
    assert len(seen_test) == len(set(seen_test))          # test non-overlapping


def test_walkforward_expanding_grows_train():
    wf = WalkForwardSplitter(train_size=100, test_size=50, expanding=True)
    sizes = [len(tr) for tr, _ in wf.split(300)]
    assert sizes == sorted(sizes)                          # train monotòno crescente
    assert sizes[0] == 100


# --------------------------------------------------------------------------- #
# Combinatorial Purged CV
# --------------------------------------------------------------------------- #
def test_cpcv_split_count():
    cv = CombinatorialPurgedCV(n_groups=6, n_test_groups=2, embargo=0.0)
    assert cv.n_splits == comb(6, 2) == 15
    assert len(list(cv.split(600))) == 15


def test_cpcv_no_leakage_with_embargo():
    n = 600
    cv = CombinatorialPurgedCV(n_groups=6, n_test_groups=2, embargo=0.02)
    emb = int(np.ceil(0.02 * n))
    for train_idx, test_idx in cv.split(n):
        assert set(train_idx).isdisjoint(test_idx)
        # nessun indice di train entro `emb` da un indice di test
        gap = np.abs(train_idx[:, None] - test_idx[None, :]).min()
        assert gap > emb


def test_cpcv_rejects_bad_params():
    with pytest.raises(ValueError):
        CombinatorialPurgedCV(n_groups=4, n_test_groups=4)


# --------------------------------------------------------------------------- #
# Runner end-to-end
# --------------------------------------------------------------------------- #
def test_walk_forward_backtest_runs(returns):
    wf = WalkForwardSplitter(train_size=252, test_size=63)
    result = walk_forward_backtest(returns, inverse_volatility, wf)
    assert result.method == "walk_forward"
    assert result.n_folds == wf.n_splits(returns)
    assert result.stats is not None and result.stats.n_obs == len(result.oos_returns)
    # il path OOS copre l'unione delle finestre di test (disgiunte)
    assert len(result.oos_returns) == result.n_folds * 63
    assert np.isfinite(result.stats.volatility)


def test_cpcv_backtest_distribution(returns):
    cv = CombinatorialPurgedCV(n_groups=6, n_test_groups=2, embargo=0.01)
    result = cpcv_backtest(returns, equal_weight, cv)
    assert result.method == "cpcv"
    assert result.n_folds == cv.n_splits
    frame = result.fold_stats_frame()
    assert len(frame) == cv.n_splits
    assert "sharpe" in frame.columns
    dist = result.distribution()
    assert {"mean", "median", "std"}.issubset(dist.columns)
    assert "sharpe_mean" in result.summary()


def test_inverse_volatility_weights_valid(returns):
    w = inverse_volatility(returns.iloc[:252])
    assert w.sum() == pytest.approx(1.0, abs=1e-9)
    assert (w >= 0).all()
    # lo strumento meno volatile pesa più del più volatile
    vols = returns.iloc[:252].std(ddof=1)
    assert w[vols.idxmin()] > w[vols.idxmax()]
