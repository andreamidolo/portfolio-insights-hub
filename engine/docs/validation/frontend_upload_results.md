# Validazione — Upload dati + analisi mandati reali (iterazione 2)

Da "dimostratore su dati di prova" a "banco di analisi sui dati veri".
Spec `docs/13_frontend_upload_spec.md`, prompt `docs/11_frontend_upload.md`.

- **Due caricamenti distinti**: prezzi storici (il "carburante") e mandato
  (composizione = l'oggetto da analizzare). Per analizzare un mandato servono
  ANCHE i prezzi dei suoi strumenti — il sistema lo dichiara.
- **Store in memoria** (singolo processo, si azzera al riavvio): sufficiente per
  uno strumento interno; domani un vero `PriceProvider` lo sostituisce.

---

## Endpoint aggiunti (5)

| Funzione | Endpoint | Note |
|----------|----------|------|
| Upload prezzi | `POST /api/v1/data/upload` | CSV via JSON (no multipart); validazione tollerante → `warnings` |
| Vista universo | `GET /api/v1/data/universe` | utente vs campione, con `source` |
| Upload mandato | `POST /api/v1/portfolio/upload` | pesi in % → frazione; segnala prezzi mancanti |
| Radiografia rischio | `POST /api/v1/portfolio/analyze` | 21 metriche + contribuzioni + regimi + segnali sul mandato |
| Ri-ottimizzazione | `POST /api/v1/portfolio/reoptimize` | ATTUALE vs PROPOSTA + delta di rischio |

> Gli endpoint espongono capacità che il motore GIÀ ha (risk engine + ensemble)
> su pesi forniti dall'utente: la novità vera è la gestione file + validazione.
> Niente logica del motore duplicata nel front-end.

---

## 4 check di sanità (spec §4)

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Carico un CSV di prezzi e il sistema lo valida? | sì — N strumenti, M osservazioni, range date, warning su serie corte/buchi | ✅ |
| 2 | Carico un mandato e ottengo la radiografia del rischio reale? | sì — `/portfolio/analyze`, 21 metriche + contribuzioni + segnali sul mandato | ✅ |
| 3 | La ri-ottimizzazione mostra ATTUALE vs PROPOSTA con scostamenti e delta rischio? | sì — pesi affiancati + Δ per strumento + Δ StdDev/CVaR/MaxDD/Sharpe | ✅ |
| 4 | I casi limite danno messaggi chiari? | sì — prezzi mancanti dichiarati, pesi ≠100% segnalati, CSV malformato → HTTP 400 leggibile | ✅ |

### Casi limite gestiti (onesti, senza crash)

- **Strumento senza prezzi storici** → escluso dall'analisi e dichiarato
  (`missing_prices`); la `covered_weight` riporta la frazione effettivamente
  analizzata. Mai prezzi inventati.
- **Pesi che non sommano a 100%** → warning esplicito; i pesi in % (somma ~100)
  vengono riportati a frazione con nota.
- **CSV malformato / vuoto** → `UploadError` → HTTP 400 con messaggio leggibile.
- **Mandato di sole asset class "Unknown"** → ha fatto emergere e correggere un
  bug latente in `enforce_caps` (floor di classe senza strumenti → divisione per
  zero): ora i floor di classi assenti dall'universo vengono ignorati.

---

## Note tecniche

- `pipeline/run.py` rifattorizzato: estratti `compute_signal_outputs` e
  `build_signals_table`, riusati sia dal flusso campione sia dall'analisi del
  mandato (stessa logica dei segnali su qualsiasi universo).
- Front-end: sezione **Dati/Import** funzionante (drag&drop + file picker, JSON
  upload), tabelle universo/mandato, le 3 analisi (rischio, segnali, ATTUALE vs
  PROPOSTA). Lo stato "dati utente vs backbone campione" è mostrato nella TopBar
  e persiste in tutta la dashboard.
- Test: `tests/test_upload.py` (11 test) — parsing, validazione, analyze,
  reoptimize, endpoint via TestClient. Suite motore: **156 test verdi**.

---

## Cosa NON è in questa iterazione (spec §5)

- Niente calcolo nel front-end: l'analisi la fa il motore via API.
- Niente prezzi inventati: titoli senza storico → dichiarati.
- Niente "qualità AlgoEagle": finché il regime è il proxy, i segnali restano in
  versione semplificata (dichiarato nell'interfaccia).
- Niente Bloomberg live: i prezzi arrivano via upload CSV (la strada per i dati
  veri).
