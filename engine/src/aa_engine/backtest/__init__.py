"""aa_engine.backtest — Stadio 3: backtesting.

Serve presto (fase 2.5) perché il risk engine e l'ottimizzazione vanno validati.
Approcci (vedi docs/00_analisi_sistema.md, sezione 7):
    Walk-Forward (basic/nested/permutation), Cross-Validation
    (basic/combinatorial/symmetric), Permutation Test, Simulazioni
    (Monte Carlo, Historical Filtered, GAN), Controlled Environments.

Ispirazione: Combinatorial Purged CV di López de Prado.
TODO[bt]: iniziare da WalkForward semplice + Combinatorial Purged CV.
"""
