# 02 — Specifica del Risk Engine (primo mattone)

Specifica di dettaglio per implementare `aa_engine.risk`. Replica lo **Stadio 4
— Risk Management Stratificato** di AlgoEagle (cfr. `00_analisi_sistema.md` §7-8).

Destinatario: chi implementa (Claude Code). Validatore: chat di progetto.

---

## 0. Principi non negoziabili

1. **Regime-dependent**: AlgoEagle calcola il rischio aggregato *usando solo i
   dati del regime corrente*. Ogni funzione accetta `regime_mask` (serie
   booleana). Quando presente, si filtrano i rendimenti **prima** del calcolo.
2. **Riskfolio-Lib first**: per le metriche standard usare Riskfolio-Lib; non
   reimplementare ciò che esiste e è testato. Reimplementare a mano solo il
   mancante o il regime-conditional.
3. **No black box**: ogni metrica ha una docstring con definizione e formula.
4. **Annualizzazione esplicita**: documentare per ogni metrica se è annualizzata
   e con quale convenzione (cfr. note AlgoEagle: ×252 per i return, ×√252 per le
   dispersioni). Esporre il fattore come parametro.

---

## 1. Le cinque linee (mappa moduli)

| Linea | Cosa | Modulo | Priorità |
|-------|------|--------|----------|
| 1 | Regimes | `data.RegimeProvider` (proxy) | già scaffold |
| 2 | Aggregate Risk (VaR/CVaR + pannello) | `risk.measures` | **alta** |
| 3 | Factorial Risk | `risk.factor` (nuovo, fase succ.) | media |
| 4 | Individual Security Risk | `risk.measures` | **alta** |
| 5 | Stress Testing | `risk.stress` | bassa (dopo) |

In Fase 2 si completano **Linea 2 e Linea 4** + **backtest VaR**. Linea 3 e 5 dopo.

---

## 2. Linea 2 — Aggregate Risk

### 2.1 Metriche (tassonomia in `definitions.py`)

Tre famiglie, esattamente come la slide "Analysis of Coherence":

- **Return-based**: MV (StdDev), MAD, MSV (Semi-Std), FLPM (Omega), SLPM
  (Sortino), GMD (Gini Mean Difference), TG (Tail Gini), Kurtosis, Skewness.
- **Tail**: VaR, CVaR, EVaR (Entropic), RLVaR (Relativistic), WR (Worst Realization).
- **Drawdown-based**: UCI (Ulcer), ADD (Avg DD), DaR, CDaR, EDaR, RLDaR, MDD.

> Mappare ciascuna su `riskfolio` (vedi `RiskMeasure.riskfolio_key`). **Verificare
> i nomi esatti** contro la versione installata di Riskfolio-Lib: l'API espone
> queste misure sia come funzioni (`rf.RiskFunctions`) sia come `rm=` negli
> ottimizzatori. Dove la chiave non esiste, implementare a mano.

### 2.2 `compute_measure(returns, weights, measure, alpha, regime_mask)`

1. `r_p = _portfolio_returns(returns, weights)` (già fornito).
2. Applicare `regime_mask` se presente.
3. Dispatch su `measure`:
   - se Riskfolio ha la funzione → usarla su `r_p`;
   - altrimenti calcolo manuale (vedi formule sotto).
4. Annualizzare secondo convenzione e ritornare `float`.

**Formule per i casi manuali principali** (se non si usa Riskfolio):
- StdDev annualizzata: `r_p.std(ddof=1) * sqrt(252)`.
- VaR storico (α): `-quantile(r_p, α)` (valore positivo = perdita).
- CVaR (α): `-mean(r_p[r_p <= quantile(r_p, α)])`.
- MAD: `mean(|r_p - mean(r_p)|)`.
- Semi-Std: `sqrt(mean(min(r_p - mean, 0)^2))`.
- Ulcer Index: `sqrt(mean(drawdown^2))` su equity cumulata.
- Max Drawdown: max picco-valle su equity cumulata.

### 2.3 `risk_panel(...)`

Per ogni metrica: `value` + ratio `(Return - MAR)/Risk` (MAR = Minimum
Acceptable Return, default 0). Output `DataFrame` con colonne
`[family, measure, value, ret_minus_mar_over_risk]`, ordinato per famiglia.

---

## 3. Linea 4 — Individual Security Risk

- `marginal_risk(returns, weights, measure)`:
  derivata della metrica rispetto ai pesi. Per StdDev forma chiusa:
  `MR = (Σ w) / sqrt(wᵀ Σ w)`. Per le altre, differenziazione numerica
  (incremento piccolo sul peso, ricalcolo, rapporto incrementale) o utility
  Riskfolio. Output `Series[ticker]`.
- `risk_contribution(...)`: `RC_i = w_i * MR_i`. Proprietà di Euler: per misure
  omogenee di grado 1, `sum(RC) == metrica_totale` → **testato**.
- `leave_one_out(..., reinvest)`: per ogni strumento, ricalcolo della metrica
  escludendolo (pesi azzerati; se `reinvest=True` redistribuzione pro-rata).
  Output `Series[ticker]` = delta rispetto al portafoglio pieno. Calcolare anche
  per regime (Bull/Bear) usando `regime_mask`.
- `worst_realizations(..., n)`: le `n` peggiori giornate del portafoglio con
  contributo di ogni strumento. Output `DataFrame index=date, cols=[Tot, *ticker]`.

---

## 4. VaR backtesting (`backtesting.py`)

Replica la slide "Backtesting". Per un modello che produce previsioni di VaR
giornaliere:

- **Breach**: `r_realized < VaR_forecast` (entrambi negativi).
- **Kupiec POF** (chi2, 1 df): LR su frequenza osservata vs α.
- **Christoffersen Independence** (chi2, 1 df): no clustering delle violazioni,
  via matrice di transizione degli stati 0/1.
- **Conditional Coverage** (chi2, 2 df): `LR_cc = LR_pof + LR_ind`.
- **Traffic light** (Basilea): green/yellow/red per fasce di numero di breach.
- `select_best_var_model`: score che premia `failure_rate ≈ α`, p-value alti su
  independence e CC, traffic light green.

Modelli VaR da supportare a tendere (slide AlgoEagle): Historical, EVT,
Cornish-Fisher, Monte Carlo, Parametric, HFS, Gaussian Copula, T-Copula, Deep
VaR, CNN VaR. **In Fase 2 bastano Historical + Parametric + Cornish-Fisher**;
gli altri (specie Deep/CNN) sono fasi successive.

---

## 5. Validazione (ground truth)

`data/sample/algoeagle_risk_targets.csv` contiene i valori della slide "Analysis
of Coherence". Procedura:

1. Costruire un portafoglio campione (idealmente simile al loro "Medium Risk").
2. Calcolare il `risk_panel`.
3. Confrontare ordine di grandezza con i target.

⚠️ Non aspettarsi match esatto: input, universo e finestra non sono noti. La
**validazione finanziaria** (la facciamo in chat di progetto) verifica che le
relazioni siano corrette (es. `CVaR > VaR`, `EDaR > CDaR > DaR`, drawdown
coerenti) e che gli ordini di grandezza tornino.

---

## 6. Output atteso della Fase 2

- `pytest -q` verde (xfail rimossi).
- `python -m aa_engine.risk.demo` stampa il pannello completo.
- Un breve notebook (`notebooks/01_risk_validation.ipynb`) col confronto vs target.
