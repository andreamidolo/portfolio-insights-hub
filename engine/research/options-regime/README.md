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

## Punto di partenza suggerito

1. `00_literature_notes.md` — appunti sulla scomposizione IV short/long, term
   structure, skew, variance risk premium.
2. `01_volatility_indices.ipynb` — caricare VIX/MOVE/VVIX, esplorare livello vs
   variazione, prime soglie di regime.
3. `02_term_structure_signal.ipynb` — segnale da term structure IV (1M vs 3M/6M);
   backtest isolato (hit ratio per asset class).

## Interfaccia target

L'output finale è una sola classe, drop-in rispetto al proxy:

```python
class OptionsRegimeProvider(RegimeProvider):
    def get_regime(self, asset_class, as_of=None) -> Regime: ...
    def get_regime_series(self, asset_class, start, end=None) -> pd.Series: ...
```
