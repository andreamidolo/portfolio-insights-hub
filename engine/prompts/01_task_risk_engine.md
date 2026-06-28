# Prompt 01 — Task: implementare il Risk Engine (Fase 2)

Da usare con Claude Code dopo l'onboarding. Sono task in sequenza: dai uno step
alla volta, verifica, poi passa al successivo.

---

## Step 1 — `compute_measure` + `risk_panel`

```
Implementa aa_engine/risk/measures.py, funzioni compute_measure e risk_panel,
seguendo docs/02_risk_engine_spec.md sezione 2.

- Mappa ogni metrica della tassonomia (aa_engine/risk/definitions.py) su
  Riskfolio-Lib quando esiste la chiave; verifica i nomi esatti contro la
  versione installata e correggi i riskfolio_key in definitions.py se necessario.
- Implementa a mano le metriche mancanti (formule nella spec).
- Rispetta regime_mask e l'annualizzazione esplicita.
- Fai passare i test test_stddev_positive, test_cvar_geq_var,
  test_risk_panel_columns, test_regime_mask_changes_result (togli gli xfail).
- Verifica con: python -m aa_engine.risk.demo
```

## Step 2 — Individual risk

```
Implementa marginal_risk, risk_contribution, leave_one_out, worst_realizations
in aa_engine/risk/measures.py (spec sezione 3).
- Per StdDev usa la forma chiusa; per le altre metriche differenziazione numerica.
- Verifica la proprietà di Euler: test_risk_contribution_sums_to_total.
- Fai passare test_marginal_risk_index.
```

## Step 3 — VaR backtesting

```
Implementa aa_engine/risk/backtesting.py (spec sezione 4):
kupiec_pof, christoffersen_independence, christoffersen_cc, backtest_var_model,
select_best_var_model.
- In Fase 2 supporta i modelli VaR: Historical, Parametric, Cornish-Fisher.
- Aggiungi test in tests/ per i tre test statistici (usa serie note/sintetiche
  con numero di breach controllato).
```

## Step 4 — Notebook di validazione

```
Crea notebooks/01_risk_validation.ipynb che:
- carica un portafoglio campione (data/sample/),
- calcola il risk_panel completo,
- mette a confronto i valori con data/sample/algoeagle_risk_targets.csv,
- stampa una tabella di confronto e commenta le relazioni attese
  (CVaR>VaR, EDaR>CDaR>DaR, ecc.).
NON cercare il match esatto: è un confronto di ordine di grandezza e relazioni.
```

---

## Criteri di chiusura Fase 2

- `pytest -q` verde (nessun xfail residuo sui test del risk engine).
- `python -m aa_engine.risk.demo` stampa il pannello completo senza errori.
- Notebook di validazione presente e leggibile.
- Branch feat/risk-measures pronto per la review.
