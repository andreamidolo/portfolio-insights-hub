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
- **Backtest / validazione**: `aa_engine.backtest.per_model` usa questa base come dati reali
  preferiti (fallback: prezzi Yahoo di ricerca, poi backbone sintetico). Sanity run lite
  (6 modelli, 7 fold, 0 esclusi): ensemble Sharpe ~0.87, Calmar ~0.40, MaxDD ~13.6%.
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

## Prossimo passo (non in questa PR)

Rendere la base Bloomberg il **default anche di `run_allocation`/API** (oggi lo è per il
backtest): richiede di propagare l'`asset_class_map` di `market_data` nella pipeline
(`pipeline/run.py`) e aggiornare i test che assumono il backbone sintetico.
