# Risultati — ricerca regime da volatilità (dati gratuiti)

Esito sintetico della prima iterazione del **binario opzioni** (spec
`docs/08_options_research_spec.md`). Natura: ricerca, "fail fast". Il
`ProxyRegimeProvider` del motore è il giudice.

> **Conclusione in una riga:** con i soli dati gratuiti (VIX/MOVE), i segnali-vol
> semplici **non battono il proxy** — né sull'hit ratio (livello A) né sulla
> protezione nei drawdown (livello C). **Niente promozione**: non si scrive
> `OptionsRegimeProvider`.

- **Dati**: VIX (CBOE, 1990–2026), MOVE (Yahoo, 2002–2026), benchmark SPY/TLT/GLD/DBC.
  Gratuiti, in `data_local/` (non versionati). Riproduci con `python fetch_data.py`.
- **Periodo di test**: 2002–2026 (include 2008, 2020, 2022).
- **Asset class con indice di vol naturale**: Equity↔VIX, Fixed Income↔MOVE.

---

## Livello A — hit ratio (direzione del mese successivo), mensile

Quota di mesi in cui il regime predice il segno del rendimento a 21 giorni.

### Equity (VIX)
| segnale | hit ratio | proxy | base-rate "su" |
|---|---|---|---|
| threshold q80 | **0.562** | 0.615 | 0.618 |
| vol momentum q80 | **0.546** | 0.615 | 0.618 |
| term structure 21/126 | **0.543** | 0.615 | 0.618 |

Tutti i segnali VIX sono **sotto il proxy** e perfino sotto il base-rate (0.618 =
quota di mesi positivi). Il proxy (200d MA) ≈ base-rate: il trend-following è già
un buon predittore; la VIX no, perché è **coincidente** col crash, non anticipatrice.

### Fixed Income (MOVE)
| segnale | hit ratio | proxy | base-rate |
|---|---|---|---|
| threshold q80 | 0.522 | 0.510 | 0.511 |
| vol momentum q80 | 0.513 | 0.510 | 0.509 |
| term structure 21/126 | 0.513 | 0.510 | 0.505 |

Tutto ≈ coin flip (~0.51). MOVE marginalmente sopra il proxy ma dentro il rumore.

---

## Livello C — protezione nei drawdown (il test che conta)

Overlay di market timing (investito in BULL, cash in BEAR; decisione su info del
giorno prima → niente lookahead). Metrica chiave: **Calmar** (CAGR/MaxDD) e **MaxDD**.

### Equity (VIX-timed, 2000–2026)
| strategia | CAGR | Sharpe | MaxDD | Calmar |
|---|---|---|---|---|
| buy & hold | 0.063 | 0.412 | 0.565 | 0.111 |
| **proxy (200d)** | 0.054 | 0.544 | **0.210** | **0.258** |
| VIX thr q80 | 0.019 | 0.215 | 0.614 | 0.032 |
| VIX mom q80 | 0.052 | 0.426 | 0.457 | 0.114 |
| VIX ts 21/126 | 0.024 | 0.264 | 0.550 | 0.044 |

Il **proxy domina**: Calmar 0.26 e MaxDD 21%, contro Calmar ≤0.11 e MaxDD ≥46%
dei segnali VIX. La soglia VIX fa **peggio del buy & hold** (entra in BEAR a crash
già iniziato e resta fuori durante il rimbalzo, quando la VIX è ancora alta).

### Fixed Income (MOVE-timed, 2002–2026)
| strategia | CAGR | Sharpe | MaxDD | Calmar |
|---|---|---|---|---|
| buy & hold | 0.003 | 0.092 | 0.518 | 0.006 |
| proxy (200d) | −0.006 | −0.004 | 0.393 | −0.015 |
| MOVE mom q80 | 0.018 | 0.210 | 0.495 | 0.037 |
| MOVE thr q80 | −0.002 | 0.041 | 0.419 | −0.004 |
| MOVE ts 21/126 | −0.017 | −0.131 | 0.462 | −0.038 |

Tutto debole: TLT 2002–2026 rende poco (crash obbligazionario 2022) e nessun
segnale aggiunge protezione significativa.

---

## Decisione e prossimi passi (per la chat di progetto)

Per i paletti della spec ("o vince sui numeri o non esiste"), **nessun segnale
passa A+B+C → nessuna promozione a production**. Il proxy resta il giudice e, per
ora, il miglior provider di regime.

Tre esiti erano tutti accettabili; siamo nel terzo: *con i dati gratuiti non si
arriva*. Il bivio:

1. **Tenere il proxy** e spostare l'energia sui **segnali ML del motore** (trend
   scanner, oscillatori, ensemble SVM) — il proxy 200d è già competitivo.
2. **Salire a Bloomberg**: term structure dei futures VIX, skew / risk-reversal,
   scomposizione IV long/short "vera". È l'unico modo per replicare davvero
   l'approccio AlgoEagle, ma è il pezzo **costoso** — da fare solo se la chat
   decide che la pista vale l'investimento. I dati gratuiti (livello, indici
   spot) non contengono l'informazione di term structure/skew che servirebbe.

> Nota metodologica: l'hit ratio gratuito potrebbe **sottostimare** un segnale di
> sola protezione, ma il livello C (Calmar/MaxDD) — costruito apposta per
> catturare la protezione — conferma il verdetto. Il proxy vince su entrambi.
