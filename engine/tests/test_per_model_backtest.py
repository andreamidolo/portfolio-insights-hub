"""Test del backtest per-modello (``aa_engine.backtest.per_model``).

Gira su backbone sintetico con un ensemble piccolo e veloce: verifica struttura,
invarianti delle frequenze di selezione e serializzazione.
"""

from __future__ import annotations

import pytest

pytest.importorskip("riskfolio")  # i modelli classici girano via rf.Portfolio

from aa_engine.backtest.per_model import PerModelReport, run_per_model_backtest
from aa_engine.optimization import OptimizationEnsemble
from aa_engine.optimization.base import PortfolioConstraints
from aa_engine.optimization.classic import EqualWeight, MaxSharpe, MinVolatility
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns


def _small_report() -> PerModelReport:
    returns = sample_returns(periods=420)
    ens = OptimizationEnsemble([MinVolatility(), MaxSharpe(), EqualWeight()], n_best=2)
    constraints = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
    return run_per_model_backtest(
        returns, constraints=constraints, ensemble=ens,
        train_size=200, test_size=80, data_source="test:sample",
    )


def test_report_structure():
    rep = _small_report()
    assert rep.n_folds >= 1
    assert rep.n_models == 3
    assert rep.oos_days > 0
    assert len(rep.fold_selections) == rep.n_folds
    # ogni fold seleziona esattamente n_best=2 modelli
    assert all(len(sel) == 2 for sel in rep.fold_selections)


def test_selection_freq_invariants():
    rep = _small_report()
    # la somma delle selezioni = n_folds * n_best
    total_sel = sum(m.selection_count for m in rep.per_model)
    assert total_sel == rep.n_folds * 2
    for m in rep.per_model:
        assert 0.0 <= m.selection_freq <= 1.0
        assert m.active_folds <= rep.n_folds


def test_equalweight_is_in_lite_flag():
    rep = _small_report()
    by_name = {m.model: m for m in rep.per_model}
    # EqualWeight e MinVolatility e MaxSharpe sono tutti membri del set lite
    assert by_name["EqualWeight"].in_lite
    assert by_name["MinVolatility"].in_lite


def test_serialization_roundtrip(tmp_path):
    rep = _small_report()
    csv = rep.write_csv(tmp_path / "pm.csv")
    js = rep.write_json(tmp_path / "pm.json")
    assert csv.exists() and js.exists()
    df = rep.to_frame()
    assert "selection_freq" in df.columns
    assert len(df) == rep.n_models
