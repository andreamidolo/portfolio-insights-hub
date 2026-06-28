# Validazione Fase 4 — Integrazione end-to-end ("il bottone")

Versione dimostrativa: un trigger unico fa partire l'intero flusso e produce un
report. Spec `docs/11_phase4_integration_spec.md`.

- **Riproduzione**: `python -m aa_engine.pipeline.demo` (~1–2 min) o
  `python -m aa_engine.pipeline.run --profile balanced --currency EUR`.
- **Flusso unico**: `aa_engine.pipeline.run_allocation` — CLI e API lo chiamano
  entrambi (nessuna logica duplicata).
- **Dati**: backbone campione; SVM disattivato; nessun dato live.

---

## Il flusso

```
trigger (CLI | POST /api/v1/allocation/run)
  → regime (proxy) per asset class
  → segnali tecnici (Trend+Oscillator+AlphaCrash) → SUMMARY → views BL
  → select_securities (filtra per regime)
  → OptimizationEnsemble (41 modelli → 4 migliori → media, con le views)
  → risk_panel sull'allocazione finale
  → AllocationResult → report (md/HTML)
```

## 4 check di sanità — tutti PASS

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Il flusso gira end-to-end senza intervento manuale? | sì (41 modelli attivi) | ✅ |
| 2 | I numeri tornano fra le sezioni? | Σpesi=1.000, Σasset-class=1.000, peso-classe = Σ-strumenti | ✅ |
| 3 | Cambiando profilo, rischio crescente? | StdDev **0.022 ≤ 0.054 ≤ 0.116** (moderate/balanced/aggressive) | ✅ |
| 4 | CLI e API danno lo STESSO risultato? | sì — stesso `run_allocation`, output identico | ✅ |

### I tre che contano (nota del coordinator)

- **Report leggibile**: sì — 6 sezioni (intestazione, executive summary per asset
  class, tabella segnali, allocazione strumento/classe, pannello di rischio, i 4
  modelli scelti). È il primo output "presentabile" del sistema.
- **CLI == API**: PASS — un solo punto di verità, nessuna logica divergente.
- **Profilo → report sensato**: PASS — rischio coerentemente crescente.

---

## Esempio di report (balanced, ensemble completo)

- Modelli attivi: 41 — 4 scelti: RobustEllipsoidal, MaxSortino, MaxSharpe, MaxRatioCVaR.
- Regimi: Equity 🟢, Gold 🟢, HY 🟢 / Fixed Income 🔴, Commodities 🔴.
- Allocazione (balanced): BOND 37.5%, GOLD 32.5%, Equity 30.0% (EQ_DM+EQ_EM);
  COMMOD scartato (Commodities BEAR + alto rischio).
- Rischio: StdDev ~5.4%, CVaR ~11%, MaxDD ~8%, Sharpe ~0.9.

> Il report completo si rigenera con la CLI/demo (`report_balanced.md` / `.html`,
> non versionati).

---

## Decisione (per la chat di progetto)

Il sistema è un **dimostratore completo end-to-end**: da un solo bottone produce
un'allocazione e un report presentabile. I prossimi passi sono "benzina vera":
dati Bloomberg, stress test storico, i due Deep, ricerca opzioni round 2, e il
front-end che chiama `POST /api/v1/allocation/run`.
