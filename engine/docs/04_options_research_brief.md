# 04 — Brief di ricerca: Regime da Opzioni (Binario B)

Il binario parallelo, non bloccante. Obiettivo: ricostruire (o sviluppare una
versione propria del) **regime di mercato Bull/Bear letto dalle opzioni** — il
~25-30% che AlgoEagle considera il proprio core. Senza coinvolgere AlgoEagle.

> Questo binario procede dal giorno uno, **in parallelo** al motore, e non ne
> blocca lo sviluppo. Il motore intanto gira col `ProxyRegimeProvider`.

---

## 1. Cosa fa AlgoEagle (da ciò che sappiamo)

Dai loro materiali (cfr. `00_analisi_sistema.md` §3-4):

- Il regime change si basa su un *modello proprietario che sfrutta il contenuto
  informativo delle opzioni* per identificare il regime prevalente per asset class.
- La **volatilità implicita è forward-looking** e altamente predittiva di quella
  futura.
- Il segnale nasce **scomponendo la volatilità nelle sue componenti di lungo e
  di breve termine** ("disentangling the volatility into its long and short
  parts").
- Affiancano gli indici di volatilità ufficiali: **VIX** (equity), **MOVE**
  (Treasury). Nei report compare anche una colonna "Fear".
- Output: per ogni asset class, regime ∈ {+1 Bull, −1 Bear}, aggiornato.
- Track record del segnale: hit ratio mensile ~0.77 (slide 14).

Quello che **non** sappiamo: la matematica esatta della scomposizione e la regola
di mappatura su {Bull, Bear}. È lì che serve ricerca.

---

## 2. Direzioni di ricerca (ipotesi da testare)

Da esplorare in notebook, in ordine indicativo:

1. **Term structure della volatilità implicita.** Differenza/rapporto tra IV a
   breve e a lunga scadenza (es. 1M vs 3M/6M). Backwardation vs contango come
   proxy di stress/regime.
2. **Scomposizione "short/long" della vol.** Filtri (es. media mobile, Kalman,
   wavelet, o componenti à la HAR) per separare la componente persistente da
   quella transitoria della IV; segnale dal loro rapporto/spread.
3. **Indici di vol come input grezzi.** VIX, VVIX, MOVE, e loro dinamiche
   (livello vs variazione, soglie). La colonna "Fear" suggerisce una logica a
   soglia sul livello di vol combinata col regime.
4. **Skew / risk reversal.** Inclinazione della superficie (put vs call IV) come
   misura di domanda di protezione → indicatore di regime.
5. **Variance risk premium.** IV − RV realizzata: premio per il rischio di
   varianza come segnale.

Per ognuna: definire il segnale, calcolarlo, **backtestarlo isolato** (hit ratio
per asset class, come la slide 14), confrontare con il proxy.

---

## 3. Dati necessari

In produzione: **Bloomberg** ha tutto (superfici di IV, VIX/MOVE/VVIX, opzioni su
indici e futures). Per il prototipo di ricerca bastano dati limitati:

- Storico VIX, MOVE, VVIX (anche da fonti pubbliche per i primi test).
- Qualche superficie di IV o almeno IV ATM a 1M/3M/6M su S&P, Treasury.
- RV realizzata (calcolabile dai prezzi).

⚠️ Niente dati reali nel repo: tenerli fuori da `data/sample/` (vedi `.gitignore`).

---

## 4. Output e integrazione

L'obiettivo finale del binario B è un'unica classe:

```python
# da implementare in aa_engine/data quando il segnale è robusto
class OptionsRegimeProvider(RegimeProvider):
    def get_regime(self, asset_class, as_of=None) -> Regime: ...
    def get_regime_series(self, asset_class, start, end=None) -> pd.Series: ...
```

Finché non è pronta, il motore usa `ProxyRegimeProvider`. Lo switch sarà una sola
riga di configurazione. **Questo è il punto**: i due binari non si bloccano mai.

---

## 5. Come lavorarci

- Cartella: `research/options-regime/` (notebook + appunti + mini-dataset locali).
- Chat dedicata separata da quella del motore (per non mischiare i contesti).
- Criterio di "promozione" a production: il segnale batte stabilmente il proxy su
  più asset class e più finestre, con hit ratio confrontabile ai loro ~0.77.

Vedi `research/options-regime/README.md` per il punto di partenza.
