# Architettura & flusso dati

> Stato del sistema al 2026-06-29. Descrive come è ospitato il motore, da dove
> arrivano i dati, come vengono trasmessi e calcolati, e cosa mostra il frontend.

## Flusso in sintesi

```
FONTI DATI
  Yahoo Finance (yfinance, 8 ETF proxy)        Excel AlgoEagle (Model/Benchmark)
        │ scarico serie                              │ import tool (config_tools)
        ▼                                            ▼
SU DISCO — Mac (persistente)
  engine/data/real/prices_real.csv             config/risk_profiles.json (v3)
        │ POST /api/v1/data/upload                   │ letto da disco
        ▼                                            ▼
MOTORE — Mac mini · FastAPI :8000
  [Store dati attivi · in memoria] → [Pipeline · 41 modelli · risk · backtest] → [Cache + Jobs · in memoria]
        │
        ▼
  Cloudflare tunnel — HTTPS pubblico (URL effimero)
        │  /api/v1/*  ·  VITE_API_BASE_URL
        ▼
FRONTEND LOVABLE — React
  Modelli & Benchmark · Run Report · Ottimizzazione · Backtest · Segnali · Rischio
```

Legenda: *su disco* = persistente (sopravvive ai riavvii); *in memoria* = si azzera
al riavvio del daemon.

## 1. Infrastruttura (hosting)

Il motore gira sul Mac mini dal **clone locale** della repo (NON da GitHub). Due
daemon `launchd` di sistema, avvio al boot + riavvio automatico se cadono:

- `com.aaengine.api` → `uvicorn aa_engine.api.main:app` sulla porta `8000`
- `com.aaengine.tunnel` → `cloudflared` (quick tunnel → URL HTTPS pubblico)

Log in `~/Library/Logs/aa-engine/`. Riavvio dopo modifiche al codice/config:
`sudo launchctl kickstart -k system/com.aaengine.api`.

Il frontend Lovable (React/Vite, ospitato da Lovable) chiama il motore a runtime
via `VITE_API_BASE_URL = <url-tunnel>/api/v1`. Sono due deploy separati: Lovable
builda solo `src/`, ignora `engine/`. L'URL del quick tunnel è **effimero** (cambia
a ogni riavvio del tunnel); per leggerlo: `bash ~/aa-engine-url.sh`.

## 2. Struttura del backend (`aa_engine`)

```
engine/src/aa_engine/
├── api/                FastAPI: endpoint, schemi, store, job async
│   ├── main.py         endpoint /api/v1/*
│   ├── schemas.py      payload Pydantic
│   ├── store.py        STORE dati di mercato in memoria + parsing CSV
│   ├── sample.py       backbone sintetico (fallback senza dati reali)
│   ├── jobs.py         job store async (backtest ensemble)
│   ├── portfolio.py    analisi di un mandato caricato
│   └── config_tools.py import modelli/benchmark da Excel AlgoEagle
├── pipeline/run.py     ORCHESTRATORE: _build_context, run_allocation, ...
├── optimization/       i 41 modelli + tassonomia (ASSET_CLASS_MAP, MACRO_CLASS)
├── risk/               risk engine (21 misure)
├── signals/            regime + segnali tecnici + selezione titoli
├── backtest/           walk-forward + Combinatorial Purged CV
├── profiles.py         loader di config/risk_profiles.json
└── config/risk_profiles.json   modelli + benchmark + bande (v3)
```

Snodo centrale: `pipeline/run.py`. `_build_context` fa regime → segnali →
selezione; da lì partono `run_allocation` (41 modelli), `compute_optimization_models`,
`compute_signals`, `compute_backtest`, `compute_ensemble_backtest`.

## 3. Fonti dati

**a) Dati di mercato** — i prezzi su cui si calcola tutto.
- Oggi: Yahoo Finance via `yfinance`, 8 ETF proxy (uno per "mattone" di asset class):
  `SPY (EQ_DM), EEM (EQ_EM), HYG (HY), IEF (BOND), QAI (ALT), GLD (GOLD), DBC (COMMOD), BIL (CASH)`.
- Salvati in `engine/data/real/prices_real.csv` (date × 8 ticker, ~17 anni).
- L'astrazione `PriceProvider` (in `aa_engine.data`) consente di sostituire i proxy
  con Bloomberg/Morningstar senza cambiare il resto.

**b) Dati di configurazione** — i portafogli modello e i benchmark.
- Origine: Excel AlgoEagle (`Model.xlsx`, `Benchmark.xlsx`).
- Convertiti in target per asset class → `config/risk_profiles.json` (v3),
  ancorato ai numeri reali Medium USD e propagato a tutti i profili/valute.
- Aggiornabili: `python -m aa_engine.config_tools file.xlsx --profile P --currency C --kind model|benchmark --apply`.

## 4. Universo investibile: gestione e persistenza

Il motore ragiona su **5 macro-classi** composte da **8 mattoni**, non su singole
security (tassonomia canonica in `optimization/sample.py`):

```
EQ_DM, EQ_EM   → equity            BOND, HY → fixed_income      ALT → alternatives
GOLD, COMMOD   → commodities       CASH     → cash
```

`ASSET_CLASS_MAP` (mattone → label motore) e `MACRO_CLASS` (label → macro-classe)
sono il ponte tra i report reali AlgoEagle e il motore.

Cosa è **salvato**:
- Su disco (persiste): `prices_real.csv` (le 8 serie) e `risk_profiles.json`.
- In memoria (NON persiste): i rendimenti calcolati dai prezzi, nello `STORE` del
  processo; ispezionabili via `GET /api/v1/data/universe`.

## 5. Come i dati arrivano al backend

I prezzi stanno su disco ma il motore li usa solo quando entrano **in memoria**:

1. `POST /api/v1/data/upload` con `{ filename, csv }` (csv = testo: prima colonna
   data, altre = ticker).
2. `store.parse_prices` valida → calcola i rendimenti → `STORE.set_market(...)`.
3. Da qui `run_allocation` e i backtest usano i dati reali; senza upload → sintetico.

⚠️ Lo `STORE` è in memoria: dopo un riavvio del daemon i prezzi vanno **ricaricati**
(l'auto-load all'avvio è un miglioramento ancora da fare).

## 6. I calcoli (per endpoint)

| Endpoint | Calcola | Costo |
|---|---|---|
| `GET /profiles` | config modelli + benchmark (v3) | istantaneo |
| `POST /allocation/run` | pipeline → 41 modelli → pesi + rischio | ~4s (cache → 0s) |
| `GET /optimization/models` | breakdown per-modello dei 41 | ~4s (cache → 0s) |
| `POST /risk/panel`, `GET /risk/contributions` | 21 misure di rischio | veloce |
| `GET /signals`, `GET /regimes` | regime + segnali tecnici | veloce |
| `POST /portfolio/analyze`, `/portfolio/reoptimize` | analisi mandato caricato | veloce |
| `POST /backtest/run` | walk-forward baseline (1/N, inverse-vol) | ~0.1s |
| `POST /backtest/ensemble` + `GET /backtest/jobs/{id}` | backtest 41 modelli (async) | minuti |

Due leve domano il costo: la **finestra trailing** `LOOKBACK_DAYS = 756` (gli
ottimizzatori vedono ~3 anni, non 17) e la **cache**.

## 7. Sincrono vs asincrono + caching

- **Sincrono**: quasi tutti gli endpoint (resi veloci da finestra trailing + cache).
- **Asincrono**: solo il backtest dei 41 modelli (minuti). `POST /backtest/ensemble`
  avvia un job in un thread e ritorna subito un `job_id`; il client fa **polling** su
  `GET /backtest/jobs/{id}` (stato + progresso fold X/Y) finché `done`/`error`.
- **Caching, due livelli**:
  - Backend: memoization in `pipeline/run.py`, chiave = input + `_data_fingerprint()`
    (hash dei rendimenti attivi). Un nuovo `/data/upload` invalida la cache da solo.
  - Frontend: cache in memoria in `src/lib/api.ts` (`cached()` + `clearApiCache()`).
- Cache e job store vivono **in memoria** (si azzerano al riavvio).

## 8. Cosa mostra il frontend Lovable

Sezioni → endpoint:
- `Modelli & Benchmark` → `GET /profiles`
- `Run Report` → `POST /allocation/run`
- `Ottimizzazione` → `GET /optimization/models`
- `Backtest` → `POST /backtest/run` (baseline) e `/backtest/ensemble` (async)
- `Segnali`, `Rischio` → segnali/regime e risk panel

Regola d'oro del data layer (`src/lib/api.ts`): mostra dati reali dal motore o uno
stato d'errore esplicito — mai numeri inventati.
