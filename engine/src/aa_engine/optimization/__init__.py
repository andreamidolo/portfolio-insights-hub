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
from .bayesian import BayesStein, BlackLitterman, MeucciEntropyPooling
from .classic import (
    EqualWeight,
    MaxSharpe,
    MinCDaR,
    MinCVaR,
    MinVolatility,
    RiskParity,
)
from .clustering import HERC, HRP, NCO
from .deep import DeepLearningOpt, DeepRLOpt
from .ensemble import (
    CalmarScorer,
    EnsembleResult,
    OptimizationEnsemble,
    Scorer,
    SharpeScorer,
)
from .online import (
    CORN,
    RMR,
    Anticor,
    ExponentialGradient,
    FollowTheLeader,
    FollowTheRegularizedLeader,
    OLMAR,
    PAMR,
)
from .risk_measures import (
    Kelly,
    MaxRatioCVaR,
    MaxSortino,
    MinADD,
    MinEDaR,
    MinEVaR,
    MinFLPM,
    MinGMD,
    MinMAD,
    MinMDD,
    MinSemiDev,
    MinSLPM,
    MinUlcer,
    MinWR,
)
from .robust import Goldilocks, MichaudResampling, RobustEllipsoidal, TalmudBlend
from .timing import ParametricPolicy, RewardToRiskTiming, VolatilityTiming

# --------------------------------------------------------------------------- #
# Il "vero" ensemble: ~40 modelli su 4 famiglie + baseline (no Deep: rinviati).
# Aggiungere un modello = aggiungere la sua classe a questa tupla.
# --------------------------------------------------------------------------- #
_CLASSICS = (
    MinVolatility, MaxSharpe, RiskParity, MinCVaR, MinCDaR,
    MinMAD, MinSemiDev, MinFLPM, MinSLPM, MinEVaR, MinWR, MinGMD,
    MinMDD, MinADD, MinEDaR, MinUlcer, MaxSortino, MaxRatioCVaR, Kelly,
    VolatilityTiming, RewardToRiskTiming, ParametricPolicy,
)
_BAYESIAN = (BlackLitterman, BayesStein, MeucciEntropyPooling)
_AI = (HRP, HERC, NCO)
_ONLINE = (
    ExponentialGradient, FollowTheLeader, FollowTheRegularizedLeader,
    PAMR, OLMAR, RMR, Anticor, CORN,
)
_ROBUST = (MichaudResampling, TalmudBlend, Goldilocks, RobustEllipsoidal)
_BASELINE = (EqualWeight,)

#: Insieme attivo dell'ensemble (~38 modelli + baseline). I Deep restano stub.
DEFAULT_MODELS: tuple[type[OptModel], ...] = (
    _CLASSICS + _BAYESIAN + _AI + _ONLINE + _ROBUST + _BASELINE
)

#: Sottoinsieme "leggero" per hosting con poca CPU (es. Render Free): pochi
#: modelli VELOCI e diversi per famiglia (classic mean-var, risk-parity,
#: clustering AI, bayesian/views, baseline). Evita i modelli lenti (resampling
#: Michaud, EVaR/EDaR). Attivato via env ``AA_ENGINE_LITE`` — la UI lo dichiara.
LITE_MODELS: tuple[type[OptModel], ...] = (
    MinVolatility, MaxSharpe, RiskParity, HRP, BlackLitterman, EqualWeight,
)


def lite_enabled() -> bool:
    """True se l'ensemble ridotto è attivo (env ``AA_ENGINE_LITE`` truthy)."""
    import os

    return os.getenv("AA_ENGINE_LITE", "").strip().lower() in ("1", "true", "yes", "on")


def active_models() -> tuple[type[OptModel], ...]:
    """Modelli attivi: ridotti in modalità lite, altrimenti i ~41 completi."""
    return LITE_MODELS if lite_enabled() else DEFAULT_MODELS


def default_ensemble(n_best: int = 4) -> OptimizationEnsemble:
    """Ensemble di default: ~41 modelli, o il set ridotto se ``AA_ENGINE_LITE``.

    In modalità lite ``n_best`` è limitato al numero di modelli disponibili.
    """
    models = active_models()
    return OptimizationEnsemble([m() for m in models], n_best=min(n_best, len(models)))


__all__ = [
    "OptModel", "PortfolioConstraints",
    # classics
    "EqualWeight", "MinVolatility", "MaxSharpe", "RiskParity", "MinCVaR", "MinCDaR",
    "MinMAD", "MinSemiDev", "MinFLPM", "MinSLPM", "MinEVaR", "MinWR", "MinGMD",
    "MinMDD", "MinADD", "MinEDaR", "MinUlcer", "MaxSortino", "MaxRatioCVaR", "Kelly",
    "VolatilityTiming", "RewardToRiskTiming", "ParametricPolicy",
    # bayesian
    "BlackLitterman", "BayesStein", "MeucciEntropyPooling",
    # ai (clustering)
    "HRP", "HERC", "NCO",
    # online
    "ExponentialGradient", "FollowTheLeader", "FollowTheRegularizedLeader",
    "PAMR", "OLMAR", "RMR", "Anticor", "CORN",
    # robust
    "MichaudResampling", "TalmudBlend", "Goldilocks", "RobustEllipsoidal",
    # deep (stub, non attivi)
    "DeepLearningOpt", "DeepRLOpt",
    # ensemble
    "OptimizationEnsemble", "EnsembleResult", "Scorer", "SharpeScorer", "CalmarScorer",
    "DEFAULT_MODELS", "LITE_MODELS", "default_ensemble", "active_models", "lite_enabled",
]
