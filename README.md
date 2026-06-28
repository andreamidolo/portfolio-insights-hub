# portfolio-insights-hub

Tool interno di **asset allocation quantitativa** per LFG. Una **repo unica** che
ospita due mondi:

```
portfolio-insights-hub/
├── src/  package.json  vite.config.ts  …   ← FRONT-END  (React/Vite, TanStack, scaffold Lovable)
├── engine/                                  ← MOTORE     (Python, package aa_engine)
│   ├── src/aa_engine/   docs/   tests/   prompts/   pyproject.toml
│   └── …
└── .github/workflows/ci.yml                 ← CI del motore (gira su engine/)
```

Il front-end **non importa** il codice Python: lo **chiama** via API locale. Il
contratto è in [`engine/docs/05_api_contract.md`](engine/docs/05_api_contract.md).
La sottocartella `engine/` serve solo a tenere separati `pip` (Python) e
`bun`/`npm` (front-end) nella stessa repo.

> Filosofia: **prima la macchina, poi la benzina.** Si costruisce il motore su
> dati statici; i dati live (Bloomberg / Morningstar) arrivano alla fine.

---

## Stato

**Fase 2 — costruzione del motore.** Primo mattone completato: il **Risk Engine**
(Stadio 4 — Risk Management). Vedi [`engine/docs/01_roadmap.md`](engine/docs/01_roadmap.md).

Implementato in `engine/src/aa_engine/risk`:

| Linea | Cosa | Stato |
|-------|------|-------|
| 2 — Aggregate Risk | `compute_measure`, `risk_panel` (21 metriche, 3 famiglie) | ✅ |
| 4 — Individual Risk | `marginal_risk`, `risk_contribution`, `leave_one_out`, `worst_realizations` | ✅ |
| VaR backtesting | Kupiec POF, Christoffersen Independence/CC, traffic light Basilea | ✅ |
| API REST | FastAPI (`aa_engine.api`) — contratto `docs/05_api_contract.md` | ✅ |
| Pipeline end-to-end | `aa_engine.pipeline.run_allocation` — "il bottone" (CLI + `POST /allocation/run`) + report | ✅ |
| Backtest backbone | `aa_engine.backtest` — walk-forward + Combinatorial Purged CV + performance | ✅ |
| 2 — Optimization | `aa_engine.optimization` — `OptModel` + **~38 modelli** (4 famiglie) + ensemble robusto | ✅ |
| 1 — Signals | `aa_engine.signals` — Trend/Oscillator + SUMMARY→BL views + SVM (validato) + AlphaCrash | ✅ |
| 3 — Factorial Risk | `risk.factor` | 🔜 fase succ. |
| 5 — Stress Testing | `risk.stress` (stub documentato) | 🔜 dopo |

Ogni metrica è implementata con **formula esplicita e documentata** (no black
box) e accetta `regime_mask` per il calcolo *regime-dependent* alla AlgoEagle.
Riskfolio-Lib è una dipendenza opzionale (soft-import) usata per cross-check dove
disponibile.

---

## Quickstart

### Motore (Python ≥ 3.11)
```bash
cd engine
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

pytest -q                          # test (risk engine + backtesting + API)
python -m aa_engine.risk.demo          # pannello di rischio completo
python -m aa_engine.backtest.demo      # walk-forward + CPCV su dati campione
python -m aa_engine.optimization.demo  # pipeline Fase 3 + 3 check di sanità
python -m aa_engine.pipeline.run --profile balanced --currency EUR  # "il bottone": flusso completo + report
```

### API REST (FastAPI)
```bash
cd engine
pip install -e ".[api]"                            # fastapi + uvicorn
uvicorn aa_engine.api.main:app --reload --port 8000
# health:  http://localhost:8000/api/v1/health
# docs:    http://localhost:8000/docs
```
Endpoint (prefisso `/api/v1`, vedi `engine/docs/05_api_contract.md`):
`GET /health`, `GET /regimes`, `GET /portfolio`, `POST /risk/panel`,
`GET /risk/contributions`, `POST /allocation/run` ("il bottone"),
`GET /signals` (Stadio 1) e `GET /optimization/models` (Stadio 2 — i 41 modelli).
I dati provengono da un backbone campione deterministico (`aa_engine.api.sample`)
— stessa forma, domani, con dati live.

### Front-end (React/Vite) — dashboard a 6 sezioni
```bash
bun install
bun run dev          # Vite dev server
```
La **dashboard "apri il cofano"** rispecchia il flusso del motore con 6 sezioni
navigabili: Dati/Import → Segnali → Ottimizzazione → Backtest → Rischio →
Esegui/Report. Un unico *data service* tipizzato (`src/lib/api.ts`) parla con
l'API; la base URL è configurabile con `VITE_API_BASE_URL`
(default `http://localhost:8000/api/v1`).

> **Regola d'oro:** o è un dato VERO dall'API, o è un segnaposto DICHIARATO
> ("in arrivo"). Nessun mock travestito da dato reale. Le sezioni collegate
> (Segnali, Ottimizzazione, Rischio, Esegui/Report) mostrano dati del motore con
> badge `LIVE`; Dati/Import e Backtest sono segnaposto dichiarati finché i loro
> endpoint non esistono. Se il motore non è raggiungibile, la sezione lo dice
> chiaramente invece di mostrare numeri finti.

---

## Documentazione (in `engine/docs/`, leggere in quest'ordine)

1. `00_analisi_sistema.md` — analisi del sistema di riferimento (AlgoEagle)
2. `03_architettura_e_workflow.md` — architettura e workflow
3. `01_roadmap.md` — fasi
4. `02_risk_engine_spec.md` — specifica del Risk Engine (questo mattone)
5. `05_api_contract.md` — contratto API motore ⇄ front-end

Il regime di mercato dalle opzioni è un **binario di ricerca separato**
(`engine/research/options-regime/`): il motore lo consuma solo tramite
l'interfaccia `RegimeProvider` (oggi un `ProxyRegimeProvider`).

_Uso interno — Confidenziale._
