"""Test dello Stadio 1 — Signals (tecnici, SUMMARY, ponte BL, SVM).

I segnali tecnici / SUMMARY / SVM non richiedono Riskfolio; il test del ponte
Black-Litterman sì (importorskip locale).
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from aa_engine.data import Regime
from aa_engine.signals import (
    AIForecast,
    AlphaCrashSignal,
    OscillatorSignal,
    TrendSignal,
    summary_signal,
    summary_to_bl_views,
)
from aa_engine.signals.base import DIRECTION, PROBABILITY


@pytest.fixture(scope="module")
def market() -> tuple[pd.DataFrame, pd.DataFrame]:
    """Prezzi noti: trend su, trend giù, oversold (crash recente), laterale."""
    dates = pd.bdate_range("2020-01-01", periods=400)
    n = len(dates)
    up = 100 * (1.0006) ** np.arange(n)
    down = 100 * (0.9994) ** np.arange(n)
    flat = 100 + np.sin(np.arange(n) / 10)
    crash = up.copy()
    crash[-12:] = crash[-13] * np.linspace(1, 0.80, 12)
    prices = pd.DataFrame({"UP": up, "DOWN": down, "FLAT": flat, "CRASH": crash}, index=dates)
    return prices.pct_change(), prices


# --------------------------------------------------------------------------- #
# Contratto + segnali tecnici
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize("Sig", [TrendSignal, OscillatorSignal, AlphaCrashSignal])
def test_signal_contract(Sig, market):
    rets, prices = market
    out = Sig().compute(rets, prices)
    assert list(out.columns) == [DIRECTION, PROBABILITY]
    assert set(out.index) == set(prices.columns)
    assert out[DIRECTION].isin([-1, 0, 1]).all()
    assert ((out[PROBABILITY] >= 0) & (out[PROBABILITY] <= 1)).all()
    # direzione 0 ⇒ probabilità 0
    assert (out.loc[out[DIRECTION] == 0, PROBABILITY] == 0).all()


def test_trend_direction(market):
    rets, prices = market
    out = TrendSignal().compute(rets, prices)
    assert out.loc["UP", DIRECTION] == 1
    assert out.loc["DOWN", DIRECTION] == -1


def test_oscillator_oversold(market):
    rets, prices = market
    out = OscillatorSignal().compute(rets, prices)
    assert out.loc["CRASH", DIRECTION] == 1          # crash recente → oversold → rimbalzo atteso
    assert out.loc["CRASH", PROBABILITY] > 0


# --------------------------------------------------------------------------- #
# SUMMARY + ponte BL
# --------------------------------------------------------------------------- #
def test_summary_combines_signals(market):
    rets, prices = market
    sigs = {"trend": TrendSignal().compute(rets, prices),
            "oscillator": OscillatorSignal().compute(rets, prices)}
    summ = summary_signal(sigs)
    assert summ[DIRECTION].isin([-1, 0, 1]).all()
    assert ((summ[PROBABILITY] >= 0) & (summ[PROBABILITY] <= 1)).all()
    assert summ.loc["UP", DIRECTION] == 1            # trend su domina


def test_regime_modulates_summary(market):
    rets, prices = market
    sigs = {"trend": TrendSignal().compute(rets, prices),
            "oscillator": OscillatorSignal().compute(rets, prices)}
    bull = summary_signal(sigs, regime=pd.Series(int(Regime.BULL), index=prices.columns))
    bear = summary_signal(sigs, regime=pd.Series(int(Regime.BEAR), index=prices.columns))
    assert not np.allclose(bull[PROBABILITY], bear[PROBABILITY])


def test_summary_to_bl_views_format(market):
    rets, prices = market
    summ = summary_signal({"trend": TrendSignal().compute(rets, prices)})
    views = summary_to_bl_views(summ, min_probability=0.1)
    assert isinstance(views, dict)
    for tk, v in views.items():
        assert summ.loc[tk, DIRECTION] != 0
        assert np.sign(v) == summ.loc[tk, DIRECTION]


def test_views_consumed_by_blacklitterman():
    pytest.importorskip("riskfolio")
    from aa_engine.optimization import BlackLitterman, PortfolioConstraints
    from aa_engine.optimization.sample import sample_returns

    rets = sample_returns(periods=400)        # rendimenti puliti, covarianza reale
    prices = 100 * (1 + rets).cumprod()
    summ = summary_signal({"trend": TrendSignal().compute(rets, prices)})
    views = summary_to_bl_views(summ)
    cons = PortfolioConstraints(w_max=0.5)
    w = BlackLitterman().fit_weights(rets, views=views, constraints=cons)
    w0 = BlackLitterman().fit_weights(rets, views={}, constraints=cons)
    assert w.sum() == pytest.approx(1.0, abs=1e-6)
    assert not np.allclose(w.values, w0.values)       # le views spostano l'allocazione


# --------------------------------------------------------------------------- #
# AIForecast (SVM) — struttura + validazione walk-forward (onesta)
# --------------------------------------------------------------------------- #
def test_ai_compute_shape(market):
    pytest.importorskip("sklearn")
    rets, prices = market
    out = AIForecast(horizon=21, min_train=50).compute(rets, prices)
    assert list(out.columns) == [DIRECTION, PROBABILITY]
    assert out[DIRECTION].isin([-1, 0, 1]).all()


def test_ai_validate_returns_honest_verdict():
    """validate() produce un verdetto walk-forward valido (non si pretende che vinca)."""
    pytest.importorskip("sklearn")
    from aa_engine.optimization.sample import sample_returns

    rets = sample_returns(periods=600)
    prices = 100 * (1 + rets).cumprod()
    val = AIForecast(horizon=21, min_train=80).validate(rets, prices, step=84, train_window=300)
    assert 0.0 <= val.svm_hit <= 1.0
    assert 0.0 <= val.baseline_always_up_hit <= 1.0
    assert isinstance(val.beats_baseline, bool)
    assert val.n > 0
