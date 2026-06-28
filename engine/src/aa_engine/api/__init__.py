"""aa_engine.api — API REST (FastAPI) che espone il contratto motore ⇄ front-end.

Implementa gli endpoint di ``docs/05_api_contract.md`` (prefisso ``/api/v1``)
mappandoli sulle funzioni di ``aa_engine.risk``. I dati provengono dal backbone
campione deterministico (``aa_engine.api.sample``): "prima la macchina, poi la
benzina" — gli stessi endpoint, domani, leggeranno dati live senza cambiare forma.

Avvio in locale::

    uvicorn aa_engine.api.main:app --reload   # http://localhost:8000
"""

from .main import app, create_app

__all__ = ["app", "create_app"]
