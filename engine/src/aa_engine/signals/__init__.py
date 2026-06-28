"""aa_engine.signals — Stadio 1: segnali e security selection.

FASE 3. Il report mensile produce per ogni strumento 5 colonne di segnale
(A.I. | Alpha Crash | Trend | Oscillators | SUMMARY) con probabilità.

Nota: il REGIME (la colonna più importante) NON vive qui ma in
aa_engine.data.RegimeProvider, perché è il punto di contatto col binario opzioni.
Qui vivono: A.I. forecast (ensemble SVM), trend scanner, oscillatori, alpha crash,
e le REGOLE DI SECURITY SELECTION (slide 36-38 AlgoEagle).

TODO[sig]: iniziare dalle regole di selection (deterministiche, facili) e dal
trend scanner; l'ensemble SVM dopo.
"""
