"""aa_engine.optimization — Stadio 2: ottimizzazione di portafoglio.

FASE SUCCESSIVA (non il primo mattone). Obiettivo: ricostruire il meccanismo
"40+ modelli in parallelo -> nested walk-forward -> media dei 4 migliori".

Cinque set di modelli (vedi docs/00_analisi_sistema.md, sezione 6):
    Set 1 Classics Revised  | Set 2 Bayesiani | Set 3 Online PO
    Set 4 Robust/Uncertainty | Set 5 AI (HRP, HERC, NCO, DL/DRL)

Larga parte coperta da Riskfolio-Lib (rf.Portfolio, rf.HCPortfolio).

FASE 3 implementata: interfaccia ``OptModel`` + 9 modelli (4 famiglie) + baseline,
``OptimizationEnsemble`` con selezione walk-forward dei 4 migliori, e
``PortfolioConstraints``. Aggiungere un modello = una classe in più.

API pubblica stabile: importare da qui.
"""

from .base import OptModel, PortfolioConstraints
from .bayesian import BlackLitterman
from .classic import (
    EqualWeight,
    MaxSharpe,
    MinCDaR,
    MinCVaR,
    MinVolatility,
    RiskParity,
)
from .clustering import HERC, HRP, NCO
from .ensemble import (
    CalmarScorer,
    EnsembleResult,
    OptimizationEnsemble,
    Scorer,
    SharpeScorer,
)

#: I 9 modelli curati + baseline (l'insieme di default dell'ensemble).
DEFAULT_MODELS: tuple[type[OptModel], ...] = (
    MinVolatility, MaxSharpe, RiskParity, MinCVaR, MinCDaR,
    BlackLitterman, HRP, HERC, NCO, EqualWeight,
)


def default_ensemble(n_best: int = 4) -> OptimizationEnsemble:
    """Ensemble con i 9 modelli curati + baseline 1/N."""
    return OptimizationEnsemble([m() for m in DEFAULT_MODELS], n_best=n_best)


__all__ = [
    "OptModel", "PortfolioConstraints",
    "EqualWeight", "MinVolatility", "MaxSharpe", "RiskParity", "MinCVaR", "MinCDaR",
    "BlackLitterman", "HRP", "HERC", "NCO",
    "OptimizationEnsemble", "EnsembleResult", "Scorer", "SharpeScorer", "CalmarScorer",
    "DEFAULT_MODELS", "default_ensemble",
]
