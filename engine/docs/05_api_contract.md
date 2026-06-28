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

## 3. Endpoint futuri (placeholder — non implementare ora)

Definiti qui solo per dare alla UI la mappa delle pagine successive.

- `POST /api/v1/optimization/run` → lancia l'ottimizzazione multi-modello,
  ritorna le allocazioni candidate e la media dei 4 migliori. (Fase 3)
- `POST /api/v1/backtest/run` → backtest di una strategia, ritorna equity curve e
  metriche di performance. (Fase 2.5/3)
- `GET /api/v1/signals` → tabella segnali per strumento
  (A.I. | Alpha Crash | Trend | Oscillators | SUMMARY). (Fase 3)

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
