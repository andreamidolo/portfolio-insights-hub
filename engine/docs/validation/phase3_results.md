# Validazione Fase 3 — Optimization + Signals

Congelamento dei risultati di validazione della Fase 3 (riferimento per confronti
futuri: se una modifica al motore cambia questi numeri, lo si nota subito).

- **Ambiente**: Riskfolio-Lib **7.2.1** (pin `>=7.2,<7.3`, vedi `docs/KNOWN_ISSUES.md` KI-1).
- **Riproduzione**: `python -m aa_engine.optimization.demo`
- **Universo campione**: `aa_engine.optimization.sample` (multi-asset sintetico,
  code grasse + un episodio di drawdown nel tratto out-of-sample).
- **Ensemble**: 9 modelli curati + baseline 1/N → 4 migliori (scorer Calmar OOS) → media.

---

## 3 check di sanità — tutti PASS

| # | Check | Esito | PASS |
|---|-------|-------|------|
| 1 | Ensemble vs 1/N (out-of-sample) | Sharpe **1.09 vs 1.10** (pari); Calmar **1.07 vs 0.74** (ensemble vince) | ✅ |
| 2 | Profili ordinati per rischio (StdDev) | moderate **0.021** ≤ balanced **0.051** ≤ aggressive **0.114** | ✅ |
| 3 | Il regime cambia la selezione | BULL **7** strumenti / BEAR **4** (scartati EQ_DM, EQ_EM, COMMOD) | ✅ |

**Lettura check [1]**: su Sharpe puro 1/N è imbattibile (DeMiguel 2009); il valore
aggiunto della gestione del rischio emerge sul rendimento aggiustato per drawdown
(Calmar), perché l'ensemble protegge meglio nel crash. Senza un drawdown nel
periodo OOS il check non sarebbe significativo (1/N domina su dati in puro trend).

**Lettura check [2]**: i profili sono modellati come *range* di equity (cap +
floor), non solo come tetto: aggressive ha un floor di equity → rischio più alto.

---

## Modelli scelti dall'ensemble (Calmar OOS)

`MaxSharpe, NCO, MinCDaR, MinVolatility`

## Allocazione finale — profilo *balanced*

| Strumento | Peso |
|-----------|------|
| EQ_DM | 0.24 |
| EQ_EM | 0.06 |
| BOND  | 0.38 |
| GOLD  | 0.09 |
| CASH  | 0.22 |
| HY    | 0.02 |

**Pannello di rischio dell'allocazione finale**: StdDev **5.1%**, CVaR **11.2%**,
MaxDD **8.1%**.

> Nota: i valori dipendono dal seed del backbone campione; sono stabili a parità
> di ambiente (Riskfolio 7.2.1) e dati. Servono come riferimento qualitativo
> (ordini di grandezza e relazioni), non come target assoluti.
