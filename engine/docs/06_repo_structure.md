# 06 — Struttura della repo unica

Tutto il progetto vive in **una sola repo**: `portfolio-insights-hub`. Questo
documento spiega come ci stanno dentro il front-end e il motore, e come Claude
Code dovrebbe sistemarla partendo dallo scaffold Lovable + questo handoff package.

---

## Punto di partenza

- La repo nasce da **Lovable**: alla radice c'è uno scaffold **React/Vite**
  (`src/`, `package.json`, `vite.config.ts`, `index.html`, ecc.).
- Questo **handoff package** contiene il **motore Python** (`aa_engine`) + docs +
  prompt + test.
- La repo è **vergine**: Claude Code può creare, spostare e modificare tutto in
  **totale autonomia**.

---

## Struttura consigliata

```
portfolio-insights-hub/
├── src/                      ← FRONT-END React/Vite (scaffold Lovable)
│   ├── components/
│   ├── services/             ← data service tipizzato (mock → API)
│   └── ...
├── package.json              ← dipendenze front-end (npm)
├── vite.config.ts
├── index.html
│
├── engine/                   ← IL MOTORE Python (contenuto di questo handoff)
│   ├── src/aa_engine/
│   │   ├── data/  risk/  optimization/  backtest/  signals/  reporting/  utils/
│   │   └── api/              ← (fase 4) FastAPI che espone il contratto
│   ├── docs/                 ← specifiche, roadmap, contratto API
│   ├── prompts/
│   ├── tests/
│   ├── data/sample/
│   ├── research/options-regime/
│   └── pyproject.toml        ← dipendenze motore (pip)
│
└── README.md                 ← spiega le due metà e come avviarle
```

> **Perché la sottocartella `engine/`**: non è "un secondo repo". È solo il modo
> per tenere separati i due gestori di dipendenze — `npm` (front-end) e `pip`
> (Python) — dentro la **stessa** repo, così non si calpestano (lockfile, build,
> cartelle `node_modules` vs `.venv`). Claude Code può scegliere un nome diverso
> (`backend/`, `aa_engine/`...) ma il principio resta.

---

## Come Claude Code dovrebbe procedere

1. Lasciare lo scaffold front-end Lovable dov'è (radice).
2. Spostare il contenuto di questo handoff package dentro `engine/`.
3. Creare un `README.md` di radice che spieghi le due metà e i comandi di avvio.
4. Allineare i `.gitignore` (uno per il front-end con `node_modules/`, quello del
   motore già ignora `.venv/`, dati, ecc.).
5. Partire dal **risk engine** (`engine/.../risk`), tenendo il front-end con i
   **mock** finché l'API non è pronta.

---

## Avvio in locale (dev)

```bash
# Front-end (dalla radice)
npm install
npm run dev          # es. http://localhost:5173

# Motore (da engine/)
cd engine
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest -q
# (fase 4) API:
# uvicorn aa_engine.api.main:app --reload   # es. http://localhost:8000
```

Il front-end punta ai mock all'inizio; quando l'API è viva, il suo data service
chiama `http://localhost:8000/api/v1` (vedi `docs/05_api_contract.md`).

---

## Il ruolo di Lovable d'ora in avanti

- **Opzionale.** È servito a far nascere la UI e dare un'anteprima visiva.
- Si può riusare **dove/quando comodo** per generare o ritoccare velocemente
  schermate, ma **lo sviluppo principale lo porta avanti Claude Code** sulla
  stessa repo. Non c'è un binario Lovable separato da sincronizzare.
