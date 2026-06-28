"""aa_engine.backtest — Stadio 3: backtesting (Fase 2.5).

Backbone out-of-sample che valida strategie/allocazioni riusando il risk engine
per le metriche di performance. Due schemi di validazione:

    - **Walk-Forward** (rolling/expanding) → un path OOS unico.
    - **Combinatorial Purged CV** (López de Prado) → distribuzione della performance,
      con purging + embargo per evitare leakage.

Una *strategia* è un callable ``train_returns(DataFrame) -> pesi(Series)``: stessa
firma che avranno gli ottimizzatori dello Stadio 2 (drop-in).

Esempio::

    from aa_engine.backtest import WalkForwardSplitter, walk_forward_backtest
    from aa_engine.backtest.strategies import inverse_volatility

    splitter = WalkForwardSplitter(train_size=252, test_size=63)
    result = walk_forward_backtest(returns, inverse_volatility, splitter)
    print(result.summary())

API pubblica stabile: importare da qui, non dai sottomoduli.
"""

from .performance import PerformanceStats, performance_summary
from .results import BacktestResult, FoldResult
from .report import format_report, render
from .runner import cpcv_backtest, walk_forward_backtest
from .splitters import CombinatorialPurgedCV, WalkForwardSplitter
from . import strategies

__all__ = [
    # performance
    "PerformanceStats", "performance_summary",
    # splitters
    "WalkForwardSplitter", "CombinatorialPurgedCV",
    # runner
    "walk_forward_backtest", "cpcv_backtest",
    # results & report
    "BacktestResult", "FoldResult", "format_report", "render",
    # strategie di esempio
    "strategies",
]
