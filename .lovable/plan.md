# Piano: timeout estesi + retry automatico per endpoint pesanti

## Obiettivo
Eliminare i falsi "OFFLINE" sulle sezioni pesanti (Esegui, Ottimizzazione, Rischio). Il motore è online ma su Render Free i primi hit possono richiedere 30–90s (cold start + 0.1 CPU, 41 modelli). Oggi il fetch del browser scade prima e la UI mostra "Engine endpoint unavailable" anche se l'API risponderebbe poco dopo.

## Modifiche (solo `src/lib/api.ts`)

1. **Aggiungo un timeout esplicito al fetch** via `AbortController`:
   - 15s per endpoint leggeri (`/health`, `/regimes`, `/profiles`, `/signals`, `/portfolio`)
   - 90s per endpoint pesanti (`/risk/panel`, `/risk/contributions`, `/allocation/run`, `/optimization/models`, `/portfolio/analyze`, `/portfolio/reoptimize`)

2. **Retry automatico con backoff** sui soli endpoint pesanti:
   - max 2 tentativi
   - secondo tentativo dopo 2s, solo se il primo fallisce per timeout / network / 502/503/504 (tipico cold start Render)
   - nessun retry su 4xx (errori "veri" dell'utente)

3. **Messaggio d'errore più chiaro** quando scatta il timeout:  
   `"Il motore è in avvio (cold start ~30–90s su piano Free). Riprova tra qualche secondo."`  
   invece dell'attuale "Cannot reach the engine API…", così l'utente capisce che non è offline.

4. **Niente altre modifiche**: zero tocchi a componenti dashboard, design, `.env`, o backend. Le sezioni continuano a usare lo stesso `api.*` di prima — firma identica, solo l'interno cambia.

## Cosa NON faccio
- Nessun warm-up automatico (lo avevi escluso scegliendo l'opzione 1).
- Nessun mock o dato finto.
- Nessuna modifica al backend FastAPI o a Render.

## Verifica dopo l'applicazione
- `curl` ai due endpoint per misurare il tempo reale.
- Apertura preview, controllo che dopo ~60–90s i badge passino da loading a LIVE su Rischio/Ottimizzazione/Esegui.
- Se ancora fallisce dopo 90s + retry → è davvero un limite Render, e l'unica strada è upgrade a Starter (te lo segnalerò).

## File toccato
- `src/lib/api.ts` (unico)
