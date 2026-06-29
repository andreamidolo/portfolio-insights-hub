# 05 — Contratto API (motore ⇄ front-end)

Definisce la **forma dei dati** scambiati tra il **motore** (Python, in `engine/`)
e il **front-end** (React/Vite, alla radice) — che vivono nella **stessa repo**
`portfolio-insights-hub`, entrambi sviluppati da Claude Code. È un contratto:
permette alle due metà di procedere **in parallelo** senza aspettarsi a vicenda.
Restano linguaggi diversi, quindi si parlano via API (in locale).

> Questo documento NON è codice. È l'accordo su endpoint e payload. Quando Claude
> Code implementerà l'API (FastAPI) nel motore, dovrà rispettare esattamente questi
> schemi; il front-end usa mock con questa stessa forma e poi sostituisce l'URL
> con quello dell'API locale.

---

## 0. Principi

- **REST + JSON**, stateless. Nessuna logica nel front-end: la UI mostra ciò che
  l'API restituisce.
- **Disaccoppiamento**: la UI dipende SOLO da questi schemi, mai
  dall'implementazione Python. Cambiare il motore non rompe la UI finché gli
  schemi restano stabili.
- **Versionamento**: prefisso `/api/v1/`. Cambi incompatibili → `/api/v2/`.
- **Tutto in chiaro e tipizzato**: ogni campo ha tipo e unità documentati.
- **CORS** abilitato per l'origine del front-end (config, non hardcoded).

---

## 1. Convenzioni

- Date: stringa ISO `YYYY-MM-DD`.
- Valori percentuali: **numeri decimali** (es. `0.1378` = 13.78%), il front-end
  formatta. Campo sempre suffissato logicamente nella doc come "(frazione)".
- Pesi di portafoglio: frazioni che sommano a 1.0.
- Regime: stringa `"bull"` | `"bear"`.
- Profili rischio: `"moderate"` | `"balanced"` | `"aggressive"`.
- Valute: `"EUR"` | `"USD"`.
- Errori: JSON `{ "error": { "code": str, "message": str } }` + HTTP status.

---

## 2. Endpoint

### 2.1 `GET /api/v1/health`
Liveness check.
```json
{ "status": "ok", "version": "0.1.0" }
```

---

### 2.2 `GET /api/v1/regimes`
Stato del regime per asset class (Linea 1 del risk management). Oggi alimentato
dal `ProxyRegimeProvider`, domani dall'`OptionsRegimeProvider` — la UI non vede
differenza.

Query params (opzionali): `as_of=YYYY-MM-DD`.

**Response**
```json
{
  "as_of": "2026-06-22",
  "source": "proxy",
  "regimes": [
    { "asset_class": "Equity",       "regime": "bear" },
    { "asset_class": "Fixed Income", "regime": "bull" },
    { "asset_class": "Dollar",       "regime": "bull" },
    { "asset_class": "Commodities",  "regime": "bear" },
    { "asset_class": "Gold",         "regime": "bear" }
  ]
}
```
Note: `source` ∈ {`"proxy"`, `"options"`} — utile per mostrare in UI quale motore
di regime è attivo.

---

### 2.3 `GET /api/v1/portfolio`
Il portafoglio corrente per un profilo/valuta (pesi e classificazione).

Query params: `profile=balanced` (default), `currency=EUR` (default).

**Response**
```json
{
  "profile": "balanced",
  "currency": "EUR",
  "as_of": "2026-06-22",
  "holdings": [
    { "name": "iShares MSCI World ETF", "isin": "US4642863926", "asset_class": "Equity",       "weight": 0.0191, "currency": "USD" },
    { "name": "USD Treasury 7-10y ETF",  "isin": "IE00B3VWN518", "asset_class": "Fixed Income", "weight": 0.0000, "currency": "USD" }
  ],
  "asset_class_weights": {
    "Equity": 0.60, "Fixed Income": 0.20, "Commodities": 0.10,
    "HY": 0.10, "Alternative": 0.00, "Money Market": 0.00
  },
  "currency_exposure": { "EUR": 0.26, "USD": 0.52, "CHF": 0.02 }
}
```

---

### 2.4 `POST /api/v1/risk/panel`  ⭐ (il primo mattone)
Calcola il pannello di rischio completo per un portafoglio. Replica la tabella
"Analysis of Coherence". È l'endpoint centrale per la pagina "Risk Panel".

**Request**
```json
{
  "profile": "balanced",
  "currency": "EUR",
  "alpha": 0.05,
  "mar": 0.0,
  "regime_conditional": true
}
```
- `regime_conditional`: se `true`, le metriche sono calcolate sui soli giorni del
  regime corrente (comportamento AlgoEagle). Se `false`, su tutta la storia.

**Response**
```json
{
  "profile": "balanced",
  "currency": "EUR",
  "as_of": "2026-06-22",
  "alpha": 0.05,
  "regime_conditional": true,
  "summary": {
    "cumulative_return": 0.1378,
    "cagr": 0.0267,
    "sharpe": 1.53,
    "max_drawdown": 0.0453,
    "volatility": 0.0753
  },
  "metrics": [
    { "family": "return_based",   "code": "MV",   "name": "Standard Deviation",          "value": 0.0753, "ret_over_risk": 0.53 },
    { "family": "return_based",   "code": "MAD",  "name": "Mean Absolute Deviation",     "value": 0.0490, "ret_over_risk": 0.82 },
    { "family": "tail",           "code": "VaR",  "name": "Value at Risk",               "value": 0.1133, "ret_over_risk": 0.35 },
    { "family": "tail",           "code": "CVaR", "name": "Conditional Value at Risk",   "value": 0.1919, "ret_over_risk": 0.21 },
    { "family": "drawdown_based", "code": "CDaR", "name": "Conditional Drawdown at Risk","value": 0.1440, "ret_over_risk": 0.28 },
    { "family": "drawdown_based", "code": "MDD",  "name": "Max Drawdown",                "value": 0.2010, "ret_over_risk": 0.20 }
  ]
}
```
Note:
- `metrics` contiene **tutte** le metriche della tassonomia (vedi
  `aa_engine.risk.definitions`), non solo quelle d'esempio sopra.
- `family` ∈ {`return_based`, `tail`, `drawdown_based`} → la UI le raggruppa in
  tre sezioni.
- I valori numerici dell'esempio sono i target AlgoEagle: utili anche come **mock
  per il front-end** finché l'API non è pronta.

---

### 2.5 `GET /api/v1/risk/contributions`
Contributo al rischio individuale (Linea 4). Per la futura vista "drill-down".

Query params: `profile`, `currency`, `measure=MV` (default).

**Response**
```json
{
  "profile": "balanced", "currency": "EUR", "measure": "MV",
  "contributions": [
    { "name": "iShares MSCI World ETF", "weight": 0.019, "risk_contribution": 0.012 }
  ]
}
```

---

### 2.6 `POST /api/v1/allocation/run`  ⭐ (Fase 4 — "il bottone")
Esegue il flusso unico end-to-end (regime → segnali → selezione → ottimizzazione
→ rischio) e ritorna il risultato completo. Stesso `run_allocation` della CLI.

**Request**: `{ "profile": "balanced", "currency": "EUR", "as_of": null }`
**Response** (estratto): `profile`, `currency`, `as_of`, `n_models_active`,
`regimes` (mappa asset-class → regime), `signals` (tabella, vedi 2.7),
`selected`/`discarded`, `selected_models` (i 4 scelti), `final_weights`,
`asset_class_weights`, `risk` (std_dev/var_95/cvar_95/max_drawdown/calmar/sharpe/
cagr), `excluded_models`. ⚠️ gira ~41 modelli → decine di secondi.

---

### 2.7 `GET /api/v1/signals`  (Stadio 1 — "finestra di lettura")
Tabella segnali per strumento. Veloce (niente ottimizzazione), profilo-indipendente.

Query params (opzionali): `as_of=YYYY-MM-DD`.

**Response**
```json
{
  "as_of": "2026-06-26",
  "svm_enabled": false,
  "svm_note": "A.I. (SVM) disattivato — validato walk-forward, non batte il baseline.",
  "regimes": { "Equity": "bull", "Fixed Income": "bear" },
  "selected": ["EQ_DM", "BOND"],
  "discarded": [],
  "signals": [
    {
      "ticker": "EQ_DM", "asset_class": "Equity",
      "trend":       { "direction": 1,  "probability": 0.66 },
      "oscillator":  { "direction": 0,  "probability": 0.00 },
      "alpha_crash": { "direction": -1, "probability": 0.26 },
      "summary":     { "direction": 1,  "probability": 0.31 }
    }
  ]
}
```
Note: `direction` ∈ {−1, 0, +1}; `svm_enabled` è sempre `false` (l'A.I. è
disattivato finché non batte il baseline — onestà, vedi `svm_note`).

---

### 2.8 `GET /api/v1/optimization/models`  (Stadio 2 — "apri il cofano")
I 41 modelli con i pesi che propongono e il loro score walk-forward, i 4 scelti,
l'allocazione finale (media dei 4) e il confronto col baseline 1/N.

Query params: `profile=balanced`, `currency=EUR`, `as_of` (opzionali).

**Response** (estratto)
```json
{
  "profile": "balanced", "currency": "EUR", "as_of": "2026-06-26",
  "scorer": "calmar", "n_best": 4, "n_models_active": 41,
  "selected_models": ["RobustEllipsoidal", "MaxSortino", "MaxSharpe", "MaxRatioCVaR"],
  "universe": ["EQ_DM", "EQ_EM", "HY", "BOND", "GOLD", "CASH"],
  "selected": ["EQ_DM", "BOND", "GOLD"], "discarded": [],
  "models": [
    { "name": "MaxSharpe", "family": "classics", "score": 0.25, "selected": true,
      "weights": { "EQ_DM": 0.30, "BOND": 0.40, "GOLD": 0.30 } }
  ],
  "excluded_models": {},
  "final_weights": { "EQ_DM": 0.27, "BOND": 0.40, "GOLD": 0.15 },
  "asset_class_weights": { "Equity": 0.30, "Fixed Income": 0.40, "Gold": 0.15 },
  "baseline_equal_weight": { "EQ_DM": 0.1667, "BOND": 0.1667 },
  "baseline_score": 0.01
}
```
Note: `family` ∈ {`classics`, `bayesian`, `ai`, `online`, `robust`, `baseline`};
`score` è `null` per un modello non valutabile; i pesi ≈0 sono omessi.
⚠️ gira l'ensemble completo → decine di secondi.

---

### 2.9 `POST /api/v1/data/upload`  (iterazione 2 — i dati veri)
Carica un CSV di **prezzi storici** (il "carburante"). Body JSON (niente
multipart): `{ "filename": "prezzi.csv", "csv": "<contenuto del file>" }`. Prima
colonna = data, le altre = strumenti (prezzi). Lo store è **in memoria** (si
azzera al riavvio). Validazione tollerante ma onesta: i problemi diventano
`warnings`, non numeri inventati. Ritorna lo stesso schema di `GET /data/universe`.
Errori → HTTP 400 `{ "error": { "code": "invalid_upload", "message": ... } }`.

### 2.10 `GET /api/v1/data/universe`
L'universo attivo (utente se caricato, altrimenti backbone campione).
```json
{
  "source": "user", "filename": "prezzi.csv",
  "n_instruments": 4, "n_observations": 299,
  "date_start": "2025-05-06", "date_end": "2026-06-26",
  "instruments": [
    { "ticker": "AAA", "asset_class": "Unknown", "n_observations": 299, "known": false }
  ],
  "warnings": []
}
```

### 2.11 `POST /api/v1/portfolio/upload`
Carica un CSV di **composizione** mandato. Body `{ "csv": "ticker,peso\n..." }`.
Riconosce colonne `ticker`/`isin` + `peso`/`weight`; i pesi in % (somma ~100)
sono riportati a frazione (con nota). Valida la somma (~1.0) e segnala gli
strumenti privi di prezzi nell'universo attivo.
```json
{
  "holdings": [ { "ticker": "AAA", "isin": "", "weight": 0.4, "asset_class": "Unknown" } ],
  "weight_sum": 1.0, "missing_prices": ["ZZZ"], "warnings": ["…"]
}
```

### 2.12 `POST /api/v1/portfolio/analyze`
Radiografia del rischio del mandato **così com'è** (pesi dell'utente, non
ottimizzati). Body `{ "holdings": [{ "ticker", "weight" }], "alpha": 0.05, "mar": 0 }`.
Ritorna `summary`, le 21 `metrics`, le `contributions`, i `regimes` e i `signals`
sugli strumenti del mandato, più `covered_weight` e `missing_prices` (gli
strumenti senza prezzi sono ESCLUSI e dichiarati, mai inventati).

### 2.13 `POST /api/v1/portfolio/reoptimize`
ATTUALE vs PROPOSTA. Body `{ "holdings", "profile", "currency" }`. Esegue
l'ensemble sull'universo del mandato e ritorna `comparison` (pesi attuale/
proposto/Δ per strumento), `risk_current`/`risk_proposed`/`risk_delta`
(StdDev/CVaR/MaxDD/…), i 4 `selected_models`. ⚠️ gira i 41 modelli → lento.

---

### 2.14 `GET /api/v1/profiles`  (profili configurabili — docs/14)
I **4 profili** di rischio come DATI (config `config/risk_profiles.json`): bande
min-max per le 5 asset class, benchmark, valute. La UI legge da qui i selettori e
l'editor delle bande.
```json
{
  "placeholder": true,
  "asset_classes": ["equity", "fixed_income", "commodities", "cash", "alternatives"],
  "currencies": ["EUR", "USD", "CHF"],
  "profiles": [
    { "id": "balanced", "label": "Balanced", "benchmark": "bm_balanced",
      "bands": { "equity": {"min": 0.30, "max": 0.60}, "fixed_income": {"min": 0.20, "max": 0.50}, "...": {} } }
  ],
  "benchmarks": [ { "id": "bm_balanced", "label": "...", "composition": { "equity": 0.45, "...": 0 } } ]
}
```
Note: `placeholder: true` ⇒ valori d'esempio, da sostituire con quelli del cliente.
`POST /allocation/run` ora include anche un blocco `benchmark` (pesi + rischio del
benchmark del profilo) per il confronto allocazione-vs-benchmark, e accetta
profilo ∈ {conservative, moderate, balanced, aggressive} e valuta ∈ {EUR, USD, CHF}.

---

## 3. Endpoint futuri (placeholder — non implementare ora)

Definiti qui solo per dare alla UI la mappa delle pagine successive.

- `GET /api/v1/backtest` → equity line walk-forward (ensemble vs 1/N) + metriche
  storiche (CAGR, Sharpe, Sortino, MaxDD, Calmar). (iterazione successiva)

---

## 4. Come usano questo contratto le due metà (stessa repo)

**Front-end (React/Vite, alla radice di `portfolio-insights-hub`)**
- Crea un unico *data service* tipizzato (TypeScript) con questi schemi.
- All'inizio ritorna i **mock** (i valori d'esempio qui sopra).
- Quando l'API è viva, cambia solo il base URL: `http://localhost:<porta>/api/v1`.

**Motore (Python, in `engine/`)**
- Implementa una app FastAPI in `engine/src/aa_engine/api/` (fase dedicata) che
  restituisce **esattamente** questi schemi, mappando sulle funzioni di
  `aa_engine.risk`.
- Aggiunge modelli Pydantic che fissano i campi → contratto verificabile.
- Abilita CORS per l'origine del front-end locale.

**Avvio in locale (dev)**
- Front-end: `npm run dev` (porta Vite, es. 5173).
- Motore: `uvicorn aa_engine.api.main:app --reload` (es. 8000).
- Il front-end punta a `http://localhost:8000/api/v1`.

---

## 5. Regola d'oro

> Se serve cambiare uno schema, si aggiorna **prima questo documento**, poi le due
> metà. Il contratto è la fonte di verità condivisa tra motore e front-end.
