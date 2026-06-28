# Known Issues — debito tecnico

Registro dei debiti tecnici noti del motore. Ogni voce ha un contesto, l'impatto
attuale e l'**azione futura** per chiuderla. Aggiungere qui i debiti simili man
mano che emergono, così non si perde memoria.

---

## KI-1 — Riskfolio-Lib pinnato `>=7.2,<7.3` (bug HERC in 7.3.0)

- **Contesto**: la 7.3.0 ha un bug nella *hierarchical recursive bisection* di
  `HCPortfolio`: `optimization(model="HERC", ...)` passa internamente l'argomento
  `linkage` a `_hierarchical_recursive_bisection()`, che non lo accetta →
  `TypeError`. HRP e NCO non sono colpiti; il problema è specifico di HERC.
- **Impatto attuale**: nessuno. Il pin `>=7.2,<7.3` (risolto a **7.2.1**, dove
  HERC funziona) tiene i 9 modelli + baseline tutti validi. Vedi
  `docs/validation/phase3_results.md`.
- **Dove**: `engine/pyproject.toml` (dipendenza `Riskfolio-Lib`).
- **AZIONE FUTURA**: quando esce una `7.3.x` che corregge il bug:
  1. sbloccare il pin in `pyproject.toml` (es. `>=7.2`);
  2. ri-testare HERC (`HCPortfolio`): i pesi devono restare validi (somma 1,
     long-only, vincoli rispettati);
  3. verificare che il **check di sanità [1]** (ensemble vs 1/N) non peggiori
     (`python -m aa_engine.optimization.demo`);
  4. **prima di sbloccare**, aggiungere un test di regressione su HERC che fissi
     il comportamento atteso (pesi validi su un universo di prova), così un
     futuro bug nella stessa area viene intercettato dalla CI.
- **Stato**: aperto.
