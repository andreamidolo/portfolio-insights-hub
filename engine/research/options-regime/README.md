# research/options-regime — Binario B (Regime da Opzioni)

Workspace di ricerca per il regime di mercato letto dalle opzioni. **Parallelo e
non bloccante** rispetto al motore.

👉 Leggere prima: `docs/04_options_research_brief.md`.

## Regole

- Qui dentro stanno **notebook, appunti, esperimenti** — non production code.
- Niente dati reali versionati (tienili in locale, fuori da `data/sample/`).
- Quando un segnale è robusto (batte stabilmente il `ProxyRegimeProvider` su più
  asset class e finestre, hit ratio confrontabile a ~0.77), si "promuove":
  si implementa `OptionsRegimeProvider(RegimeProvider)` in `aa_engine/data/`.

## Stato — iterazione 1 (dati gratuiti) ✅ conclusa

**Esito: i segnali-vol gratuiti NON battono il proxy** (né hit ratio né Calmar).
Vedi **`FINDINGS.md`** per i numeri e la decisione. Nessuna promozione: non è
stato scritto `OptionsRegimeProvider`.

## Come riprodurre

```bash
cd engine && pip install -e ".[dev]"      # serve aa_engine (il proxy = giudice)
cd research/options-regime
python fetch_data.py                       # scarica VIX/MOVE/SPY/TLT/GLD/DBC in data_local/
python _make_notebooks.py                  # (ri)genera i notebook 01–05
jupyter nbconvert --to notebook --execute --inplace 0*_*.ipynb
```

## Struttura

- `fetch_data.py` — download dati gratuiti (CBOE VIX, Yahoo per il resto).
- `vol_regime.py` — utility di ricerca: segnali (soglia / momentum / term-structure),
  il proxy del motore come giudice, hit ratio e overlay di protezione. **Non** è
  production code.
- `01_load_vol_indices.ipynb` — esplorazione VIX/MOVE, percentili, relazione coi drawdown.
- `02_signal_threshold.ipynb` — ipotesi 1 (livello con soglia) vs proxy.
- `03_signal_vol_momentum.ipynb` — ipotesi 2 (momentum della vol) vs proxy.
- `04_signal_term_structure.ipynb` — ipotesi 3 (scomposizione short/long) vs proxy.
- `05_vs_proxy_pipeline.ipynb` — livello C: protezione (Calmar/MaxDD) vs proxy.
- `data_local/` — dati grezzi, **non versionati**.
- `FINDINGS.md` — risultati e decisione.

## Interfaccia target

L'output finale è una sola classe, drop-in rispetto al proxy:

```python
class OptionsRegimeProvider(RegimeProvider):
    def get_regime(self, asset_class, as_of=None) -> Regime: ...
    def get_regime_series(self, asset_class, start, end=None) -> pd.Series: ...
```
