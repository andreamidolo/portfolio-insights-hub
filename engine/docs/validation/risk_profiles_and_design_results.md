# Validazione — Profili configurabili (4 linee) + design system

Iterazione combinata: (A) profili di rischio configurabili a 4 linee con bande,
benchmark e 3 valute (spec docs/14); (B) applicazione del design system
`wealth` alla dashboard (spec docs/15).

---

## A. Profili di rischio configurabili (motore)

I profili sono **DATI, non codice**: vivono in `config/risk_profiles.json`
(4 linee × bande min-max su 5 asset class + benchmark + valute), lette dal motore
a ogni esecuzione (`aa_engine/profiles.py`). I numeri sono **placeholder marcati**
(`_placeholder: true`), da sostituire con le griglie reali del cliente via import/UI.

### 5 check di sanità (spec §6)

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Cambiando una banda nella config, l'allocazione cambia (data-driven)? | sì — alzando il floor equity 0→50% l'azionario sale di conseguenza (`test_changing_band_changes_allocation`) | ✅ |
| 2 | Una griglia infeasibile dà un messaggio chiaro, non un crash? | sì — `ProfileConfigError` con il vincolo violato (min>max, Σmin>100%, Σmax<100%, [0,1]) | ✅ |
| 3 | I 4 profili sono ordinati per rischio (StdDev crescente)? | sì — StdDev **0.021 ≤ 0.031 ≤ 0.052 ≤ 0.093** (conservative→aggressive) | ✅ |
| 4 | Il confronto col benchmark del profilo compare nel report? | sì — blocco `benchmark` in `AllocationResult`/API + tabella nel report md/HTML e nella UI | ✅ |
| 5 | Le 3 valute funzionano (EUR/USD/CHF)? | sì — Literal estesa, selettore a 3, passate fino al risultato | ✅ |

### Note tecniche

- `PortfolioConstraints` invariato come struttura: le bande di gruppo diventano
  cap+floor per *gruppo* (5 asset class), mappando i ticker sui gruppi
  (`group_map`) — riusa la macchina Riskfolio + `enforce_caps` esistente.
- I 3 profili legacy restano compatibili (`for_profile` mantenuto per i test);
  la pipeline ora usa `constraints_for` (config-driven).
- Endpoint aggiunto: `GET /api/v1/profiles` (la UI legge le 4 linee, le bande, i
  benchmark, le valute). `POST /allocation/run` include il blocco `benchmark`.
- Test: `tests/test_profiles.py` (11 test). Suite motore: **166 verdi**.

---

## B. Design system (`wealth`) sulla dashboard

Design system vendorizzato in `/design-system` (riferimento; immagini demo del brand di riferimento
rimosse per non gonfiare la repo — vedi `design-system/USAGE.md`).

### 5 check di sanità (spec §5)

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | La dashboard "on-brand" (burgundy/sand, Raleway, editoriale)? | sì — token `wealth` mappati sugli alias semantici in `src/styles.css`, font Raleway, `data-brand="wealth"` | ✅ |
| 2 | I grafici usano la palette del brand (burgundy/gold), non colori a caso? | sì — `recharts` con `brand-theme.ts` (burgundy/sand/teal/navy), niente arcobaleni | ✅ |
| 3 | Le tabelle sono editoriali (hairline, header UPPERCASE, numeri allineati)? | sì — `MetricsTable`, tabella segnali, universo/mandato, 41 modelli | ✅ |
| 4 | La tabella dei 41 modelli è ordinabile coi 4 scelti evidenziati? | sì — header ordinabili (modello/famiglia/score), righe scelte in burgundy con ★ | ✅ |
| 5 | Le StatCard mostrano le metriche chiave coerenti col brand? | sì — `StatCard` (numerale thin) per Cumulative/Sharpe/MaxDD/Volatility | ✅ |

### Grafici implementati (mappa §4.2)

- **Allocazione**: donut per asset class (Ottimizzazione, Esegui/Report).
- **Contribuzioni di rischio**: barre orizzontali (Rischio).
- **ATTUALE vs PROPOSTA**: barre affiancate (analisi mandato, Dati/Import).
- **Regimi**: badge bull/bear per asset class (teal/burgundy).
- Equity line + drawdown (Backtest) e curva IV (opzioni): seguono quando ci
  saranno gli endpoint/dati.

### Onestà visiva (regola d'oro mantenuta)

LIVE / OFFLINE / IN ARRIVO restano espliciti; nessun mock travestito da dato
reale. Il brand non è mescolato (solo `wealth`). Niente colore grezzo fuori dai
token. I numeri dei profili e dei benchmark sono dichiarati placeholder.

### Verifica build

- Front-end: `tsc --noEmit` pulito, `eslint` 0/0, `bun run build` OK.
