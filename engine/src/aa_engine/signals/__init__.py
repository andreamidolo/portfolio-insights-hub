"""aa_engine.signals — Stadio 1: segnali e security selection.

FASE 3. Il report mensile produce per ogni strumento 5 colonne di segnale
(A.I. | Alpha Crash | Trend | Oscillators | SUMMARY) con probabilità.

Nota: il REGIME (la colonna più importante) NON vive qui ma in
aa_engine.data.RegimeProvider, perché è il punto di contatto col binario opzioni.
Qui vivono: A.I. forecast (ensemble SVM), trend scanner, oscillatori, alpha crash,
e le REGOLE DI SECURITY SELECTION (slide 36-38 AlgoEagle).

Stadio 1 implementato a strati: segnali tecnici (Trend/Oscillator) → SUMMARY +
ponte Black-Litterman → A.I. forecast (SVM, acceso solo se batte il baseline) →
Alpha Crash (base). I segnali alimentano l'ottimizzatore via *views* BL.

Il REGIME non vive qui: arriva da ``aa_engine.data.RegimeProvider`` (consumato,
non calcolato) — punto di contatto col binario opzioni.
"""

from .ai_forecast import AIForecast, ForecastValidation
from .alpha_crash import AlphaCrashSignal
from .base import Signal
from .regime import StaticRegimeProvider
from .selection import select_securities
from .summary import summary_signal, summary_to_bl_views
from .technical import OscillatorSignal, TrendSignal

__all__ = [
    # interfaccia + segnali
    "Signal", "TrendSignal", "OscillatorSignal", "AIForecast", "ForecastValidation",
    "AlphaCrashSignal",
    # combinazione + ponte ottimizzatore
    "summary_signal", "summary_to_bl_views",
    # selection + regime (fasi precedenti)
    "select_securities", "StaticRegimeProvider",
]
