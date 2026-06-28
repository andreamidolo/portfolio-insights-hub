# AssetAllocation_AA

Motore interno di asset allocation quantitativa per **LFG**.

Ricostruzione modulare di un processo d'investimento quantitativo multi-asset, ispirato all'architettura a quattro stadi analizzata nella fase 0 del progetto (vedi `docs/00_analisi_sistema.md`). L'obiettivo è un tool **interno**, alimentato in produzione da Bloomberg / Morningstar Direct, ma sviluppato per fasi: prima il motore, poi i dati live.

---

## Filosofia del progetto

> **Costruiamo prima la macchina, la benzina la mettiamo dopo.**

1. **Il motore (70-80%)** — ricostruibile con librerie open-source mature e buona ingegnerizzazione. È il lavoro centrale di questo repo.
2. **La componente opzioni (20-30%)** — il regime di mercato letto dalle opzioni. È il know-how più complesso, sviluppato come **binario di ricerca parallelo** (`research/options-regime/`) dal giorno uno, ma *non* blocca il motore.

I due binari convergono: il motore espone un'interfaccia `RegimeProvider` che oggi è alimentata da un proxy semplice (es. medie mobili / volatilità realizzata) e domani dal modello opzioni, senza riscrivere il resto.

---

## I quattro stadi (mappa del motore)

| Stadio | Modulo | Stato | Difficoltà |
|--------|--------|-------|-----------|
| 1 — Signals & Selection | `aa_engine.signals` | 🔜 fase 3 | Media |
| 2 — Portfolio Optimization | `aa_engine.optimization` | 🔜 fase 3 | Media |
| 3 — Backtesting | `aa_engine.backtest` | 🔜 fase 2.5 | Media |
| **4 — Risk Management** | **`aa_engine.risk`** | **🚧 in sviluppo (primo mattone)** | Bassa-Media |
| Data backbone | `aa_engine.data` | 🚧 in sviluppo | Bassa |
| Reporting | `aa_engine.reporting` | 🔜 fase 4 | Bassa |

**Primo mattone: il Risk Engine** (Stadio 4). È il più isolato, è quasi interamente coperto da Riskfolio-Lib, e produce numeri verificabili contro i report AlgoEagle. Vedi `docs/02_risk_engine_spec.md`.

---

## Struttura del repository

```
AssetAllocation_AA/
├── docs/                      # Specifiche, roadmap, analisi (LEGGERE PRIMA)
├── src/aa_engine/             # Il package Python
│   ├── data/                  # Caricamento dati + provider astratti
│   ├── risk/                  # ⭐ Risk engine (primo mattone)
│   ├── optimization/          # Ottimizzazione di portafoglio (40+ modelli)
│   ├── backtest/              # Walk-forward, CV, simulazioni
│   ├── signals/              # Segnali e security selection
│   ├── reporting/             # Generazione report
│   └── utils/                 # Utilità trasversali
├── research/options-regime/   # 🔬 Binario parallelo: regime da opzioni
├── tests/                     # Test (pytest)
├── notebooks/                 # Esperimenti e validazione
├── data/sample/               # Dati di esempio per i test
└── prompts/                   # Prompt pronti per Claude Code
```

---

## Quickstart

```bash
# 1. Ambiente
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

# 2. Test
pytest -q

# 3. Esempio: calcolo metriche di rischio su un portafoglio
python -m aa_engine.risk.demo
```

---

## Come si lavora su questo repo (3 piani)

- **Claude Code (Cowork)** → implementazione: scrive il codice dei moduli, test, CI.
- **Chat di progetto (Claude)** → architettura, specifiche, validazione *finanziaria* dei risultati, documenti. È il punto di continuità tra le sessioni.
- **Binario Opzioni** → ricerca in `research/options-regime/`, separata e non bloccante.

Regola pratica: *le decisioni e le specifiche nascono nella chat di progetto, l'implementazione la esegue Claude Code, i risultati tornano alla chat per validazione.*

Vedi `docs/01_roadmap.md` per le fasi e `prompts/` per i prompt operativi.

---

## Una repo unica: motore + front-end

Tutto vive in **un'unica repo**: [`portfolio-insights-hub`](https://github.com/andreamidolo/portfolio-insights-hub).
Creata da Lovable (base React/Vite), ora presa in mano da **Claude Code** che la
sviluppa **da zero** sulla base di questo handoff package. Lovable resta un aiuto
**opzionale**, da usare dove/quando è comodo per la parte visuale — non è un
secondo binario.

Dentro la stessa repo convivono due mondi (linguaggi diversi):

```
portfolio-insights-hub/
├── src/ … package.json …   ← FRONT-END React/Vite (scaffold Lovable)
├── engine/                 ← IL MOTORE Python (questo handoff package va qui)
│   ├── src/aa_engine/
│   ├── docs/  prompts/  tests/  …
│   └── pyproject.toml
└── README.md
```

> La sottocartella `engine/` non è "un secondo repo": è solo il modo per tenere
> `pip` (Python) e `npm` (front-end) separati **dentro la stessa repo**, così non
> si calpestano. Claude Code decide la collocazione esatta sul campo; questa è la
> raccomandazione.

Il front-end non importa il codice Python: lo **chiama** via API in locale. Il
contratto è in `docs/05_api_contract.md`. Per onboardare Claude Code sul
front-end vedi `prompts/02_lovable_frontend.md`.

La repo è **vergine**: Claude Code può creare, ristrutturare e modificare tutto
in **totale autonomia**.

---

## Stack tecnico

- **Python** 3.11+
- **Risk & optimization**: [Riskfolio-Lib](https://github.com/dcajasn/Riskfolio-Lib)
- **Financial ML**: ispirazione da *Advances in Financial Machine Learning* (López de Prado) / [mlfinlab]
- **Dati (produzione)**: Bloomberg (`blpapi` / `xbbg`), Morningstar Direct
- **Dati (prototipo)**: file statici (parquet/csv), `yfinance` per test rapidi

---

## Stato

**Fase 2 — costruzione del motore.** Primo mattone: Risk Engine. Vedi `docs/01_roadmap.md`.

_Uso interno — Confidenziale._
