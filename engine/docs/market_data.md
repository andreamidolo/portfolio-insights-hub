# Market data — base Bloomberg del motore

Provenienza e governance dei dati di mercato reali che sostituiscono i prezzi Yahoo
come **base dell'universo e del motore**.

## Sorgente

- **Bloomberg** (Data Pack `solo_valori.xlsx`, formule BDH `PX_LAST` giornaliere).
- Copertura: **2006-07-06 → 2026-07-01** (~20 anni, ~5.160 giorni lavorativi).
- Prezzi **aggiustati** (total-return / adjusted): corretti per il calcolo dei rendimenti.

## Cosa contiene

| File (in `engine/data/market/`, **gitignored**) | Contenuto |
|---|---|
| `prices.csv` | date × **35 strumenti investibili** (Equity DM/EM, Fixed Income IG/HY, Commodity, Alternative) |
| `vol_indices.csv` | date × **6 indici vol**: VIX, VXN, MOVE, V2X, OVX, GVZ |
| `signal_series.csv` | date × strumenti "solo_segnale" (se presenti nell'export) |
| `universe.csv` | manifest generato dall'ETL |
| `config/market_universe.csv` (**versionato**) | manifest metadati: symbol, ISIN, valuta, asset_class, gruppo, ruolo |

## Governance / licensing

- I **valori di prezzo Bloomberg NON sono versionati** (`data/*` è gitignored, `.gitignore`),
  per le restrizioni di redistribuzione. Vivono localmente / sul deployment.
- È versionato **solo il manifest metadati** (`config/market_universe.csv`) — ticker, ISIN,
  classi, gruppi — che non è dato di prezzo.
- Rigenerazione: `python -m aa_engine.data.bloomberg_import <solo_valori.xlsx>`
  → riscrive `engine/data/market/*.csv`.

## Come il motore lo usa

- Loader: `aa_engine.data.market_data` — `load_returns()`, `asset_class_map()`, `load_base_returns()`.
- **Base di default** (`load_base_returns()`): strumenti con ≥10y di storia sulla loro
  **finestra comune** → ~**31 strumenti, ~2015→oggi (11 anni)**, covarianza pulita. Questa
  scelta evita le colonne a varianza zero da start scaglionati (che con `fillna(0)`
  escludevano HRP ogni fold). Le serie 20y complete restano in `prices.csv` (`load_returns()`).
- **Default di produzione**: `STORE.active_returns()` usa la base Bloomberg quando nessun
  upload è presente → **`run_allocation`, l'API e il backtest** girano sull'universo reale
  (priorità: upload utente → Bloomberg → backbone sintetico). L'`asset_class_map` risolve i
  ticker Bloomberg via il manifest (`acmap_for`), così i vincoli di profilo si applicano ai
  gruppi corretti.
- **Isolamento test**: la suite forza il backbone sintetico via `AA_DISABLE_MARKET_BASE`
  (`tests/conftest.py`), così locale = CI a prescindere dai file in `data/market/`.
- Sanity: `run_allocation('moderate','EUR')` sull'universo Bloomberg → 41 modelli, 28
  strumenti, Equity 38% / FI 31% / HY 23% / Commodities 7%, StdDev 5.7% MaxDD 6.8%. Backtest
  lite (7 fold, 0 esclusi): Sharpe ~0.87, Calmar ~0.40, MaxDD ~13.6%.
- Mappa gruppi: asset_class del manifest → etichetta motore (`Equity`, `Fixed Income`, `HY`,
  `Commodities`, `Alternatives`) → 5 gruppi di vincolo via `profiles.GROUP_OF_ASSET_CLASS`.

## Gap dati noti (dichiarati)

1. **Volatilità implicita Treasury**: mancante. MOVE non è un sottostante con term structure;
   gli swaption sono spezzati dalla transizione LIBOR→SOFR (2023). Due serie diverse non
   ricostruite. Disponibile solo il **MOVE spot** (in `vol_indices.csv`).
2. **X40 (CAC 40)**: presente nell'universo ma **non esportato** nel foglio prezzi → 35/36
   strumenti investibili caricati.
3. **Nessuno strumento cash puro**: i Treasury (CBU0/CBU7) mappano a `fixed_income`. Il gruppo
   `cash` non ha strumenti → il floor `cash` dei profili non viene applicato (il motore lo
   gestisce, `profiles.constraints_for`). Aggiungere un ETF monetario per coprirlo.
4. **17 serie "solo_segnale"** (indici equity/FX/commodity spot): elencate nell'universo ma non
   nei fogli prezzi/vol di questo export → da scaricare separatamente per il binario segnali.

## Prossimo passo

- Validazione **full-41** sull'universo Bloomberg (oggi verificata in lite).
- Aggiungere un ETF **monetario** per coprire il gruppo `cash`.
- Scaricare le **17 serie solo-segnale** e la **IV Treasury** (gap dichiarati) per il binario segnali.
