"""Test dell'espansione modelli (Stadio 2): validità pesi + robustezza ensemble."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

pytest.importorskip("riskfolio")

from aa_engine.optimization import (  # noqa: E402
    DEFAULT_MODELS,
    DeepLearningOpt,
    DeepRLOpt,
    EqualWeight,
    MinVolatility,
    OptimizationEnsemble,
    PortfolioConstraints,
)
from aa_engine.optimization.base import OptModel  # noqa: E402
from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns  # noqa: E402


@pytest.fixture(scope="module")
def returns() -> pd.DataFrame:
    return sample_returns(periods=400)


# --------------------------------------------------------------------------- #
# Ogni modello attivo produce pesi validi
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize("Model", DEFAULT_MODELS, ids=[m.__name__ for m in DEFAULT_MODELS])
def test_model_valid_weights(Model, returns):
    cons = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
    w = Model().fit_weights(returns, constraints=cons)
    assert list(w.index) == list(returns.columns)
    assert w.sum() == pytest.approx(1.0, abs=1e-5)
    assert (w >= -1e-9).all()                       # long-only
    assert w.max() <= 0.40 + 3e-3                    # cap per-asset (tol solver)
    assert np.isfinite(w.to_numpy()).all()


def test_default_models_count_and_no_deep():
    assert len(DEFAULT_MODELS) >= 33                 # ~38 target (Deep esclusi)
    names = {m.__name__ for m in DEFAULT_MODELS}
    assert "DeepLearningOpt" not in names and "DeepRLOpt" not in names


def test_family_coverage():
    families = {m().family for m in DEFAULT_MODELS}
    assert {"classics", "bayesian", "ai", "online", "robust", "baseline"} <= families


# --------------------------------------------------------------------------- #
# Stub Deep: documentati ma non implementati
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize("Stub", [DeepLearningOpt, DeepRLOpt])
def test_deep_stub_raises(Stub, returns):
    with pytest.raises(NotImplementedError):
        Stub().fit_weights(returns)


# --------------------------------------------------------------------------- #
# Robustezza ensemble: i modelli che falliscono vengono ESCLUSI, non bloccano
# --------------------------------------------------------------------------- #
class _Failing(OptModel):
    name = "Failing"
    family = "classics"

    def fit_weights(self, returns, *, regime_mask=None, views=None, constraints=None):
        raise RuntimeError("solver non convergente")


class _Degenerate(OptModel):
    name = "Degenerate"
    family = "classics"

    def fit_weights(self, returns, *, regime_mask=None, views=None, constraints=None):
        # pesi che NON sommano a 1 → devono essere scartati dalla validazione
        return pd.Series(5.0, index=returns.columns)


def test_ensemble_excludes_failing_models(returns):
    models = [MinVolatility(), EqualWeight(), _Failing(), _Degenerate()]
    ens = OptimizationEnsemble(models, n_best=2)
    cons = PortfolioConstraints(w_max=0.50, asset_class_map=ASSET_CLASS_MAP)
    res = ens.run(returns, constraints=cons)

    assert set(res.excluded) == {"Failing", "Degenerate"}          # entrambi esclusi
    assert "solver" in res.excluded["Failing"]
    assert res.n_active == 2                                         # gli altri 2 restano
    assert res.final_weights.sum() == pytest.approx(1.0, abs=1e-6)
    assert res.summary()["n_excluded"] == 2
