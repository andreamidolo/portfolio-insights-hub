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

Profile = Literal["conservative", "moderate", "balanced", "aggressive"]
Currency = Literal["EUR", "USD", "CHF"]
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


class BenchmarkBlock(BaseModel):
    id: str
    label: str
    placeholder: bool = False
    weights: dict[str, float] = {}
    asset_class_weights: dict[str, float] = {}
    risk: dict[str, float] = {}


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
    benchmark: BenchmarkBlock | None = None


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


# --------------------------------------------------------------------------- #
# Upload dati + analisi mandato (iterazione 2 — docs/13)
# --------------------------------------------------------------------------- #
class CsvUploadRequest(BaseModel):
    filename: str | None = None
    csv: str                          # contenuto testuale del CSV


class InstrumentInfo(BaseModel):
    ticker: str
    asset_class: str
    n_observations: int
    known: bool                       # ticker presente nella mappa campione?


class UniverseResponse(BaseModel):
    source: Literal["user", "sample"]
    filename: str | None = None
    n_instruments: int
    n_observations: int
    date_start: str
    date_end: str
    instruments: list[InstrumentInfo]
    warnings: list[str] = []


class HoldingInput(BaseModel):
    ticker: str
    weight: float
    isin: str | None = None


class MandateHolding(BaseModel):
    ticker: str
    isin: str = ""
    weight: float
    asset_class: str


class MandateResponse(BaseModel):
    holdings: list[MandateHolding]
    weight_sum: float
    missing_prices: list[str] = []
    warnings: list[str] = []


class PortfolioAnalyzeRequest(BaseModel):
    holdings: list[HoldingInput]
    alpha: float = Field(0.05, gt=0, lt=1)
    mar: float = 0.0


class PortfolioAnalyzeResponse(BaseModel):
    source: Literal["user", "sample"]
    as_of: str
    n_holdings: int
    covered_weight: float             # frazione di peso effettivamente analizzata
    missing_prices: list[str] = []
    summary: RiskSummary
    metrics: list[RiskMetricItem]
    contributions: list[ContributionItem]
    regimes: dict[str, RegimeLabel]
    signals: list[SignalRow]


class PortfolioReoptimizeRequest(BaseModel):
    holdings: list[HoldingInput]
    profile: Profile = "balanced"
    currency: Currency = "EUR"


class ReoptimizeRow(BaseModel):
    ticker: str
    asset_class: str
    current: float
    proposed: float
    delta: float


# --------------------------------------------------------------------------- #
# Profili di rischio configurabili (docs/14)
# --------------------------------------------------------------------------- #
class BandItem(BaseModel):
    min: float
    max: float


class ProfileItem(BaseModel):
    id: str
    label: str
    bands: dict[str, BandItem]        # gruppo → banda (5 asset class)
    benchmark: str


class BenchmarkItem(BaseModel):
    id: str
    label: str
    composition: dict[str, float]


class ProfilesConfigResponse(BaseModel):
    placeholder: bool                 # True = valori di esempio, da sostituire (LFG)
    asset_classes: list[str]
    currencies: list[str]
    profiles: list[ProfileItem]
    benchmarks: list[BenchmarkItem]


class PortfolioReoptimizeResponse(BaseModel):
    source: Literal["user", "sample"]
    profile: Profile
    currency: Currency
    as_of: str
    covered_weight: float
    missing_prices: list[str] = []
    n_models_active: int
    selected_models: list[str]
    scorer: str
    regimes: dict[str, RegimeLabel]
    comparison: list[ReoptimizeRow]
    risk_current: dict[str, float]
    risk_proposed: dict[str, float]
    risk_delta: dict[str, float]
