# Prompt 00 — Onboarding di Claude Code sulla repo

Copia-incolla questo come primo messaggio a Claude Code (Cowork) quando apri la
repo `portfolio-insights-hub`.

---

```
Stai lavorando sulla repo portfolio-insights-hub. È una repo UNICA che conterrà
sia il MOTORE Python sia il FRONT-END React/Vite di un tool interno di asset
allocation quantitativa per una società di gestione patrimoniale .

STATO DELLA REPO:
- È praticamente vergine: Lovable ha generato uno scaffold front-end React/Vite
  alla radice (src/, package.json, vite.config, ecc.).
- Tu la prendi in mano DA ZERO sulla base di questo handoff package e puoi
  RISTRUTTURARLA IN TOTALE AUTONOMIA (creare, spostare, modificare tutto).
- Lovable resterà un aiuto OPZIONALE per la parte visuale, da usare solo
  dove/quando comodo. Non è un binario separato.

STRUTTURA CONSIGLIATA (decidi tu i dettagli, ma tieni separati i due gestori di
dipendenze così npm e pip non si calpestano):
    portfolio-insights-hub/
    ├── src/ … package.json …   ← front-end React/Vite (scaffold Lovable)
    ├── engine/                 ← il MOTORE Python (il contenuto di questo handoff)
    │   ├── src/aa_engine/  docs/  prompts/  tests/  pyproject.toml
    └── README.md
Sposta il contenuto dell'handoff package dentro engine/ (o struttura equivalente).

PRIMA DI SCRIVERE CODICE, leggi in quest'ordine (nei file dell'handoff):
1. README.md
2. docs/00_analisi_sistema.md  (e il .docx collegato, se puoi aprirlo)
3. docs/03_architettura_e_workflow.md
4. docs/01_roadmap.md
5. docs/02_risk_engine_spec.md
6. docs/05_api_contract.md  (come front-end e motore si parlano, in locale)

CONTESTO IN BREVE:
- Ricostruiamo un processo d'investimento quantitativo a 4 stadi
  (signals → optimization → backtest → risk) ispirato a un sistema analizzato in
  fase 0.
- Filosofia: "prima la macchina, poi la benzina". Si costruisce il motore su dati
  statici; i dati live (Bloomberg/Morningstar) arrivano alla fine.
- Il regime di mercato dalle opzioni è un binario di ricerca SEPARATO
  (engine/research/options-regime/). NON lavorarci ora. Il motore usa un proxy
  (ProxyRegimeProvider) tramite l'interfaccia RegimeProvider.

IL TUO PRIMO COMPITO: il RISK ENGINE (engine/src/aa_engine/risk), seguendo
docs/02_risk_engine_spec.md. È il "primo mattone": isolato, coperto da
Riskfolio-Lib, e verificabile contro numeri target reali. Il front-end può
intanto restare con i mock (vedi docs/05_api_contract.md).

REGOLE:
- Usa Riskfolio-Lib per le metriche standard; implementa a mano solo il mancante.
- Rispetta il vincolo "regime-dependent": ogni metrica accetta regime_mask.
- Ogni funzione: docstring con definizione/formula (no black box).
- I test in tests/test_risk_engine.py definiscono il contratto: falli passare,
  rimuovendo gli xfail man mano.
- Lavora su un branch feat/risk-engine.

Quando hai letto i documenti, conferma di aver capito l'architettura, proponi
come sistemerai la struttura della repo (front-end alla radice + engine/), e un
piano per implementare aa_engine/risk/measures.py. Poi procedi.
```

---

**Nota per te (Andrea):** dopo che Claude Code ha implementato, riporta in chat
di progetto l'output di `python -m aa_engine.risk.demo` e i risultati dei test,
così facciamo insieme la **validazione finanziaria** dei numeri.
