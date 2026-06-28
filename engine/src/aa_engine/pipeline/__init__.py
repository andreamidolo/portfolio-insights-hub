"""aa_engine.pipeline — Fase 4: integrazione end-to-end ("il bottone").

Un solo flusso (``run_allocation``) che mette in fila i moduli esistenti —
regime → segnali → selezione → ottimizzazione → rischio — e produce un risultato
strutturato (``AllocationResult``) + un report leggibile. CLI e API lo chiamano
entrambi: nessuna logica duplicata.

    python -m aa_engine.pipeline.run --profile balanced --currency EUR
    POST /api/v1/allocation/run
"""

from .report import render_html, render_markdown
from .run import AllocationResult, run_allocation

__all__ = ["run_allocation", "AllocationResult", "render_markdown", "render_html"]
