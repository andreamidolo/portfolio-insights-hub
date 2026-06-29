"""Job in background (in-memory) per calcoli lunghi — es. backtest dell'ensemble.

Pattern asincrono: l'endpoint avvia un job in un thread e ritorna subito un
``job_id``; il client fa polling su ``GET /backtest/jobs/{id}`` finché lo stato
è ``done`` (o ``error``), leggendo nel frattempo il progresso. Store in memoria
(singolo processo, si azzera al riavvio), bounded (FIFO).
"""
from __future__ import annotations

import threading
import uuid
from dataclasses import dataclass


@dataclass
class Job:
    id: str
    kind: str
    status: str = "running"          # running | done | error
    progress_done: int = 0
    progress_total: int = 0
    result: dict | None = None
    error: str | None = None


class JobStore:
    def __init__(self, maxsize: int = 64) -> None:
        self._jobs: dict[str, Job] = {}
        self._lock = threading.Lock()
        self._maxsize = maxsize

    def create(self, kind: str) -> Job:
        with self._lock:
            if len(self._jobs) >= self._maxsize:
                self._jobs.pop(next(iter(self._jobs)))  # sfratta il più vecchio
            job = Job(id=uuid.uuid4().hex[:12], kind=kind)
            self._jobs[job.id] = job
            return job

    def get(self, job_id: str) -> Job | None:
        with self._lock:
            return self._jobs.get(job_id)

    def update(self, job_id: str, **fields) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is not None:
                for k, v in fields.items():
                    setattr(job, k, v)

    def set_progress(self, job_id: str, done: int, total: int) -> None:
        self.update(job_id, progress_done=done, progress_total=total)


JOBS = JobStore()
