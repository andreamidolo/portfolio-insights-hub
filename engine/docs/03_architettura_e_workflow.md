# 03 — Architettura e modello di lavoro

Come è organizzato il lavoro e perché. Due dimensioni: l'**architettura del
software** e il **modello di collaborazione** (chi fa cosa, dove).

---

## A. Architettura del software

### Principio: disaccoppiamento via interfacce

Il motore non deve dipendere da implementazioni concrete. Due "giunti" critici:

1. **`PriceProvider`** — il motore non sa se i prezzi vengono da un file, da
   Bloomberg o da Morningstar. Cambiando provider, il resto non cambia. Questo
   è ciò che rende vera la frase "prima la macchina, poi la benzina".

2. **`RegimeProvider`** — IL giunto strategico. Il regime di mercato è il pezzo
   che oggi non sappiamo ancora calcolare dalle opzioni. Invece di bloccarci,
   definiamo l'interfaccia e la implementiamo con un **proxy** semplice
   (`ProxyRegimeProvider`, basato su trend/vol). Il binario opzioni produrrà poi
   un `OptionsRegimeProvider` con la **stessa identica interfaccia**: drop-in
   replacement, zero modifiche al resto.

```
                    ┌─────────────────────────┐
   Binario A        │        IL MOTORE         │
   (centrale)       │  signals → opt → risk    │
                    └───────────┬─────────────┘
                                │ dipende solo da interfacce
              ┌─────────────────┴──────────────────┐
              ▼                                     ▼
      RegimeProvider (ABC)                  PriceProvider (ABC)
        ▲          ▲                          ▲          ▲
   Proxy(oggi)  Options(domani)        StaticFile   Bloomberg/Morningstar
                   ▲
              Binario B (ricerca parallela, non bloccante)
```

### Mappa dei moduli

```
aa_engine/
  data/         interfacce dati + provider (PriceProvider, RegimeProvider)
  risk/         ⭐ Stadio 4 — risk engine (PRIMO MATTONE)
  optimization/ Stadio 2 — 40+ modelli
  backtest/     Stadio 3 — walk-forward, CV, simulazioni
  signals/      Stadio 1 — forecast, trend, selection (NON il regime)
  reporting/    output (report + excel)
  utils/        utilità trasversali
```

### Perché il risk engine è il primo mattone

- **Isolato**: input = (pesi, rendimenti); output = metriche. Poche dipendenze.
- **Coperto da librerie**: ~tutto in Riskfolio-Lib.
- **Verificabile**: abbiamo i numeri target dai report AlgoEagle.
- **Riusabile**: le metriche servono poi a backtest e ottimizzazione.

---

## B. Modello di collaborazione (tre piani)

### Piano 1 — Claude Code (Cowork): il braccio implementativo
Opera sul filesystem reale della repo. Scrive il codice dei moduli, i test, la CI,
esegue, fa commit su branch. È bravo a: scaffolding, implementazione guidata da
spec, refactoring, far passare i test, integrare librerie. **Gestisce sia il
motore Python sia il front-end React** (repo unica). Lovable è un aiuto opzionale
per la parte visuale.

**Gli si danno**: una spec chiara (i `docs/`), i `prompts/` pronti, i test che
definiscono il contratto. Lavora a "contratto chiuso".

### Piano 2 — Chat di progetto (Claude): il cervello analitico
Questa chat. Tiene la memoria del progetto (tutta l'analisi AlgoEagle). Fa il
ragionamento che il codice non fa:
- decisioni di architettura e priorità;
- scrittura/aggiornamento delle specifiche;
- **validazione finanziaria** dei risultati (i numeri hanno senso? le relazioni
  tra metriche sono corrette? l'allocazione è ragionevole?);
- redazione dei documenti e degli handoff.

È il **punto di continuità** tra sessioni di Claude Code diverse.

### Piano 3 — Binario Opzioni: ricerca parallela
Vive in `research/options-regime/` e in una chat dedicata. Notebook, paper,
esperimenti. Non produce production code finché il segnale non è robusto. Output
finale: `OptionsRegimeProvider`.

### Regola operativa

> Le **decisioni e le specifiche** nascono nel Piano 2 → l'**implementazione** la
> esegue il Piano 1 → i **risultati** tornano al Piano 2 per validazione → ciò che
> riguarda le opzioni va nel Piano 3.

### Ciclo tipico di un task

1. (Chat) Si scrive/aggiorna la spec del modulo in `docs/`.
2. (Chat) Si prepara/aggiorna un prompt in `prompts/`.
3. (Claude Code) Implementa, fa girare i test, apre un branch/PR.
4. (Chat) Valida i risultati finanziariamente; se serve, aggiusta la spec.
5. Merge. Avanti al task successivo della roadmap.

---

## C. Repo unica

Tutto vive in **un'unica repo**: `portfolio-insights-hub`. Front-end React/Vite
alla radice (scaffold Lovable), motore Python in `engine/`. **Claude Code
sviluppa entrambi** e può ristrutturare la repo in autonomia; Lovable è un aiuto
opzionale per la parte visuale. Vedi `docs/06_repo_structure.md`.

Convenzioni:

- **Sottocartella `engine/`** per il Python, così `pip` e `npm` non si calpestano
  (è una cartella, non un secondo repo).
- **Branch**: `feat/risk-engine`, `feat/var-backtest`, `feat/ui-risk-panel`,
  `research/options-...`.
- **Commit**: brevi e coerenti.
- **`docs/` è la fonte di verità** per le specifiche (incluso il contratto API).
  Il codice le segue.
- **Niente dati reali** nel repo (vedi `.gitignore` e `data/sample/README.md`).
- Front-end e motore si parlano **via API in locale** (vedi
  `docs/05_api_contract.md`), non per import diretto.
