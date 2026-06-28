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
