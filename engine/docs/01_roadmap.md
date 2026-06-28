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

**Optimization (Stadio 2)** — ✅ ensemble "vero": **~38 modelli** (4 famiglie) + baseline
- [x] Interfaccia `OptModel` + orchestratore multi-modello (`OptimizationEnsemble`)
- [x] Set 1 (Classics) — 5 base + risk-measure objectives (MinMAD/MSV/EVaR/WR/MDD/ADD/EDaR/UCI/GMD…) + timing (Kelly, Vol/Reward, Parametric)
- [x] Set 2 (Bayesiano: Black-Litterman + `views`, Bayes-Stein, Entropy-Pooling)
- [x] Set 3 (Online PO: EG, FTL, FTRL, PAMR, OLMAR, RMR, Anticor, CORN) — impl. base
- [x] Set 4 (Robust: Michaud resampling, Talmud, Goldilocks, Ellipsoidal)
- [x] Set 5 AI (HRP/HERC/NCO) ✅ — Deep (DL/DRL): **stub** rinviati a Bloomberg
- [x] Ensemble robusto ai fallimenti (modelli invalidi esclusi + loggati)
- [x] Meccanismo "N modelli → walk-forward OOS → media dei 4 migliori" (`n_best`, `Scorer` pluggable)
- [x] `PortfolioConstraints` (profili come *range* di equity: cap + floor)

> Esito espansione: 41 modelli attivi, 0 esclusi; l'ensemble **batte ancora 1/N**
> (Calmar 0.79 vs −0.34) e la selezione è **stabile** (allocazione L1 0.21). Vedi
> `docs/validation/models_expansion_results.md`.

**Signals (Stadio 1, parte non-opzioni)** — impalcatura completa a strati
- [x] Regole di **security selection** (slide 36-38 AlgoEagle) — deterministiche
- [x] Trend scanner + oscillatori (`TrendSignal`, `OscillatorSignal`)
- [x] **SUMMARY** + ponte Black-Litterman (`summary_signal`, `summary_to_bl_views`)
- [x] A.I. forecast (ensemble SVM) — validato walk-forward; **NON batte il baseline
  → escluso dal SUMMARY** (onesto, come l'iterazione opzioni)
- [x] Alpha crash (versione base: momentum 12-1 × stagionalità)
- [x] Integrazione del `RegimeProvider` (proxy/`StaticRegimeProvider` oggi, opzioni domani)

> Esito chiave: i **segnali tecnici** (via SUMMARY → views BL) **migliorano**
> l'allocazione OOS vs il motore senza segnali; l'**SVM no** (escluso). Vedi
> `docs/validation/signals_stage1_results.md`.

> Nota Riskfolio-Lib: pin a `>=7.2,<7.3` (la 7.3.0 ha un bug nella bisection di
> HERC). Aggiungere un modello = una classe in più (drop-in nei runner).

---

## Fase 4 — Integrazione, Reporting, Dati live 🚧

**Versione dimostrativa ("il bottone") ✅**
- [x] Pipeline end-to-end `aa_engine.pipeline.run_allocation`: regime → segnali → selection → ottimizzazione → risk (flusso UNICO)
- [x] **Bottone doppio**: CLI (`python -m aa_engine.pipeline.run`) + API (`POST /api/v1/allocation/run`) — stesso `run_allocation`, niente logica duplicata
- [x] **API REST** (FastAPI) secondo `docs/05_api_contract.md` — endpoint per il front-end
- [x] Report dimostrativo (md/HTML) con le 6 sezioni stile AlgoEagle

**Front-end — dashboard a 6 sezioni ("apri il cofano") ✅**
- [x] Impalcatura a 6 sezioni navigabili (Dati/Import → Segnali → Ottimizzazione → Backtest → Rischio → Esegui/Report)
- [x] Data service tipizzato unico (`src/lib/api.ts`), base URL configurabile
- [x] Sezioni collegate al motore reale: Segnali, Ottimizzazione (41 modelli), Rischio, Esegui/Report
- [x] 2 endpoint read-only aggiunti: `GET /signals`, `GET /optimization/models` ("finestre di lettura")
- [x] Regola d'oro: dato reale o segnaposto dichiarato — mock Lovable rimossi. Vedi `docs/validation/frontend_dashboard_results.md`

**Front-end iterazione 2 — Upload dati + analisi mandati reali ✅**
- [x] Sezione Dati/Import funzionante: upload prezzi (`/data/upload`, `/data/universe`) + upload mandato (`/portfolio/upload`)
- [x] Analisi del mandato reale: radiografia rischio (`/portfolio/analyze`), segnali, ri-ottimizzazione ATTUALE vs PROPOSTA (`/portfolio/reoptimize`)
- [x] Casi limite onesti: prezzi mancanti dichiarati, pesi ≠100% segnalati, CSV malformato → 400 leggibile
- [x] Stato "dati utente vs backbone campione" persistente nella dashboard. Vedi `docs/validation/frontend_upload_results.md`

**Produzione (dopo) — "benzina vera"**
- [ ] Backtest (equity line walk-forward) — prossima iterazione front-end
- [ ] `aa_engine.reporting` — report ricco (PDF/grafici) + Excel allocation
- [ ] **Collegare i dati live**: `BloombergProvider`, `MorningstarProvider`
- [ ] Confronto sistematico vs track record AlgoEagle

> Esito Fase 4 (demo): il flusso gira da un solo trigger, CLI e API danno lo
> stesso risultato, i profili sono coerentemente più/meno rischiosi. Vedi
> `docs/validation/phase4_results.md`.

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
