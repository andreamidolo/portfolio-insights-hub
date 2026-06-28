"""FastAPI app — espone il contratto ``docs/05_api_contract.md`` sotto ``/api/v1``.

Stateless, REST + JSON. CORS abilitato per l'origine del front-end (configurabile
via ``AA_API_CORS_ORIGINS``, default localhost Vite). Gli endpoint mappano sulle
funzioni del risk engine tramite il backbone campione ``aa_engine.api.sample``.
"""

from __future__ import annotations

import os
from typing import Literal

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from aa_engine.risk.definitions import BY_CODE

from . import sample
from .schemas import (
    ContributionsResponse,
    HealthResponse,
    PortfolioResponse,
    RegimesResponse,
    RiskPanelRequest,
    RiskPanelResponse,
)

try:  # versione del pacchetto installato
    from importlib.metadata import version

    _VERSION = version("aa_engine")
except Exception:  # pragma: no cover
    _VERSION = "0.1.0"

API_PREFIX = "/api/v1"

Profile = Literal["moderate", "balanced", "aggressive"]
Currency = Literal["EUR", "USD"]


def _default_origins() -> list[str]:
    raw = os.getenv(
        "AA_API_CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


def create_app() -> FastAPI:
    app = FastAPI(
        title="AA Engine API",
        version=_VERSION,
        description="Asset allocation risk engine — contratto v1 (vedi docs/05_api_contract.md).",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_default_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get(f"{API_PREFIX}/health", response_model=HealthResponse, tags=["meta"])
    def health() -> HealthResponse:
        return HealthResponse(version=_VERSION)

    @app.get(f"{API_PREFIX}/regimes", response_model=RegimesResponse, tags=["risk"])
    def regimes(as_of: str | None = Query(default=None)) -> RegimesResponse:
        # `as_of` accettato per compatibilità di contratto; il backbone campione
        # è deterministico e ancorato a una data fissa.
        return RegimesResponse(as_of=sample.as_of(), source="proxy", regimes=sample.get_regimes())

    @app.get(f"{API_PREFIX}/portfolio", response_model=PortfolioResponse, tags=["portfolio"])
    def portfolio(
        profile: Profile = Query(default="balanced"),
        currency: Currency = Query(default="EUR"),
    ) -> PortfolioResponse:
        return PortfolioResponse(**sample.get_portfolio(profile, currency))

    @app.post(f"{API_PREFIX}/risk/panel", response_model=RiskPanelResponse, tags=["risk"])
    def risk_panel(req: RiskPanelRequest) -> RiskPanelResponse:
        data = sample.get_risk_panel(
            req.profile, req.currency, req.alpha, req.mar, req.regime_conditional
        )
        return RiskPanelResponse(**data)

    @app.get(
        f"{API_PREFIX}/risk/contributions",
        response_model=ContributionsResponse,
        tags=["risk"],
    )
    def risk_contributions(
        profile: Profile = Query(default="balanced"),
        currency: Currency = Query(default="EUR"),
        measure: str = Query(default="MV"),
    ) -> JSONResponse | ContributionsResponse:
        if measure not in BY_CODE:
            return JSONResponse(
                status_code=400,
                content={
                    "error": {
                        "code": "invalid_measure",
                        "message": f"Metrica '{measure}' sconosciuta. Valide: {sorted(BY_CODE)}",
                    }
                },
            )
        return ContributionsResponse(**sample.get_contributions(profile, currency, measure))

    return app


app = create_app()
