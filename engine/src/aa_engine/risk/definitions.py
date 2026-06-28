"""Risk engine — definizioni e tassonomia delle metriche di rischio.

Questo modulo NON contiene ancora i calcoli: definisce il vocabolario comune
(quali metriche esistono, come sono raggruppate) replicando esattamente la
tassonomia osservata nei report AlgoEagle (slide "Analysis of Coherence").
È la mappa che `measures.py` dovrà implementare, in larga parte appoggiandosi
a Riskfolio-Lib.

Riferimento crociato:
    docs/02_risk_engine_spec.md  — specifica dettagliata
    docs/00_analisi_sistema.md   — da dove vengono queste metriche
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class RiskFamily(str, Enum):
    """Le tre famiglie di misure di rischio usate nel sistema."""

    RETURN_BASED = "return_based"      # dispersione dei rendimenti
    DRAWDOWN_BASED = "drawdown_based"  # basate sui drawdown cumulati
    TAIL = "tail"                       # rischio di coda (VaR/CVaR & co.)


@dataclass(frozen=True)
class RiskMeasure:
    """Descrittore di una singola misura di rischio."""

    code: str            # codice breve (anche allineato a Riskfolio quando esiste)
    name: str            # nome leggibile
    family: RiskFamily
    riskfolio_key: str | None = None   # chiave corrispondente in Riskfolio-Lib, se nota
    higher_is_riskier: bool = True
    # True = calcolata con un'APPROSSIMAZIONE documentata (non l'algoritmo esatto).
    # Vedi measures.py; usato dall'API per segnalare i campi al front-end/cliente.
    approximate: bool = False


# --------------------------------------------------------------------------- #
# Catalogo completo — replica la tabella "Analysis of Coherence" di AlgoEagle.
# (codici Riskfolio-Lib indicativi: VERIFICARE contro la versione installata)
# --------------------------------------------------------------------------- #
RETURN_BASED: tuple[RiskMeasure, ...] = (
    RiskMeasure("MV", "Standard Deviation", RiskFamily.RETURN_BASED, "MV"),
    RiskMeasure("MAD", "Mean Absolute Deviation", RiskFamily.RETURN_BASED, "MAD"),
    RiskMeasure("MSV", "Semi Standard Deviation", RiskFamily.RETURN_BASED, "MSV"),
    RiskMeasure("FLPM", "First Lower Partial Moment (Omega)", RiskFamily.RETURN_BASED, "FLPM"),
    RiskMeasure("SLPM", "Second Lower Partial Moment (Sortino)", RiskFamily.RETURN_BASED, "SLPM"),
    RiskMeasure("GMD", "Gini Mean Difference", RiskFamily.RETURN_BASED, "GMD"),
    RiskMeasure("TG", "Tail Gini of Losses", RiskFamily.RETURN_BASED, "TG", approximate=True),
    RiskMeasure("KT", "Kurtosis", RiskFamily.RETURN_BASED, "KT", higher_is_riskier=True),
    RiskMeasure("SKEW", "Skewness", RiskFamily.RETURN_BASED, "SKEW", higher_is_riskier=False),
)

TAIL: tuple[RiskMeasure, ...] = (
    RiskMeasure("VaR", "Value at Risk", RiskFamily.TAIL, "VaR"),
    RiskMeasure("CVaR", "Conditional Value at Risk", RiskFamily.TAIL, "CVaR"),
    RiskMeasure("EVaR", "Entropic Value at Risk", RiskFamily.TAIL, "EVaR"),
    RiskMeasure("RLVaR", "Relativistic Value at Risk", RiskFamily.TAIL, "RLVaR", approximate=True),
    RiskMeasure("WR", "Worst Realization", RiskFamily.TAIL, "WR"),
)

DRAWDOWN_BASED: tuple[RiskMeasure, ...] = (
    RiskMeasure("UCI", "Ulcer Index", RiskFamily.DRAWDOWN_BASED, "UCI"),
    RiskMeasure("ADD", "Average Drawdown", RiskFamily.DRAWDOWN_BASED, "ADD"),
    RiskMeasure("DaR", "Drawdown at Risk", RiskFamily.DRAWDOWN_BASED, "DaR"),
    RiskMeasure("CDaR", "Conditional Drawdown at Risk", RiskFamily.DRAWDOWN_BASED, "CDaR"),
    RiskMeasure("EDaR", "Entropic Drawdown at Risk", RiskFamily.DRAWDOWN_BASED, "EDaR"),
    RiskMeasure("RLDaR", "Relativistic Drawdown at Risk", RiskFamily.DRAWDOWN_BASED, "RLDaR", approximate=True),
    RiskMeasure("MDD", "Max Drawdown", RiskFamily.DRAWDOWN_BASED, "MDD"),
)

ALL_MEASURES: tuple[RiskMeasure, ...] = RETURN_BASED + TAIL + DRAWDOWN_BASED

BY_CODE: dict[str, RiskMeasure] = {m.code: m for m in ALL_MEASURES}


def measures_in_family(family: RiskFamily) -> tuple[RiskMeasure, ...]:
    return tuple(m for m in ALL_MEASURES if m.family is family)
