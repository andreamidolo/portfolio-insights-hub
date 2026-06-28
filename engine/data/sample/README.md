# Dati di esempio

⚠️ **Nessun dato reale Bloomberg/Morningstar va versionato qui.** Solo dati
campione e valori di riferimento pubblici/derivati per i test.

## File

- `algoeagle_risk_targets.csv` — valori di rischio estratti dalla slide
  "Analysis of Coherence" dei report AlgoEagle. Servono come *ground truth*
  approssimativo per validare il risk engine. **Attenzione**: derivano da un
  portafoglio e una finestra che non conosciamo esattamente, quindi sono un
  riferimento di ordine di grandezza, non un match esatto.
- `sample_prices.csv` — (da aggiungere) prezzi campione per la demo. In assenza,
  `demo.py` genera dati sintetici.
- `sample_weights.csv` — (da aggiungere) pesi campione.

## Come popolare con dati veri (in locale, non committare)

```python
# Esempio Bloomberg via xbbg (richiede terminale attivo)
from xbbg import blp
px = blp.bdh(['SPY US Equity','IEF US Equity'], 'PX_LAST', '2018-01-01', '2024-12-31')
px.to_parquet('data/spy_ief.parquet')   # fuori da data/sample/, ignorato da git
```
