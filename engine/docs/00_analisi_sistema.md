# 00 — Analisi del sistema AlgoEagle

L'analisi completa della fase 0 è nel documento Word in questa stessa cartella:

**[`00_Analisi_Sistema_AlgoEagle.docx`](./00_Analisi_Sistema_AlgoEagle.docx)**

È il documento di riferimento da leggere **prima di tutto il resto**. Contiene:

1. I materiali e le tre categorie (metodologia / output / track record)
2. L'architettura in quattro stadi
3. Stadio 1 — Segnali (il core proprietario: regime da opzioni)
4. Data management
5. Stadio 2 — Portfolio optimization (40+ modelli)
6. Stadio 3 — Backtesting & Analysis of Coherence
7. Stadio 4 — Risk management stratificato
8. Come i segnali diventano portafoglio (workflow)
9. Il track record
10. Cosa è replicabile, e quanto
11. Stack tecnologico
12. Conclusioni

## Riferimenti rapidi usati nel codice

I commenti `TODO` e le docstring nel codice rimandano alle sezioni di quel
documento. In particolare:

- **Sezione 7-8 (Risk)** → guida `aa_engine.risk` e `docs/02_risk_engine_spec.md`
- **Sezione 6 (Optimization)** → guiderà `aa_engine.optimization`
- **Sezione 4 (Data management)** → guiderà `aa_engine.data` e i de-noiser
- **Sezione 3 (Segnali/opzioni)** → guida il binario `research/options-regime/`
