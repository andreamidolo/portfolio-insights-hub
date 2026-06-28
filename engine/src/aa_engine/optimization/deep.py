"""Set 5 — modelli Deep: STUB documentati (spec §STEP 4).

I due modelli Deep di AlgoEagle (Deep Learning e Deep Reinforcement Learning per
l'allocazione) sono **rinviati ai dati Bloomberg**: richiedono feature ricche
(term structure, superfici di IV, microstruttura) che i dati gratuiti/campione
non contengono, e una pipeline di training/validazione dedicata con la massima
disciplina anti-overfitting.

NON sono implementati e NON entrano nell'ensemble di default. Restano qui come
segnaposto dell'architettura: aggiungerli sarà, come gli altri, una classe che
implementa ``fit_weights``.
"""

from __future__ import annotations

import pandas as pd

from .base import OptModel, PortfolioConstraints


class _DeepStub(OptModel):
    family = "deep"
    _reason = "rinviato ai dati Bloomberg (feature ricche + training dedicato)"

    def fit_weights(
        self, returns: pd.DataFrame, *, regime_mask=None, views=None,
        constraints: "PortfolioConstraints | None" = None,
    ) -> pd.Series:
        raise NotImplementedError(
            f"{self.name}: non implementato — {self._reason}. "
            "Vedi docs/10_models_expansion_spec.md (Set 5)."
        )


class DeepLearningOpt(_DeepStub):
    """Allocazione via deep learning (es. autoencoder + MLP sui fattori).

    STUB: richiede feature Bloomberg e una pipeline di training out-of-sample.
    """

    name = "DeepLearningOpt"


class DeepRLOpt(_DeepStub):
    """Allocazione via deep reinforcement learning (policy su stato di mercato).

    STUB: richiede ambiente di simulazione, reward shaping e validazione robusta.
    """

    name = "DeepRLOpt"
