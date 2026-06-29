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
    AllocationResponse,
    AllocationRunRequest,
    ContributionsResponse,
    CsvUploadRequest,
    HealthResponse,
    MandateResponse,
    OptimizationModelsResponse,
    PortfolioAnalyzeRequest,
    PortfolioAnalyzeResponse,
    PortfolioReoptimizeRequest,
    PortfolioReoptimizeResponse,
    PortfolioResponse,
    ProfilesConfigResponse,
    RegimesResponse,
    RiskPanelRequest,
    RiskPanelResponse,
    SignalsResponse,
    UniverseResponse,
)

try:  # versione del pacchetto installato
    from importlib.metadata import version

    _VERSION = version("aa_engine")
except Exception:  # pragma: no cover
    _VERSION = "0.1.0"

API_PREFIX = "/api/v1"

Profile = Literal["low", "moderate", "medium", "high"]
Currency = Literal["EUR", "USD", "CHF"]


def _default_origins() -> list[str]:
    raw = os.getenv(
        "AA_API_CORS_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


def _origin_regex() -> str:
    """Regex di origini sempre ammesse (oltre alla lista esatta).

    Di default copre QUALSIASI sottodominio ``*.lovable.app`` (preview, app
    pubblicata, id-preview…) così il front-end ospitato su Lovable non viene
    bloccato dal CORS al cambiare del sottodominio. Override via
    ``AA_API_CORS_ORIGIN_REGEX``. NB: con ``allow_credentials`` l'origine viene
    riflessa puntualmente (mai ``*``), quindi resta conforme allo standard.
    """
    return os.getenv("AA_API_CORS_ORIGIN_REGEX", r"https://([a-z0-9-]+\.)*lovable\.app")


def create_app() -> FastAPI:
    app = FastAPI(
        title="AA Engine API",
        version=_VERSION,
        description="Asset allocation risk engine — contratto v1 (vedi docs/05_api_contract.md).",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_default_origins(),
        allow_origin_regex=_origin_regex(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get(f"{API_PREFIX}/health", response_model=HealthResponse, tags=["meta"])
    def health() -> HealthResponse:
        from aa_engine.optimization import DEFAULT_MODELS, active_models, lite_enabled

        return HealthResponse(
            version=_VERSION,
            lite=lite_enabled(),
            n_models_active=len(active_models()),
            n_models_full=len(DEFAULT_MODELS),
        )

    @app.get(f"{API_PREFIX}/profiles", response_model=ProfilesConfigResponse, tags=["meta"])
    def profiles() -> ProfilesConfigResponse:
        # Profili = DATI configurabili (config/risk_profiles.json): la UI legge da qui
        # le 4 linee, le bande min-max per asset class × valuta, i benchmark e gli indici.
        from aa_engine.profiles import load_profiles

        cfg = load_profiles()

        def _grid(entry: dict) -> dict:
            return {
                "target": entry["target"],
                "bands": {g: {"min": b.min, "max": b.max} for g, b in entry["bands"].items()},
            }

        models = {
            pid: {cur: _grid(entry) for cur, entry in by_cur.items()}
            for pid, by_cur in cfg.models.items()
        }
        benchmarks = {
            bid: {
                ("label" if cur == "label" else cur): (
                    val if cur == "label" else _grid(val)
                )
                for cur, val in by_cur.items()
            }
            for bid, by_cur in cfg.benchmarks.items()
        }
        return ProfilesConfigResponse(
            placeholder=cfg.placeholder,
            source=cfg.source,
            asset_classes=list(cfg.asset_classes),
            currencies=list(cfg.currencies),
            default_currency=cfg.default_currency,
            profiles=[
                {"id": p.id, "label": p.label, "benchmark": p.benchmark}
                for p in cfg.profiles.values()
            ],
            models=models,
            benchmarks=benchmarks,
            index_map=cfg.index_map,
        )

    @app.get(f"{API_PREFIX}/regimes", response_model=RegimesResponse, tags=["risk"])
    def regimes(as_of: str | None = Query(default=None)) -> RegimesResponse:
        # `as_of` accettato per compatibilità di contratto; il backbone campione
        # è deterministico e ancorato a una data fissa.
        return RegimesResponse(as_of=sample.as_of(), source="proxy", regimes=sample.get_regimes())

    @app.get(f"{API_PREFIX}/portfolio", response_model=PortfolioResponse, tags=["portfolio"])
    def portfolio(
        profile: Profile = Query(default="moderate"),
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
        profile: Profile = Query(default="moderate"),
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

    @app.post(f"{API_PREFIX}/allocation/run", response_model=AllocationResponse, tags=["pipeline"])
    def allocation_run(req: AllocationRunRequest) -> AllocationResponse:
        # Il "bottone": chiama LO STESSO flusso della CLI (nessuna logica duplicata).
        # NB: gira ~38 modelli → può richiedere decine di secondi.
        from aa_engine.pipeline.run import run_allocation

        res = run_allocation(req.profile, req.currency, req.as_of)
        return AllocationResponse(**res.to_payload())

    @app.get(f"{API_PREFIX}/signals", response_model=SignalsResponse, tags=["signals"])
    def signals(as_of: str | None = Query(default=None)) -> SignalsResponse:
        # "Finestra di lettura" sullo Stadio 1: regime + segnali tecnici + SUMMARY.
        # Veloce (niente ottimizzazione). Profilo-indipendente.
        from aa_engine.pipeline.run import compute_signals

        return SignalsResponse(**compute_signals(as_of))

    @app.get(
        f"{API_PREFIX}/optimization/models",
        response_model=OptimizationModelsResponse,
        tags=["optimization"],
    )
    def optimization_models(
        profile: Profile = Query(default="moderate"),
        currency: Currency = Query(default="EUR"),
        as_of: str | None = Query(default=None),
    ) -> OptimizationModelsResponse:
        # "Apri il cofano" sullo Stadio 2: i 41 modelli, score, 4 scelti, 1/N.
        # Gira lo STESSO ensemble di /allocation/run → può richiedere decine di secondi.
        from aa_engine.pipeline.run import compute_optimization_models

        return OptimizationModelsResponse(
            **compute_optimization_models(profile, currency, as_of)
        )

    # ----------------------------------------------------------------------- #
    # Upload dati + analisi mandato (iterazione 2)
    # ----------------------------------------------------------------------- #
    def _bad_upload(exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=400,
            content={"error": {"code": "invalid_upload", "message": str(exc)}},
        )

    @app.post(f"{API_PREFIX}/data/upload", response_model=UniverseResponse, tags=["data"])
    def data_upload(req: CsvUploadRequest) -> JSONResponse | UniverseResponse:
        from . import store

        try:
            returns, _summary = store.parse_prices(req.csv)
        except store.UploadError as exc:
            return _bad_upload(exc)
        store.STORE.set_market(returns, req.filename)
        return UniverseResponse(**store.universe_summary())

    @app.get(f"{API_PREFIX}/data/universe", response_model=UniverseResponse, tags=["data"])
    def data_universe() -> UniverseResponse:
        from . import store

        return UniverseResponse(**store.universe_summary())

    @app.post(f"{API_PREFIX}/portfolio/upload", response_model=MandateResponse, tags=["portfolio"])
    def portfolio_upload(req: CsvUploadRequest) -> JSONResponse | MandateResponse:
        from . import store

        try:
            mandate = store.parse_mandate(req.csv)
        except store.UploadError as exc:
            return _bad_upload(exc)
        return MandateResponse(
            holdings=mandate.holdings, weight_sum=mandate.weight_sum,
            missing_prices=mandate.missing_prices, warnings=mandate.warnings,
        )

    @app.post(
        f"{API_PREFIX}/portfolio/analyze",
        response_model=PortfolioAnalyzeResponse,
        tags=["portfolio"],
    )
    def portfolio_analyze(req: PortfolioAnalyzeRequest) -> JSONResponse | PortfolioAnalyzeResponse:
        from . import portfolio, store

        try:
            res = portfolio.analyze(
                [h.model_dump() for h in req.holdings], alpha=req.alpha, mar=req.mar
            )
        except store.UploadError as exc:
            return _bad_upload(exc)
        return PortfolioAnalyzeResponse(**res)

    @app.post(
        f"{API_PREFIX}/portfolio/reoptimize",
        response_model=PortfolioReoptimizeResponse,
        tags=["portfolio"],
    )
    def portfolio_reoptimize(
        req: PortfolioReoptimizeRequest,
    ) -> JSONResponse | PortfolioReoptimizeResponse:
        from . import portfolio, store

        try:
            res = portfolio.reoptimize(
                [h.model_dump() for h in req.holdings], req.profile, req.currency
            )
        except store.UploadError as exc:
            return _bad_upload(exc)
        return PortfolioReoptimizeResponse(**res)

    return app


app = create_app()
