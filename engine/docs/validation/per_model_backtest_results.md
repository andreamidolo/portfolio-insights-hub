# Validazione — backtest per-modello dell'ensemble

> Congelamento dei risultati del **backtest per-modello** (`aa_engine.backtest.per_model`).
> Riempie il vuoto lasciato da `pipeline.run.compute_ensemble_backtest`, che restituisce
> **solo** le metriche aggregate ensemble-vs-1/N e non persiste nulla per singolo modello.

## Perché esiste

`compute_ensemble_backtest` (in `pipeline/run.py`) esegue il walk-forward dell'ensemble e
ritorna l'aggregato ensemble-vs-1/N. A ogni fold lo strategy callable consuma
`EnsembleResult` e ne tiene solo `final_weights`: **score, selezione e pesi proposti dai
singoli modelli** (`res.scores` / `res.selected` / `res.weights_by_model`) vengono scartati.
Quindi la frequenza con cui ogni modello entra nei `n_best`, e la sua performance OOS
standalone, non erano in **nessun** artefatto.

`run_per_model_backtest` colma il vuoto **senza modificare il motore**: i campi esistono già
su `EnsembleResult`; il modulo cicla i fold e li registra. A ogni fold, per **ogni** modello:

- se è entrato nei `n_best` → **frequenza di selezione** sui fold;
- il suo **score** (Calmar OOS interno dello scorer);
- la **performance OOS standalone** dei pesi proposti, applicati al fold di test
  (track record cucito → Sharpe / Calmar / MaxDD / CAGR / Sortino per modello).

Riusa `WalkForwardSplitter` e `performance_summary` del motore: numeri coerenti col resto.

- **Riproduzione (sample, deterministico)**: `python -m aa_engine.backtest.per_model --data sample --train 252 --test 63`
- **Riproduzione (dati reali)**: `python -m aa_engine.backtest.per_model --data real` (richiede `data_local/prices.csv`)
- **Artefatti**: `per_model_backtest_sample.csv` / `.json` (in questa cartella).

---

## A — Backbone sintetico (riproducibile, 8 fold)

Ensemble completo (41 modelli), `n_best=4`, train=252 / test=63, OOS 504 gg.

| Aggregato | Ensemble | 1/N |
|---|---|---|
| Sharpe | **1.30** | −0.14 |
| Calmar | **1.27** | −0.08 |
| Max Drawdown | **2.9%** | 15.5% |

Top modelli per frequenza di selezione (estratto):

| Modello | Lite | sel. freq | score medio | Sharpe (standalone) | Calmar |
|---|:--:|---|---|---|---|
| MaxRatioCVaR | — | 37.5% | 3.62 | 0.82 | 0.52 |
| MaxSharpe | ✅ | 37.5% | 3.28 | 0.60 | 0.41 |
| MinADD | — | 25.0% | 2.23 | 1.80 | 1.53 |
| MinSemiDev | — | 25.0% | 2.13 | 1.55 | 1.50 |
| MinUlcer | — | 25.0% | 2.07 | 1.81 | 1.50 |
| MinCVaR | — | 25.0% | 2.67 | 1.56 | 1.25 |

> Nota: lo **scorer** (Calmar OOS interno) e la **performance standalone** non coincidono —
> alcuni modelli con score alto hanno Sharpe standalone più basso. È atteso: lo scorer
> valuta sul walk-forward interno del training, la standalone sul test esterno.

---

## B — Dati reali (Yahoo Finance, `data_local/prices.csv`)

SPY / TLT / GLD / DBC, 2006–2026; train rolling 756, test 252.

### B.1 — Lite (6 modelli, produzione) — 17 fold completi

| Aggregato | Ensemble | 1/N |
|---|---|---|
| Sharpe | **0.83** | 0.71 |
| Calmar | **0.38** | 0.29 |
| Max Drawdown | **19.5%** | 22.6% |

| Modello | sel. freq | Sharpe (standalone) | Calmar | MaxDD |
|---|---|---|---|---|
| RiskParity | 88.2% | 0.77 | 0.33 | 20.1% |
| MaxSharpe | 76.5% | 0.85 | 0.42 | 19.2% |
| MinVolatility | 76.5% | 0.85 | 0.35 | 21.0% |
| EqualWeight | 58.8% | 0.73 | 0.30 | 22.6% |
| BlackLitterman | 52.9% | 0.70 | 0.24 | 27.0% |
| HRP | 47.1% | 0.73 | 0.27 | 24.0% |

### B.2 — Full 41 modelli — 17 fold (artefatto `per_model_backtest_real_full.csv/.json`)

| Aggregato | Ensemble (41) | 1/N |
|---|---|---|
| CAGR | **8.63%** | 6.70% |
| Sharpe | **0.922** | 0.731 |
| Sortino | **1.32** | 1.03 |
| Max Drawdown | **17.6%** | 22.6% |
| Calmar | **0.491** | 0.297 |

**Full > Lite > 1/N** (Calmar reale: 0.491 > 0.38 > 0.297). Il set completo migliora sulla
lite — i risk-measure e i robust (esclusi dalla lite per costo) aggiungono protezione nei
drawdown.

Per-modello (estratto, ordinato per frequenza di selezione; `score` = Calmar OOS interno
dello scorer; le altre colonne = performance OOS **standalone** dei pesi proposti):

| Modello | Lite | sel. freq | score | Sharpe | Calmar | MaxDD |
|---|:--:|---|---|---|---|---|
| ParametricPolicy | — | 35.3% | 0.81 | 0.85 | 0.51 | 17.6% |
| MinWR | — | 35.3% | 1.05 | 0.70 | 0.32 | 19.2% |
| MaxRatioCVaR | — | 29.4% | 0.85 | 0.83 | 0.39 | 20.4% |
| RobustEllipsoidal | — | 23.5% | 0.63 | 0.70 | 0.32 | 21.6% |
| MaxSharpe | ✅ | 17.6% | 0.81 | 0.85 | 0.42 | 19.2% |
| MinCVaR / MinEVaR / MinCDaR / MinEDaR / MinMDD | — | 17.6% | ~0.9 | ~0.8 | 0.23–0.37 | ~21% |
| … coda (online, bayesian, robust) | — | ≤12% | — | — | — | — |

**Nota controintuitiva.** Nel set completo i 4 modelli "lite" risk-based — `MinVolatility`,
`RiskParity`, `EqualWeight`, `BlackLitterman` — finiscono allo **0% di selezione**: quando
competono tutti i 41, i risk-measure e i robust ne occupano i posti nei top-4. La lite si
appoggia a quei 6 solo perché sono i pochi veloci; non perché siano i migliori scorer.

Frequenza di selezione — **nessun modello domina** (il più frequente entra 6/17 = 35%):
selezione distribuita su risk-measures, robust, online, bayesian, clustering. I **nomi** nei
top-4 ruotano fra modelli quasi-equivalenti, ma l'**allocazione** resta stabile — si tiene un
ensemble proprio perché quale modello "vince" dipende dal regime del fold.

> Tabella completa di tutti i 41 modelli: `per_model_backtest_real_full.csv`. I numeri
> dipendono da soli 4 asset (universo dei dati gratuiti); si allargheranno con Bloomberg.
>
> La tabella per-modello *standalone completa* sui 41 modelli reali si rigenera con
> `python -m aa_engine.backtest.per_model --data real --out per_model_real_full`.

---

## Lettura

1. **Il vuoto è colmato**: la frequenza di selezione e la performance OOS per-modello, prima
   `null`, ora sono dati reali e riproducibili.
2. **L'ensemble batte 1/N su dati veri**, e il full batte la lite: la diversità di modelli
   paga sul drawdown-adjusted (Calmar, MaxDD), non sul Sharpe puro (dove 1/N è competitivo —
   DeMiguel 2009).
3. **Onestà**: lo scorer interno ≠ performance standalone; nessun modello domina; i numeri
   reali dipendono da soli 4 asset (universo dei dati gratuiti) — si allargheranno con
   Bloomberg.
