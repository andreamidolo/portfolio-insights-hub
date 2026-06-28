"""aa_engine.risk — Risk management stratificato (Stadio 4). PRIMO MATTONE.

Cinque linee di difesa (vedi docs/00_analisi_sistema.md, sezione 8):
    Linea 1 — Regimes            -> via aa_engine.data.RegimeProvider
    Linea 2 — Aggregate Risk     -> measures.risk_panel / compute_measure
    Linea 3 — Factorial Risk     -> factor.py (TODO fase successiva)
    Linea 4 — Individual Risk    -> measures.marginal_risk / risk_contribution / leave_one_out
    Linea 5 — Stress Testing     -> stress.py

API pubblica stabile: importare da qui, non dai sottomoduli.
"""

from .definitions import (
    ALL_MEASURES,
    BY_CODE,
    DRAWDOWN_BASED,
    RETURN_BASED,
    TAIL,
    RiskFamily,
    RiskMeasure,
    measures_in_family,
)
from .measures import (
    compute_measure,
    leave_one_out,
    marginal_risk,
    risk_contribution,
    risk_panel,
    worst_realizations,
)
from .backtesting import (
    VaRBacktestResult,
    backtest_var_model,
    select_best_var_model,
)
from .stress import stress_factor, stress_security

__all__ = [
    # definitions
    "RiskMeasure", "RiskFamily", "ALL_MEASURES", "RETURN_BASED", "TAIL",
    "DRAWDOWN_BASED", "BY_CODE", "measures_in_family",
    # measures
    "compute_measure", "risk_panel", "marginal_risk", "risk_contribution",
    "leave_one_out", "worst_realizations",
    # backtesting
    "VaRBacktestResult", "backtest_var_model", "select_best_var_model",
    # stress
    "stress_security", "stress_factor",
]
