# 01 — Roadmap

Roadmap a fasi per la costruzione del motore. Principio guida: **prima la
macchina, poi la benzina**. Si costruisce e si valida ogni stadio su dati
statici; il flusso dati live (Bloomberg/Morningstar) si collega alla fine.

I due binari procedono in parallelo:
- **Binario A — Motore** (questo è il lavoro centrale)
- **Binario B — Opzioni/Regime** (ricerca, non bloccante) → `research/options-regime/`

---

## Fase 2 — Risk Engine (PRIMO MATTONE) 🚧

> Obiettivo: avere un risk engine che, dato un portafoglio (pesi) e serie
> storiche, produce il pannello completo di metriche di rischio e lo valida
> contro i numeri AlgoEagle.

**Binario A**
- [ ] `aa_engine.data` — `PriceData`, `StaticFileProvider`, `ProxyRegimeProvider` (fatto come scaffold; rifinire)
- [ ] `aa_engine.risk.measures.compute_measure` — tutte le metriche della tassonomia, via Riskfolio-Lib dove possibile
- [ ] `aa_engine.risk.measures.risk_panel` — pannello Return/Risk completo
- [ ] Filtro **regime-dependent** (`regime_mask`) funzionante su tutte le metriche
- [ ] `aa_engine.risk.measures` — Individual risk: `marginal_risk`, `risk_contribution`, `leave_one_out`, `worst_realizations`
- [ ] `aa_engine.risk.backtesting` — Kupiec, Christoffersen (independence + CC), `backtest_var_model`, `select_best_var_model`
- [ ] Tutti i test in `tests/test_risk_engine.py` verdi (rimuovere gli `xfail`)
- [ ] `python -m aa_engine.risk.demo` produce il pannello e il confronto coi target
- [ ] **Validazione finanziaria** (in chat di progetto): i numeri hanno senso e sono nell'ordine di grandezza dei target AlgoEagle?

**Binario B (parte in parallelo, vedi Fase 2-B sotto)**

**Definition of done Fase 2**: pannello di rischio completo + backtest VaR +
individual risk, validati su un portafoglio campione, con test verdi e CI passante.

---

## Fase 2.5 — Backtest backbone ✅

> Serve subito dopo il risk engine, perché ottimizzazione e segnali vanno
> validati out-of-sample.

- [x] `aa_engine.backtest` — Walk-Forward semplice (`WalkForwardSplitter`, rolling/expanding)
- [x] Combinatorial Purged Cross-Validation (López de Prado) — purge + embargo
- [x] Metriche di performance (CAGR, Sharpe, Sortino, Max DD, Calmar) — riusano il risk engine
- [x] Report di backtest minimale (`format_report` / `render` + `python -m aa_engine.backtest.demo`)

> Strategia = callable `train_returns -> pesi`: stessa firma dei futuri
> ottimizzatori (Stadio 2), così sono drop-in nei runner di backtest.

---

## Fase 3 — Optimization + Signals 🚧

**Optimization (Stadio 2)** — impalcatura completa, riempita con 9 modelli + baseline
- [x] Interfaccia `OptModel` + orchestratore multi-modello (`OptimizationEnsemble`)
- [x] Set 1 (Classics: MinVol, MaxSharpe, RiskParity, MinCVaR, MinCDaR) e Set 5 (HRP/HERC/NCO) via Riskfolio-Lib
- [x] Set 2 (Bayesiano: Black-Litterman, con `views` = ponte verso i segnali)
- [ ] Set 3 (Online PO) e Set 4 (Robust) — dopo, quando l'impalcatura è provata
- [x] Meccanismo "N modelli → walk-forward OOS → media dei 4 migliori" (`n_best`, `Scorer` pluggable)
- [x] `PortfolioConstraints` (profili come *range* di equity: cap + floor)

**Signals (Stadio 1, parte non-opzioni)**
- [x] Regole di **security selection** (slide 36-38 AlgoEagle) — deterministiche
- [ ] Trend scanner + oscillatori
- [ ] A.I. forecast (ensemble SVM) — la parte ML
- [ ] Alpha crash (stagionalità × momentum)
- [x] Integrazione del `RegimeProvider` (proxy/`StaticRegimeProvider` oggi, opzioni domani)

> Nota Riskfolio-Lib: pin a `>=7.2,<7.3` (la 7.3.0 ha un bug nella bisection di
> HERC). Aggiungere un modello = una classe in più (drop-in nei runner).

---

## Fase 4 — Integrazione, Reporting, Dati live

- [ ] Pipeline end-to-end: dati → segnali → selection → ottimizzazione → risk
- [ ] **API REST** (FastAPI) in `engine/src/aa_engine/api/` secondo `docs/05_api_contract.md` — endpoint a cui aggancia il front-end React (stessa repo `portfolio-insights-hub`, vedi `docs/06_repo_structure.md`)
- [ ] `aa_engine.reporting` — report mensile/settimanale (md/PDF) + Excel allocation
- [ ] **Collegare i dati live**: `BloombergProvider`, `MorningstarProvider`
- [ ] Confronto sistematico vs track record AlgoEagle

---

## Binario B — Fase 2-B: Opzioni/Regime (parallela, dal giorno uno)

> Non blocca il motore. Output finale: un `OptionsRegimeProvider` drop-in.
> Vedi `docs/04_options_research_brief.md` e `research/options-regime/`.

- [ ] Rassegna letteratura: scomposizione vol implicita (term structure, short/long)
- [ ] Recupero dati opzioni di prova (anche limitati) — superfici di vol / VIX-MOVE
- [ ] Prototipo del segnale di regime in notebook
- [ ] Backtest del segnale isolato (hit ratio per asset class, come slide 14 AlgoEagle)
- [ ] Quando robusto → implementare `OptionsRegimeProvider(RegimeProvider)`

---

## Chi fa cosa (vedi `docs/03_architettura_e_workflow.md`)

| Attività | Dove |
|----------|------|
| Architettura, specifiche, decisioni | Chat di progetto (Claude) |
| Implementazione codice, test, CI | Claude Code (Cowork) |
| Validazione finanziaria dei risultati | Chat di progetto (Claude) |
| Ricerca opzioni | Binario B (notebook + chat dedicata) |
