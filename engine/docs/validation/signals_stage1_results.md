# Validazione Stadio 1 — Signals

Congelamento dei risultati della Fase Signals (spec `docs/09_signals_spec.md`).
Riferimento per confronti futuri.

- **Ambiente**: scikit-learn 1.9, Riskfolio-Lib 7.2.1.
- **Riproduzione**: `python -m aa_engine.signals.demo` (la validazione SVM
  walk-forward richiede ~30–60s — è il prezzo dell'onestà anti-overfitting).
- **Dati**: backbone campione (`aa_engine.optimization.sample`).
- **Architettura a strati**: Trend/Oscillator → SUMMARY (+ ponte BL views) → SVM
  (acceso solo se batte il baseline) → Alpha Crash (base).

---

## 4 check di sanità

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | SVM batte il baseline ingenuo (OOS)? | SVM **0.597** vs always-up **0.662** vs momentum **0.455** (n=77) → **NO** | ⚠️ atteso |
| 2 | Il SUMMARY (segnali→views BL) migliora l'allocazione vs motore senza segnali? | Sharpe **0.43 vs 0.20**, Calmar **0.25 vs 0.08** → **SÌ** | ✅ |
| 3 | Le probabilità SVM sono calibrate? | gap \|confidenza−accuratezza\| = **0.30** → sovra-confidente | ⚠️ |
| 4 | Il regime modula il SUMMARY (BULL≠BEAR)? | SÌ | ✅ |

### I due check che contano (nota del coordinator)

1. **L'SVM batte il baseline?** **NO** — è perfino sotto il base-rate "always up".
   Dichiarato e **NON inserito nel SUMMARY** (resta disponibile ma disattivato).
   È l'esito atteso: predire i rendimenti è notoriamente difficile (come la VIX
   per le opzioni). L'onestà vale più del risultato.
2. **Il SUMMARY migliora l'allocazione vs il motore senza segnali?** **SÌ**, e in
   modo netto (Sharpe 0.43 vs 0.20, Calmar 0.25 vs 0.08 OOS). Cioè: lo **Stadio 1
   nel suo complesso porta valore** grazie ai **segnali tecnici** (trend +
   oscillatore + alpha-crash) combinati nel SUMMARY e tradotti in views BL —
   indipendentemente dall'SVM.

---

## Esempio di tabella segnali (stile AlgoEagle)

| ticker | Trend | Oscillator | A.I. | AlphaCrash | SUMMARY |
|--------|-------|------------|------|------------|---------|
| EQ_DM  | ▲ 0.69 | • 0.00 | ▼ 0.33 | ▼ 0.99 | • 0.00 |
| EQ_EM  | ▼ 0.76 | • 0.00 | ▲ 1.00 | ▼ 0.82 | ▼ 0.52 |
| BOND   | ▲ 0.55 | • 0.00 | ▲ 1.00 | ▲ 1.00 | ▲ 0.48 |
| GOLD   | ▼ 0.79 | • 0.00 | ▼ 0.33 | ▼ 0.73 | ▼ 0.51 |

(▲ long, ▼ short, • neutro; numero = probabilità/forza. La colonna A.I. mostra
l'output standalone dell'SVM ma **non entra** nel SUMMARY perché non valida.)

---

## Decisione (per la chat di progetto)

Lo Stadio 1 è **pronto come impalcatura e porta valore** (tecnici + SUMMARY + ponte
BL). L'**SVM resta disattivato** finché non batte il baseline su dati/feature
migliori — possibili evoluzioni: feature più ricche (fractional differentiation,
cross-sezionali), target diverso (oltre il segno), o per-strumento invece che pool.
Da decidere in chat se vale la pena, o se i segnali tecnici bastano per ora.
