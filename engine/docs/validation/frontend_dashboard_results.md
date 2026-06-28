# Validazione — Front-end dashboard a 6 sezioni ("aprire il cofano")

Iterazione: impalcatura completa a 6 sezioni + collegamento API reale. Spec
`docs/12_frontend_dashboard_spec.md`, prompt `docs/10_frontend_dashboard.md`.

- **Front-end**: React/Vite alla radice. Data service tipizzato unico
  (`src/lib/api.ts`), base URL configurabile (`VITE_API_BASE_URL`).
- **Motore**: 2 nuovi endpoint read-only (`GET /signals`, `GET /optimization/models`)
  come "finestre di lettura" sul flusso esistente — nessuna logica nuova.

---

## Le sei sezioni

```
[ Dati/Import ] → [ Segnali ] → [ Ottimizzazione ] → [ Backtest ] → [ Rischio ] → [ Esegui/Report ]
   in arrivo      Stadio 1 ✅     Stadio 2 ✅          in arrivo      Stadio 4 ✅    Output ✅
```

| Sezione | Endpoint | Stato |
|---------|----------|-------|
| Dati/Import | `POST /data/upload`, `GET /data/universe` | segnaposto dichiarato ("in arrivo") |
| Segnali | `GET /api/v1/signals` | **collegata** (nuovo endpoint) |
| Ottimizzazione | `GET /api/v1/optimization/models` | **collegata** (nuovo endpoint) |
| Backtest | `GET /api/v1/backtest` | segnaposto dichiarato ("in arrivo") |
| Rischio | `POST /risk/panel`, `/risk/contributions`, `GET /regimes` | **collegata** |
| Esegui/Report | `POST /api/v1/allocation/run` | **collegata** ("il bottone") |

---

## 4 check di sanità (spec §4)

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Le 6 sezioni sono navigabili e l'app gira? | sì — sidebar (desktop) + tab (mobile), `bun run build` OK | ✅ |
| 2 | Esegui/Report fa girare il motore vero (EUR/USD + profili)? | sì — `POST /allocation/run` con profilo/valuta/data; 41 modelli reali | ✅ |
| 3 | Rischio mostra le metriche vere (non i mock)? | sì — `/risk/panel` + `/regimes` + `/risk/contributions`; mock Lovable rimossi | ✅ |
| 4 | Dove un endpoint manca, la sezione lo dice? | sì — Dati/Import e Backtest = segnaposto "in arrivo", nessun numero finto | ✅ |

### Note tecniche

- **Regola d'oro rispettata**: `src/lib/risk-data.ts` (mock Lovable) e
  `src/lib/risk-api.ts` (adapter sui mock) **rimossi**. Il data service ritorna
  dati reali o lancia un errore; le sezioni rendono uno stato di errore esplicito
  ("Engine endpoint unavailable"), mai un valore finto.
- **Badge onesti**: `LIVE` (dato dall'API) · `LOADING` · `OFFLINE` (motore non
  raggiungibile) · `IN ARRIVO` (segnaposto dichiarato).
- **Nuovi endpoint = finestre di lettura**: `pipeline/run.py` rifattorizzato per
  estrarre `_build_context` (regime → segnali → selezione, la "parte veloce"),
  riusato da `run_allocation`, `compute_signals` e `compute_optimization_models`.
  Nessuna logica del motore duplicata nel front-end.
- **Verifica end-to-end** (TestClient, ensemble completo): `/optimization/models`
  ritorna 41 modelli con pesi (somma 1) e score walk-forward, i 4 scelti
  (RobustEllipsoidal, MaxSortino, MaxSharpe, MaxRatioCVaR), 0 esclusi, baseline
  1/N a confronto. `/signals` ritorna la tabella con SVM dichiaratamente
  disattivato.

---

## Cosa NON è in questa iterazione (come da spec §5)

- Upload CSV e vista universo (Dati/Import) → iterazione successiva.
- Endpoint backtest + equity line (Backtest) → iterazione successiva.
- Dati Bloomberg live → si lavora ancora sul backbone campione.
