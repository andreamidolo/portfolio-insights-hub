# Validazione — espansione modelli (Stadio 2: da 9 a ~38)

Congelamento dei risultati (spec `docs/10_models_expansion_spec.md`). Riferimento
per confronti futuri.

- **Ambiente**: Riskfolio-Lib 7.2.1.
- **Riproduzione**: `python -m aa_engine.optimization.demo` (~1–2 min: ogni run
  valuta ~40 modelli out-of-sample col walk-forward).
- **Dati**: backbone campione (`aa_engine.optimization.sample`).

---

## Modelli aggiunti per gruppo (fonte)

| Gruppo | Modelli | Fonte |
|--------|---------|-------|
| A — Classics (risk measures) | MinMAD, MinSemiDev, MinFLPM, MinSLPM, MinEVaR, MinWR, MinGMD, MinMDD, MinADD, MinEDaR, MinUlcer, MaxSortino, MaxRatioCVaR, Kelly | Riskfolio (`rm`/`kelly`) |
| A — Classics (timing) | VolatilityTiming, RewardToRiskTiming, ParametricPolicy | calcolo diretto |
| A — Bayesian | BayesStein (Jorion), MeucciEntropyPooling | impl. propria + Riskfolio |
| B — Online (Set 3) | ExpGradient, FollowTheLeader, FTRL, PAMR, OLMAR, RMR, Anticor, CORN | impl. propria (Li & Hoi) |
| C — Robust (Set 4) | MichaudResampling, TalmudBlend, Goldilocks, RobustEllipsoidal | Riskfolio + impl. propria |
| (preesistenti) | MinVolatility, MaxSharpe, RiskParity, MinCVaR, MinCDaR, BlackLitterman, HRP, HERC, NCO, EqualWeight | — |
| Set 5 Deep | DeepLearningOpt, DeepRLOpt | **STUB** (rinviati a Bloomberg) |

**Conteggio: 41 modelli attivi** + 2 stub Deep (non attivi). Tutte e 5 le famiglie
AlgoEagle coperte tranne i Deep.

> Nota OLPS: la libreria `universal-portfolios` non si è installata in ambiente;
> i modelli Set 3 sono implementazioni base proprie (algoritmi a regola).

---

## 3 check di sanità — tutti PASS

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Con ~38 modelli, batte ancora 1/N su Calmar? | Calmar **0.79 vs −0.34** (Sharpe 0.94 vs −0.47) OOS | ✅ |
| 2 | La selezione dei 4 è stabile o salta erraticamente? | nomi 2/4 in comune, ma **distanza L1 allocazioni = 0.21** (i top-4 sono tutti drawdown-min: stessa famiglia) | ✅ |
| 3 | Quanti modelli esclusi per non-convergenza? | **0 su 41** | ✅ |

### Lettura

1. **Batte 1/N**: sì, e nettamente — l'ensemble difensivo (top-4 = MinMDD,
   MinEDaR, MinCDaR, MinWR) protegge nel drawdown del periodo OOS dove 1/N perde.
2. **Stabilità**: i NOMI nei top-4 si scambiano fra finestre, ma sempre fra
   modelli **drawdown-minimizing equivalenti** (score molto vicini), quindi
   l'**allocazione finale è stabile** (L1 0.21 su 0–2). Non è overfitting della
   selezione fra strategie diverse: è rumore fra modelli quasi-identici. Ciò che
   conta — l'allocazione — non salta.
3. **Esclusioni**: nessuna. Tutti i 41 modelli convergono a pesi validi.
   L'ensemble è comunque robusto ai fallimenti (esclusione + log) se in futuro un
   modello degenera.

---

## Decisione (per la chat di progetto)

L'ensemble "vero" (~40 modelli, 4 famiglie) è **pronto e sano**: batte 1/N,
selezione stabile, nessuna esclusione. I due Deep restano stub fino ai dati
Bloomberg. Si può passare alla **Fase 4** (pipeline end-to-end + reporting + dati
live) con un motore di ottimizzazione completo sotto.
