"""Interfaccia comune dei segnali (Stadio 1) — spec `docs/09_signals_spec.md` §1.

Ogni segnale è un componente con lo stesso contratto: dato prezzi/rendimenti,
produce per ogni strumento una **direzione** {+1, 0, −1} e una **forza/probabilità**
in [0, 1]. Così aggiungere un segnale è una classe in più e il SUMMARY li combina
in modo uniforme.

I segnali NON calcolano il regime: lo consumano (via parametro) dove serve.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

import numpy as np
import pandas as pd

DIRECTION = "direction"
PROBABILITY = "probability"


class Signal(ABC):
    """Contratto comune a ogni segnale dello Stadio 1."""

    name: str = "signal"

    @abstractmethod
    def compute(
        self,
        returns: pd.DataFrame,
        prices: pd.DataFrame,
        *,
        as_of: pd.Timestamp | None = None,
    ) -> pd.DataFrame:
        """Valuta il segnale all'istante ``as_of`` (default: ultima data).

        Ritorna un ``DataFrame`` con ``index = ticker`` e colonne
        ``[direction, probability]`` (direction ∈ {+1,0,−1}, probability ∈ [0,1]).
        """
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover
        return f"{type(self).__name__}(name={self.name!r})"


# --------------------------------------------------------------------------- #
# Helper condivisi
# --------------------------------------------------------------------------- #
def _slice(df: pd.DataFrame, as_of: pd.Timestamp | None) -> pd.DataFrame:
    """Storia fino ad ``as_of`` incluso (niente lookahead)."""
    if as_of is None:
        return df
    return df.loc[:as_of]


def _frame(direction: pd.Series, probability: pd.Series, tickers) -> pd.DataFrame:
    """Compone l'output standard, ripulendo NaN e clippando la probabilità."""
    out = pd.DataFrame(
        {
            DIRECTION: direction.reindex(tickers).fillna(0).astype(int),
            PROBABILITY: probability.reindex(tickers).fillna(0.0).clip(0.0, 1.0),
        }
    )
    # direzione 0 ⇒ probabilità 0 (nessuna convinzione)
    out.loc[out[DIRECTION] == 0, PROBABILITY] = 0.0
    return out


def _squash(x: pd.Series, scale: float) -> pd.Series:
    """Mappa una quantità reale su [0,1] con una tanh (forza del segnale)."""
    return pd.Series(np.tanh(np.abs(x) / scale), index=x.index)


def empty_signal(tickers) -> pd.DataFrame:
    """Segnale neutro (direzione 0, probabilità 0) per tutti i ticker."""
    idx = list(tickers)
    return pd.DataFrame({DIRECTION: [0] * len(idx), PROBABILITY: [0.0] * len(idx)}, index=idx)
