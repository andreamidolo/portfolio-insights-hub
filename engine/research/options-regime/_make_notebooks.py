"""Genera i notebook di ricerca (01–05) come file .ipynb.

    python _make_notebooks.py

Tiene i notebook in sync con le utility (vol_regime.py). Eseguire poi con:
    jupyter nbconvert --to notebook --execute --inplace 0X_*.ipynb
"""

from __future__ import annotations

import json
from pathlib import Path

HERE = Path(__file__).resolve().parent


def nb(cells):
    return {
        "cells": cells,
        "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                     "language_info": {"name": "python", "version": "3.11"}},
        "nbformat": 4, "nbformat_minor": 5,
    }


def md(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text.strip("\n").splitlines(keepends=True)}


def code(src):
    return {"cell_type": "code", "metadata": {}, "execution_count": None, "outputs": [],
            "source": src.strip("\n").splitlines(keepends=True)}


SETUP = """
import warnings; warnings.filterwarnings("ignore")
import numpy as np, pandas as pd
import vol_regime as vr
pd.set_option("display.float_format", lambda x: f"{x:.3f}")
"""

# --------------------------------------------------------------------------- #
N01 = nb([
    md("""
# 01 — Carico ed esploro VIX / MOVE

Dati GRATUITI (vedi `fetch_data.py`, esegui prima `python fetch_data.py`):
VIX (CBOE, dal 1990), MOVE (Yahoo), benchmark SPY/TLT/GLD/DBC.
I dati sono in `data_local/` e **non** sono versionati.
"""),
    code(SETUP),
    code("""
vol = vr.load_vol(); prices = vr.load_prices()
print("VIX/MOVE:", vol.dropna().index.min().date(), "→", vol.index.max().date())
vol.describe(percentiles=[.5,.7,.8,.9,.95]).T
"""),
    md("## Percentili (le soglie candidate vengono da qui)"),
    code("""
pd.DataFrame({c: vol[c].dropna().quantile([.5,.7,.8,.9,.95]) for c in vol.columns})
"""),
    md("## Relazione vol ↔ drawdown di mercato (la vol esplode nei crash)"),
    code("""
spy = prices["SPY"].dropna()
dd = spy/spy.cummax() - 1.0
joined = pd.concat({"VIX": vol["VIX"], "SPY_drawdown": dd}, axis=1).dropna()
print("corr(VIX, drawdown SPY):", round(joined["VIX"].corr(joined["SPY_drawdown"]), 3))
print("VIX medio quando drawdown < -20%:", round(joined.loc[joined.SPY_drawdown < -0.2, "VIX"].mean(), 1))
print("VIX medio quando drawdown >  -5%:", round(joined.loc[joined.SPY_drawdown > -0.05, "VIX"].mean(), 1))
"""),
    md("""
**Nota.** La VIX è fortemente correlata (negativamente) al drawdown: esplode
*durante* i crash. Questo è il punto chiave per i segnali sotto — la VIX è
**coincidente**, non necessariamente anticipatrice.
"""),
])

# --------------------------------------------------------------------------- #
def signal_nb(title, intro, builder_call, concl):
    return nb([
        md(title + "\n\n" + intro),
        code(SETUP + "\nvol = vr.load_vol()"),
        md("## Hit ratio: il segnale predice la direzione del mese successivo? (vs proxy)"),
        code(f"""
for ac, vcol in vr.VOL_FOR_CLASS.items():
    v = vol[vcol].dropna()
    sig = {builder_call}
    print(f"==== {{ac}} (vol={{vcol}}) ====")
    print(vr.compare_table(sig, ac).to_string(float_format=lambda x: f"{{x:.3f}}"))
    print()
"""),
        md("## Stabilità: hit ratio per anno (Equity)"),
        code(f"""
v = vol["VIX"].dropna()
sig = {builder_call.replace('vcol', '"VIX"').replace('v ', 'v ')}
px = vr.load_prices()["SPY"].dropna()
sig_al = sig.reindex(px.index).ffill()
vr.hit_ratio_by_year(sig_al, px).round(3)
"""),
        md(concl),
    ])


N02 = signal_nb(
    "# 02 — Ipotesi 1: livello di vol con soglia",
    'BEAR se la vol supera il suo percentile q80 (rolling, solo dati passati). '
    'È la "colonna Fear": stress = vol alta.',
    "vr.signal_threshold(v, q=0.80)",
    """
**Conclusione (02).** Il segnale a soglia **non batte il proxy** sull'hit ratio
azionario (≈0.56 vs ≈0.62, sotto anche il base-rate 0.62): la VIX alta è
*coincidente* col drawdown, quindi la soglia entra in BEAR a crash già iniziato.
Su Fixed Income tutti ~0.51 (coin flip).
""",
)

N03 = signal_nb(
    "# 03 — Ipotesi 2: momentum della vol",
    "BEAR se la vol è in rapido aumento (variazione a 21g nel q80 alto). "
    "La dinamica spesso anticipa il livello.",
    "vr.signal_vol_momentum(v, window=21, q=0.80)",
    """
**Conclusione (03).** Il momentum della vol è leggermente più reattivo del
livello ma **non batte il proxy** sull'hit ratio (≈0.55 equity). Vedremo nel 05
che protegge un po' meglio della soglia nei drawdown, ma resta sotto il proxy.
""",
)

N04 = signal_nb(
    "# 04 — Ipotesi 3: scomposizione short/long (term structure)",
    'MA breve (21g) vs MA lunga (126g) della vol: BEAR se la componente breve è '
    'sopra la lunga. È l\'ipotesi più vicina a "disentangling vol into long/short".',
    "vr.signal_term_structure(v, 21, 126)",
    """
**Conclusione (04).** Anche la scomposizione short/long con i dati gratuiti
**non batte il proxy** (≈0.54 equity). La vera term structure (futures VIX,
superfici di IV) richiederebbe Bloomberg — fuori scope ora.
""",
)

# --------------------------------------------------------------------------- #
N05 = nb([
    md("""
# 05 — Il test che conta: impatto sulla protezione (vs proxy)

Hit ratio a parte, un segnale di regime vale se **protegge nei crash**. Overlay di
*market timing*: investito in BULL, cash in BEAR (decisione su info del giorno
prima, niente lookahead). Confronto Calmar / MaxDD: proxy vs segnali-vol vs buy&hold,
su 2002–2026 (include 2008, 2020, 2022).
"""),
    code(SETUP),
    code("""
def stats(ret):
    ret = ret.dropna(); nav = (1+ret).cumprod(); n = len(ret)
    cagr = nav.iloc[-1]**(252/n) - 1
    mdd = -(nav/nav.cummax() - 1).min()
    sharpe = ret.mean()/ret.std()*np.sqrt(252) if ret.std() else 0
    return dict(CAGR=cagr, Sharpe=sharpe, MaxDD=mdd, Calmar=cagr/mdd if mdd>0 else np.nan)

vol = vr.load_vol(); prices = vr.load_prices()
for ac, vcol in vr.VOL_FOR_CLASS.items():
    px = prices[vr.BENCHMARKS[ac]].dropna(); r = px.pct_change(); v = vol[vcol].dropna()
    start, end = px.index.min(), px.index.max()
    regimes = {
        "proxy(200d)": vr.proxy_regime(ac, start, end),
        f"{vcol} thr q80": vr.signal_threshold(v, q=0.80),
        f"{vcol} mom q80": vr.signal_vol_momentum(v, 21, q=0.80),
        f"{vcol} ts 21/126": vr.signal_term_structure(v, 21, 126),
    }
    rows = {"buy&hold": stats(r)}
    for name, reg in regimes.items():
        rg = reg.reindex(px.index).ffill().shift(1)
        rows[name] = stats(r.where(rg == vr.BULL, 0.0))
    print(f"==== {ac} ({vcol}-timed, {start.date()}→{end.date()}) ====")
    print(pd.DataFrame(rows).T[["CAGR","Sharpe","MaxDD","Calmar"]].to_string(float_format=lambda x: f"{x:.3f}"))
    print()
"""),
    md("""
## Conclusione onesta (livello C)

**I segnali-vol gratuiti NON battono il proxy.**

- **Equity**: il proxy (200d MA) domina — Calmar ~0.26 e MaxDD ~0.21, contro
  Calmar ≤0.11 e MaxDD ≥0.46 dei segnali VIX. La soglia VIX fa *peggio* del
  buy&hold (entra in BEAR a crash iniziato, poi resta fuori nel rimbalzo).
- **Fixed Income**: tutto debole (MOVE non aiuta; TLT stesso rende poco).

**Decisione** (paletti della spec): nessun segnale passa A+B+C → **non si scrive
`OptionsRegimeProvider`**, non si promuove nulla. Il proxy resta il giudice e,
per ora, il migliore.

**Prossimo bivio (per la chat di progetto):**
1. tenere il proxy e concentrarsi sui **segnali ML del motore** (trend/oscillatori/SVM); oppure
2. salire a **Bloomberg** (term structure dei futures VIX, skew/risk-reversal,
   scomposizione IV) — l'unica via per replicare davvero l'approccio AlgoEagle,
   ma è il pezzo costoso: da fare solo se si decide che la pista vale l'investimento.
"""),
])

for name, notebook in [
    ("01_load_vol_indices.ipynb", N01),
    ("02_signal_threshold.ipynb", N02),
    ("03_signal_vol_momentum.ipynb", N03),
    ("04_signal_term_structure.ipynb", N04),
    ("05_vs_proxy_pipeline.ipynb", N05),
]:
    (HERE / name).write_text(json.dumps(notebook, indent=1, ensure_ascii=False))
    print("wrote", name)
