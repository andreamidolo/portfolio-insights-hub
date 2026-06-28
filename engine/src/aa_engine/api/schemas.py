"""Modelli Pydantic — fissano la forma dei payload del contratto API.

Fonte di verità: ``docs/05_api_contract.md``. Convenzioni:
    - valori percentuali come **frazioni decimali** (0.1378 = 13.78%);
    - date come stringa ISO ``YYYY-MM-DD``;
    - regime ∈ {"bull", "bear"}; profilo ∈ {"moderate","balanced","aggressive"};
    - valuta ∈ {"EUR","USD"}.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Profile = Literal["moderate", "balanced", "aggressive"]
Currency = Literal["EUR", "USD"]
RegimeLabel = Literal["bull", "bear"]


# --------------------------------------------------------------------------- #
# /health
# --------------------------------------------------------------------------- #
class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    version: str


# --------------------------------------------------------------------------- #
# /regimes
# --------------------------------------------------------------------------- #
class RegimeItem(BaseModel):
    asset_class: str
    regime: RegimeLabel


class RegimesResponse(BaseModel):
    as_of: str
    source: Literal["proxy", "options"] = "proxy"
    regimes: list[RegimeItem]


# --------------------------------------------------------------------------- #
# /portfolio
# --------------------------------------------------------------------------- #
class Holding(BaseModel):
    name: str
    isin: str
    asset_class: str
    weight: float
    currency: str


class PortfolioResponse(BaseModel):
    profile: Profile
    currency: Currency
    as_of: str
    holdings: list[Holding]
    asset_class_weights: dict[str, float]
    currency_exposure: dict[str, float]


# --------------------------------------------------------------------------- #
# /risk/panel
# --------------------------------------------------------------------------- #
class RiskPanelRequest(BaseModel):
    profile: Profile = "balanced"
    currency: Currency = "EUR"
    alpha: float = Field(0.05, gt=0, lt=1)
    mar: float = 0.0
    regime_conditional: bool = True


class RiskSummary(BaseModel):
    cumulative_return: float
    cagr: float
    sharpe: float
    max_drawdown: float
    volatility: float


class RiskMetricItem(BaseModel):
    family: Literal["return_based", "tail", "drawdown_based"]
    code: str
    name: str
    value: float
    ret_over_risk: float | None = None
    # True = valore da un'APPROSSIMAZIONE documentata (RLVaR/RLDaR bridge, TG
    # tail-GMD). Il front-end può segnalarlo all'utente/cliente.
    approx: bool = False


class RiskPanelResponse(BaseModel):
    profile: Profile
    currency: Currency
    as_of: str
    alpha: float
    regime_conditional: bool
    summary: RiskSummary
    metrics: list[RiskMetricItem]


# --------------------------------------------------------------------------- #
# /risk/contributions
# --------------------------------------------------------------------------- #
class ContributionItem(BaseModel):
    name: str
    weight: float
    risk_contribution: float


class ContributionsResponse(BaseModel):
    profile: Profile
    currency: Currency
    measure: str
    contributions: list[ContributionItem]


class ErrorBody(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorBody


# --------------------------------------------------------------------------- #
# /allocation/run  (Fase 4 — il "bottone")
# --------------------------------------------------------------------------- #
class AllocationRunRequest(BaseModel):
    profile: Profile = "balanced"
    currency: Currency = "EUR"
    as_of: str | None = None


class SignalCell(BaseModel):
    direction: int          # +1 / 0 / -1
    probability: float


class SignalRow(BaseModel):
    ticker: str
    asset_class: str
    trend: SignalCell
    oscillator: SignalCell
    alpha_crash: SignalCell
    summary: SignalCell


class AllocationResponse(BaseModel):
    profile: Profile
    currency: Currency
    as_of: str
    n_models_active: int
    regimes: dict[str, RegimeLabel]
    signals: list[SignalRow]
    selected: list[str]
    discarded: list[str]
    selected_models: list[str]
    final_weights: dict[str, float]
    asset_class_weights: dict[str, float]
    risk: dict[str, float]
    excluded_models: dict[str, str] = {}


# --------------------------------------------------------------------------- #
# GET /signals  (Stadio 1 — finestra di lettura sui segnali)
# --------------------------------------------------------------------------- #
class SignalsResponse(BaseModel):
    as_of: str
    # A.I. (SVM) disattivato: validato walk-forward ma non batte il baseline.
    svm_enabled: bool = False
    svm_note: str
    regimes: dict[str, RegimeLabel]
    selected: list[str]
    discarded: list[str]
    signals: list[SignalRow]


# --------------------------------------------------------------------------- #
# GET /optimization/models  (Stadio 2 — "apri il cofano" sui 41 modelli)
# --------------------------------------------------------------------------- #
class OptModelRow(BaseModel):
    name: str
    family: str                       # classics|bayesian|ai|online|robust|baseline
    score: float | None               # score walk-forward (None = non valutabile)
    selected: bool                    # fra i n_best scelti
    weights: dict[str, float]         # pesi proposti (≈0 omessi)


class OptimizationModelsResponse(BaseModel):
    profile: Profile
    currency: Currency
    as_of: str
    scorer: str                       # es. "calmar"
    n_best: int
    n_models_active: int
    selected_models: list[str]
    universe: list[str]
    selected: list[str]
    discarded: list[str]
    models: list[OptModelRow]
    excluded_models: dict[str, str] = {}
    final_weights: dict[str, float]
    asset_class_weights: dict[str, float]
    baseline_equal_weight: dict[str, float]   # 1/N sugli strumenti selezionati
    baseline_score: float | None = None
