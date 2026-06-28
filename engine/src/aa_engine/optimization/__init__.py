"""aa_engine.optimization — Stadio 2: ottimizzazione di portafoglio.

FASE SUCCESSIVA (non il primo mattone). Obiettivo: ricostruire il meccanismo
"40+ modelli in parallelo -> nested walk-forward -> media dei 4 migliori".

Cinque set di modelli (vedi docs/00_analisi_sistema.md, sezione 6):
    Set 1 Classics Revised  | Set 2 Bayesiani | Set 3 Online PO
    Set 4 Robust/Uncertainty | Set 5 AI (HRP, HERC, NCO, DL/DRL)

Larga parte coperta da Riskfolio-Lib (rf.Portfolio, rf.HCPortfolio).
TODO[opt]: definire l'interfaccia OptModel e l'orchestratore multi-modello.
"""
