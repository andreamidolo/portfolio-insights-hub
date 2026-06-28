"""Splitter temporali per il backtesting out-of-sample.

Due schemi (roadmap §Fase 2.5):
    - ``WalkForwardSplitter``  — walk-forward rolling/expanding (anchored).
    - ``CombinatorialPurgedCV`` — Combinatorial Purged Cross-Validation
      (López de Prado, *Advances in Financial ML*, cap. 7/12) con purging ed
      embargo per evitare leakage temporale.

Entrambi espongono ``split(n)`` che ritorna un iterabile di
``(train_positions, test_positions)`` come array di interi (posizioni iloc),
compatibile con l'uso su ``DataFrame``/``Series`` ordinati nel tempo.
"""

from __future__ import annotations

from dataclasses import dataclass
from itertools import combinations
from math import comb
from typing import Iterable, Iterator

import numpy as np


def _n_obs(n_or_obj) -> int:
    """Accetta un intero o un oggetto con ``__len__`` (Series/DataFrame/Index)."""
    if hasattr(n_or_obj, "__len__"):
        return len(n_or_obj)
    return int(n_or_obj)


@dataclass(frozen=True)
class WalkForwardSplitter:
    """Walk-forward: finestre di train seguite da finestre di test contigue.

    Parametri
    ---------
    train_size : int    ampiezza della finestra di train (in periodi)
    test_size : int     ampiezza di ogni finestra di test out-of-sample
    step : int | None   passo di avanzamento; default = ``test_size`` (finestre
                        di test consecutive e disgiunte → copertura OOS completa)
    expanding : bool    se True il train parte sempre da 0 (anchored/expanding);
                        se False scorre mantenendo ampiezza ``train_size`` (rolling)
    """

    train_size: int
    test_size: int
    step: int | None = None
    expanding: bool = False

    def split(self, n_or_obj) -> Iterator[tuple[np.ndarray, np.ndarray]]:
        n = _n_obs(n_or_obj)
        step = self.step or self.test_size
        if self.train_size <= 0 or self.test_size <= 0 or step <= 0:
            raise ValueError("train_size, test_size e step devono essere positivi")
        i = 0
        while True:
            test_start = self.train_size + i * step
            test_end = test_start + self.test_size
            if test_end > n:
                break
            train_start = 0 if self.expanding else i * step
            yield np.arange(train_start, test_start), np.arange(test_start, test_end)
            i += 1

    def n_splits(self, n_or_obj) -> int:
        return sum(1 for _ in self.split(n_or_obj))


@dataclass(frozen=True)
class CombinatorialPurgedCV:
    """Combinatorial Purged Cross-Validation (López de Prado).

    Le osservazioni sono partizionate in ``n_groups`` gruppi contigui; per ogni
    combinazione di ``n_test_groups`` gruppi usati come test, il resto è train,
    **purgato** dalle osservazioni entro ``embargo`` periodi da ogni gruppo di
    test (per evitare leakage da autocorrelazione/sovrapposizione delle label).

    Produce ``C(n_groups, n_test_groups)`` split. A differenza del walk-forward,
    i gruppi di test si sovrappongono fra split diversi: serve a stimare la
    **distribuzione** della performance, non un singolo path.

    Parametri
    ---------
    n_groups : int        numero di gruppi contigui (default 6)
    n_test_groups : int   gruppi di test per combinazione (default 2)
    embargo : float       frazione del campione totale usata come embargo/purge
                          attorno a ogni gruppo di test (default 1%)
    """

    n_groups: int = 6
    n_test_groups: int = 2
    embargo: float = 0.01

    def __post_init__(self) -> None:
        if not 1 <= self.n_test_groups < self.n_groups:
            raise ValueError("serve 1 <= n_test_groups < n_groups")
        if not 0.0 <= self.embargo < 1.0:
            raise ValueError("embargo deve stare in [0, 1)")

    @property
    def n_splits(self) -> int:
        return comb(self.n_groups, self.n_test_groups)

    def split(self, n_or_obj) -> Iterator[tuple[np.ndarray, np.ndarray]]:
        n = _n_obs(n_or_obj)
        if n < self.n_groups:
            raise ValueError("meno osservazioni che gruppi")
        groups = np.array_split(np.arange(n), self.n_groups)
        emb = int(np.ceil(self.embargo * n))
        for combo in combinations(range(self.n_groups), self.n_test_groups):
            test_idx = np.sort(np.concatenate([groups[g] for g in combo]))
            keep = np.ones(n, dtype=bool)
            keep[test_idx] = False
            if emb > 0:
                for g in combo:                       # purge + embargo simmetrico
                    start, end = groups[g][0], groups[g][-1]
                    keep[max(0, start - emb) : min(n, end + 1 + emb)] = False
            train_idx = np.where(keep)[0]
            yield train_idx, test_idx


# Tipo comune per i runner.
Splitter = Iterable
