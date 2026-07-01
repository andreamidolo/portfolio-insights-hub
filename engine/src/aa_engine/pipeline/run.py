"""Fase 4 — il flusso unico end-to-end ("il bottone").

``run_allocation`` è l'UNICO punto di verità: regime → segnali → selezione →
ottimizzazione → rischio. CLI e API sono due involucri sottili attorno ad esso
(nessuna logica duplicata). È pura "colla" sui moduli esistenti; nessuna nuova
logica di sostanza. Backbone campione, niente dati live, SVM disattivato.

Spec: docs/11_phase4_integration_spec.md.
"""

from __future__ import annotations

import contextlib
import hashlib
import io
from dataclasses import dataclass, field

import pandas as pd

import numpy as np

from aa_engine.backtest.performance import performance_summary
from aa_engine.data import Regime
from aa_engine.optimization import OptimizationEnsemble, default_ensemble, lite_enabled
from aa_engine.profiles import benchmark_weights, constraints_for, load_profiles
from aa_engine.risk import compute_measure
from aa_engine.signals import (
    AlphaCrashSignal,
    OscillatorSignal,
    StaticRegimeProvider,
    TrendSignal,
    select_securities,
    summary_signal,
    summary_to_bl_views,
)

# Segnali tecnici usati nel SUMMARY (SVM escluso: disattivato finché non vince).
_SIGNALS = {"trend": TrendSignal, "oscillator": OscillatorSignal, "alpha_crash": AlphaCrashSignal}

# Motivo per cui l'A.I. (SVM) non compare nel SUMMARY (vedi signals/ai_forecast).
SVM_DISABLED_NOTE = "A.I. (SVM) disattivato — validato walk-forward, non batte il baseline."

# Finestra trailing (giorni di trading) data in pasto agli ottimizzatori. Il
# motore è tarato su ~36 mesi (cfr. api/sample.py:N_DAYS=756, "trailing 36 months"):
# oltre, i modelli online/timing (O(T·n²)) diventano non-interattivi. La storia
# completa resta per grafici/ispezione; qui si passa solo la coda di `LOOKBACK_DAYS`.
LOOKBACK_DAYS = 756

# --------------------------------------------------------------------------- #
# Cache (memoization) dei calcoli pesanti — l'ensemble è DETERMINISTICO a parità
# di input, quindi cachare è corretto (verificato). La chiave include un
# fingerprint dei dati attivi: caricare nuovi prezzi via /data/upload invalida
# automaticamente la cache. In-process, bounded (FIFO).
# --------------------------------------------------------------------------- #
_CACHE: "dict[tuple, object]" = {}
_CACHE_MAX = 128


def _data_fingerprint() -> str:
    """Hash dei rendimenti attivi (sorgente + shape + colonne + valori)."""
    from aa_engine.api.store import STORE

    r, src = STORE.active_returns()
    h = hashlib.md5()
    h.update(str(r.shape).encode())
    h.update(",".join(map(str, r.columns)).encode())
    h.update(f"{r.index[0]}|{r.index[-1]}".encode())
    h.update(r.to_numpy(dtype="float64").tobytes())
    return f"{src}:{h.hexdigest()}"


def _cache_put(key: tuple, value: object) -> object:
    if len(_CACHE) >= _CACHE_MAX:
        _CACHE.pop(next(iter(_CACHE)))  # FIFO: sfratta il più vecchio
    _CACHE[key] = value
    return value


def clear_cache() -> None:
    """Svuota la cache (es. dopo un cambio di config a runtime)."""
    _CACHE.clear()


@dataclass
class AllocationResult:
    """Tutto ciò che serve a report e API — l'output del flusso unico."""

    profile: str
    currency: str
    as_of: str
    n_models_active: int
    regimes: dict[str, str]                       # asset class → "bull"/"bear"
    signals: list[dict]                           # per ticker: dir/prob dei segnali + SUMMARY
    selected: list[str]
    discarded: list[str]
    selected_models: list[str]                    # i 4 scelti dall'ensemble
    final_weights: dict[str, float]
    asset_class_weights: dict[str, float]
    risk: dict[str, float]                        # StdDev, VaR, CVaR, MaxDD, Calmar…
    excluded_models: dict[str, str] = field(default_factory=dict)
    benchmark: dict = field(default_factory=dict)  # confronto col benchmark del profilo
    lite: bool = False                             # modalità hosting leggera (ensemble ridotto)

    def to_payload(self) -> dict:
        """Dict JSON-serializzabile (per l'API e il salvataggio)."""
        return {
            "profile": self.profile, "currency": self.currency, "as_of": self.as_of,
            "lite": self.lite,
            "n_models_active": self.n_models_active,
            "regimes": self.regimes, "signals": self.signals,
            "selected": self.selected, "discarded": self.discarded,
            "selected_models": self.selected_models,
            "final_weights": self.final_weights,
            "asset_class_weights": self.asset_class_weights,
            "risk": self.risk, "excluded_models": self.excluded_models,
            "benchmark": self.benchmark or None,
        }


@contextlib.contextmanager
def _quiet():
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        yield


def _proxy_regimes(returns: pd.DataFrame, acmap: dict[str, str], window: int = 100) -> dict[str, Regime]:
    """Regime corrente per asset class (proxy: prezzo aggregato vs media mobile).

    È la stessa idea del ``ProxyRegimeProvider`` (trend-following), applicata
    all'indice equal-weight degli strumenti di ciascuna classe.
    """
    out: dict[str, Regime] = {}
    classes = sorted(set(acmap.get(t, "Other") for t in returns.columns))
    for ac in classes:
        members = [t for t in returns.columns if acmap.get(t) == ac]
        idx = (1.0 + returns[members].mean(axis=1)).cumprod()
        ma = idx.rolling(window, min_periods=window // 2).mean()
        out[ac] = Regime.BULL if float(idx.iloc[-1]) >= float(ma.iloc[-1]) else Regime.BEAR
    return out


def _risk_by_security(returns: pd.DataFrame) -> pd.Series:
    one = pd.Series([1.0], index=["x"])
    return pd.Series(
        {t: compute_measure(returns[[t]].rename(columns={t: "x"}), one, "MV") for t in returns.columns}
    )


def _risk_summary(returns: pd.DataFrame, weights: pd.Series) -> dict[str, float]:
    r_p = returns.mul(weights.reindex(returns.columns).fillna(0.0), axis=1).sum(axis=1)
    perf = performance_summary(r_p)
    return {
        "std_dev": round(compute_measure(returns, weights, "MV"), 6),
        "var_95": round(compute_measure(returns, weights, "VaR"), 6),
        "cvar_95": round(compute_measure(returns, weights, "CVaR"), 6),
        "max_drawdown": round(compute_measure(returns, weights, "MDD"), 6),
        "calmar": round(perf.calmar, 4),
        "sharpe": round(perf.sharpe, 4),
        "cagr": round(perf.cagr, 6),
    }


def compute_signal_outputs(
    returns: pd.DataFrame, acmap: dict[str, str], regimes: dict[str, Regime]
) -> tuple[dict[str, pd.DataFrame], pd.DataFrame]:
    """Segnali tecnici + SUMMARY (modulato dal regime) su un set di rendimenti.

    Riusabile su QUALSIASI universo (backbone campione o mandato caricato
    dall'utente): la logica dei segnali è la stessa.
    """
    prices = 100.0 * (1.0 + returns).cumprod()
    sig_outputs = {name: cls().compute(returns, prices) for name, cls in _SIGNALS.items()}
    regime_per_ticker = pd.Series(
        {t: int(regimes.get(acmap.get(t, "Unknown"), Regime.BULL)) for t in returns.columns}
    )
    summary = summary_signal(sig_outputs, regime=regime_per_ticker)
    return sig_outputs, summary


def build_signals_table(
    sig_outputs: dict[str, pd.DataFrame], summary: pd.DataFrame, acmap: dict[str, str]
) -> list[dict]:
    """Tabella segnali stile AlgoEagle (una riga per strumento)."""
    return [
        {
            "ticker": t,
            "asset_class": acmap.get(t, "Unknown"),
            **{name: {"direction": int(out.loc[t, "direction"]),
                      "probability": round(float(out.loc[t, "probability"]), 3)}
               for name, out in sig_outputs.items()},
            "summary": {"direction": int(summary.loc[t, "direction"]),
                        "probability": round(float(summary.loc[t, "probability"]), 3)},
        }
        for t in summary.index
    ]


@dataclass
class _Context:
    """Lo stato condiviso "a monte" dell'ottimizzazione: regime, segnali, selezione.

    Calcolato da ``_build_context`` e riusato dal flusso completo
    (``run_allocation``) e dalle "finestre di lettura" dell'API (segnali,
    breakdown dei modelli). Nessun ensemble qui dentro: è la parte veloce.
    """

    profile: str
    currency: str
    as_of: str
    universe: list[str]
    returns: pd.DataFrame
    acmap: dict[str, str]
    regimes: dict[str, Regime]
    regime_provider: StaticRegimeProvider
    views: dict
    selected: list[str]
    discarded: list[str]
    signals_table: list[dict]

    @property
    def regime_labels(self) -> dict[str, str]:
        return {ac: ("bull" if r == Regime.BULL else "bear") for ac, r in self.regimes.items()}


def _build_context(
    profile: str = "moderate",
    currency: str = "EUR",
    as_of: str | None = None,
    *,
    universe: list[str] | None = None,
    lookback: int | None = LOOKBACK_DAYS,
) -> _Context:
    """Stadi 1–1.5 del flusso: regime → segnali → SUMMARY → views → selezione.

    È la "parte veloce" e profilo-indipendente nei segnali (il profilo entra solo
    nei vincoli dell'ottimizzazione, a valle). La estraiamo così l'API può
    esporre i segnali senza far girare i 41 modelli.
    """
    # I profili sono DATI (config esterna): validiamo contro la config, non un literal.
    if profile not in load_profiles().profile_ids:
        raise ValueError(f"Profilo sconosciuto: {profile!r}")

    # Carburante dati: rendimenti REALI caricati via /data/upload (store in
    # memoria) se presenti, altrimenti backbone sintetico. Stesso shape
    # (date × ticker): il resto della pipeline non cambia. Import locale per
    # evitare cicli (api -> pipeline -> api).
    from aa_engine.api.store import STORE, acmap_for

    returns_all, _data_source = STORE.active_returns()
    if as_of is not None:
        returns_all = returns_all.loc[: pd.Timestamp(as_of)]
    # Cap a FINESTRA TRAILING: gli ottimizzatori (specie online/timing, costo
    # ~O(T·n²)) sono pensati per ~36 mesi. La storia piena resta disponibile per
    # grafici/ispezione, ma qui passiamo solo le ultime `lookback` osservazioni —
    # interattività + rilevanza del regime recente. `None` = nessun cap.
    if lookback is not None and len(returns_all) > lookback:
        returns_all = returns_all.iloc[-lookback:]
    as_of_str = returns_all.index[-1].date().isoformat()
    universe = universe or list(returns_all.columns)
    returns_all = returns_all[universe]
    acmap = acmap_for(universe, default="Other")

    # 1. REGIME (proxy) per asset class
    regimes = _proxy_regimes(returns_all, acmap)
    regime_provider = StaticRegimeProvider(regimes, default=Regime.BULL)

    # 2. SEGNALI tecnici → SUMMARY (modulato dal regime) → views BL
    risk_by_sec = _risk_by_security(returns_all)
    sig_outputs, summary = compute_signal_outputs(returns_all, acmap, regimes)
    views = summary_to_bl_views(summary)

    # 3. SELECTION (filtra l'universo per regime)
    selected = select_securities(universe, acmap, regime_provider, risk_by_sec)
    discarded = [t for t in universe if t not in selected]

    return _Context(
        profile=profile, currency=currency, as_of=as_of_str,
        universe=universe, returns=returns_all, acmap=acmap,
        regimes=regimes, regime_provider=regime_provider,
        views=views, selected=selected, discarded=discarded,
        signals_table=build_signals_table(sig_outputs, summary, acmap),
    )


def run_allocation(
    profile: str = "moderate",
    currency: str = "EUR",
    as_of: str | None = None,
    *,
    universe: list[str] | None = None,
    ensemble: OptimizationEnsemble | None = None,
) -> AllocationResult:
    """Esegue l'intera pipeline end-to-end e ritorna un ``AllocationResult``.

    Questo è IL flusso: CLI e API lo chiamano entrambi. ``ensemble`` può essere
    iniettato (test/tuning); default = i ~38 modelli.
    """
    # Cache solo sul percorso "standard" (ensemble/universe di default).
    cache_key = None
    if ensemble is None and universe is None:
        cache_key = ("alloc", profile, currency, as_of, LOOKBACK_DAYS,
                     lite_enabled(), _data_fingerprint())
        hit = _CACHE.get(cache_key)
        if hit is not None:
            return hit  # type: ignore[return-value]

    ctx = _build_context(profile, currency, as_of, universe=universe)

    # 4. OTTIMIZZAZIONE: ~38 modelli → 4 migliori → media, con le views BL.
    #    I vincoli sono le BANDE min-max del profilo (config esterna, data-driven).
    ens = ensemble or default_ensemble(n_best=4)
    constraints = constraints_for(profile, currency, ctx.acmap)
    sel_views = {t: v for t, v in ctx.views.items() if t in ctx.selected}
    with _quiet():
        result = ens.run(ctx.returns[ctx.selected], views=sel_views, constraints=constraints)
    final = result.final_weights

    # 5. RISCHIO sull'allocazione finale
    risk = _risk_summary(ctx.returns[ctx.selected], final)

    # --- impacchetta il risultato ----------------------------------------- #
    ac_weights: dict[str, float] = {}
    for t, w in final.items():
        ac_weights[ctx.acmap[t]] = round(ac_weights.get(ctx.acmap[t], 0.0) + float(w), 4)

    benchmark = _benchmark_block(profile, ctx)

    out = AllocationResult(
        profile=profile, currency=currency, as_of=ctx.as_of,
        n_models_active=result.n_active,
        regimes=ctx.regime_labels,
        signals=ctx.signals_table,
        selected=ctx.selected, discarded=ctx.discarded,
        selected_models=list(result.selected),
        final_weights={t: round(float(w), 4) for t, w in final.items()},
        asset_class_weights=ac_weights,
        risk=risk,
        excluded_models=result.excluded,
        benchmark=benchmark,
        lite=lite_enabled() and ensemble is None,
    )
    return _cache_put(cache_key, out) if cache_key else out  # type: ignore[return-value]


def _benchmark_block(profile: str, ctx: _Context) -> dict:
    """Confronto col benchmark del profilo (oltre che vs 1/N): pesi + rischio.

    Il benchmark è DATO configurabile (``config/risk_profiles.json``). I pesi
    sono a livello di strumento sull'universo selezionato; il rischio è calcolato
    con lo stesso ``_risk_summary`` dell'allocazione, così il confronto è coerente.
    """
    cfg = load_profiles()
    prof = cfg.profile(profile)
    sel_acmap = {t: ctx.acmap[t] for t in ctx.selected}
    bw = benchmark_weights(profile, ctx.currency, sel_acmap, config=cfg)
    if not bw:
        return {}
    bw_series = pd.Series(bw).reindex(ctx.selected).fillna(0.0)
    bm_ac: dict[str, float] = {}
    for t, w in bw.items():
        bm_ac[ctx.acmap[t]] = round(bm_ac.get(ctx.acmap[t], 0.0) + float(w), 4)
    return {
        "id": prof.benchmark,
        "label": cfg.benchmark_label(profile),
        "placeholder": cfg.placeholder,
        "weights": {t: round(float(w), 4) for t, w in bw.items()},
        "asset_class_weights": bm_ac,
        "risk": _risk_summary(ctx.returns[ctx.selected], bw_series),
    }


# --------------------------------------------------------------------------- #
# "Finestre di lettura" per l'API (non nuova logica: espongono dati già calcolati)
# --------------------------------------------------------------------------- #
def compute_signals(as_of: str | None = None) -> dict:
    """Tabella segnali stile AlgoEagle — la parte veloce, senza ensemble.

    Profilo-indipendente: i segnali e il regime non dipendono dal profilo di
    rischio (che entra solo nei vincoli dell'ottimizzazione). Espone
    ``GET /api/v1/signals``.
    """
    ctx = _build_context("moderate", "EUR", as_of)
    return {
        "as_of": ctx.as_of,
        "svm_enabled": False,
        "svm_note": SVM_DISABLED_NOTE,
        "regimes": ctx.regime_labels,
        "selected": ctx.selected,
        "discarded": ctx.discarded,
        "signals": ctx.signals_table,
    }


def _finite_or_none(x: float) -> float | None:
    """Punteggio JSON-safe: ``-inf``/``nan`` (modello non valutabile) → ``None``."""
    return round(float(x), 4) if x is not None and np.isfinite(x) else None


def compute_optimization_models(
    profile: str = "moderate",
    currency: str = "EUR",
    as_of: str | None = None,
    *,
    ensemble: OptimizationEnsemble | None = None,
) -> dict:
    """"Apre il cofano" sullo Stadio 2: i 41 modelli, i loro pesi e score, i 4 scelti.

    Fa girare lo STESSO ensemble di ``run_allocation`` (nessuna logica nuova) ed
    espone il breakdown per-modello che il flusso normale scarta. Espone
    ``GET /api/v1/optimization/models``. ⚠️ gira i 41 modelli → lento come
    ``/allocation/run``.
    """
    cache_key = None
    if ensemble is None:
        cache_key = ("optmodels", profile, currency, as_of, LOOKBACK_DAYS,
                     lite_enabled(), _data_fingerprint())
        hit = _CACHE.get(cache_key)
        if hit is not None:
            return hit  # type: ignore[return-value]

    ctx = _build_context(profile, currency, as_of)
    ens = ensemble or default_ensemble(n_best=4)
    constraints = constraints_for(profile, currency, ctx.acmap)
    sel_views = {t: v for t, v in ctx.views.items() if t in ctx.selected}
    with _quiet():
        result = ens.run(ctx.returns[ctx.selected], views=sel_views, constraints=constraints)

    family_by_name = {m.name: m.family for m in ens.models}
    selected_set = set(result.selected)
    models = [
        {
            "name": name,
            "family": family_by_name.get(name, "base"),
            "score": _finite_or_none(result.scores.get(name, float("-inf"))),
            "selected": name in selected_set,
            "weights": {t: round(float(w), 4) for t, w in weights.items() if abs(float(w)) > 5e-5},
        }
        for name, weights in result.weights_by_model.items()
    ]
    # ordina per score decrescente (i non valutabili in fondo)
    models.sort(key=lambda m: (m["score"] is not None, m["score"] or 0.0), reverse=True)

    final = result.final_weights
    ac_weights: dict[str, float] = {}
    for t, w in final.items():
        ac_weights[ctx.acmap[t]] = round(ac_weights.get(ctx.acmap[t], 0.0) + float(w), 4)

    # baseline 1/N sull'universo selezionato (il confronto "onesto" di sempre)
    n_sel = len(ctx.selected)
    equal = {t: round(1.0 / n_sel, 4) for t in ctx.selected} if n_sel else {}
    baseline_name = "EqualWeight"

    payload = {
        "profile": profile, "currency": currency, "as_of": ctx.as_of,
        "lite": lite_enabled() and ensemble is None,
        "scorer": result.scorer, "n_best": result.n_best,
        "n_models_active": result.n_active,
        "selected_models": list(result.selected),
        "universe": ctx.universe,
        "selected": ctx.selected,
        "discarded": ctx.discarded,
        "models": models,
        "excluded_models": result.excluded,
        "final_weights": {t: round(float(w), 4) for t, w in final.items()},
        "asset_class_weights": ac_weights,
        "baseline_equal_weight": equal,
        "baseline_score": _finite_or_none(result.scores.get(baseline_name, float("-inf"))),
    }
    return _cache_put(cache_key, payload) if cache_key else payload  # type: ignore[return-value]


# --------------------------------------------------------------------------- #
# Backtest (Stadio 3) — walk-forward OOS su strategie baseline veloci
# --------------------------------------------------------------------------- #
_BT_STRATEGIES = ("equal_weight", "inverse_volatility")


def _bt_safe(x: float) -> float | None:
    return round(float(x), 6) if x is not None and np.isfinite(x) else None


def _equity_curve(oos: "pd.Series") -> "pd.Series":
    """Curva di capitale ribasata a 100 dai rendimenti OOS concatenati."""
    return (1.0 + oos).cumprod() * 100.0


def _assemble_backtest_payload(strategy, res, base, src, train_size, test_size) -> dict:
    """Costruisce il payload comune (curve downsampled + stats) per i backtest."""
    eq_s = _equity_curve(res.oos_returns)
    eq_b = _equity_curve(base.oos_returns)
    idx = list(eq_s.index)
    step = max(1, len(idx) // 200)  # ~200 punti, estremi inclusi
    keep = list(range(0, len(idx), step))
    if keep and keep[-1] != len(idx) - 1:
        keep.append(len(idx) - 1)
    curve = []
    for i in keep:
        d = idx[i]
        b = eq_b.loc[d] if d in eq_b.index else None
        curve.append({
            "date": d.date().isoformat(),
            "strategy": round(float(eq_s.iloc[i]), 2),
            "baseline": round(float(b), 2) if b is not None else None,
        })

    def _stats(s) -> dict:
        return {k: (v if k == "n_obs" else _bt_safe(v)) for k, v in s.as_dict().items()}

    return {
        "method": "walk_forward",
        "strategy": strategy,
        "source": src,
        "train_size": train_size,
        "test_size": test_size,
        "n_folds": res.n_folds,
        "date_start": idx[0].date().isoformat(),
        "date_end": idx[-1].date().isoformat(),
        "stats": _stats(res.stats),
        "baseline_stats": _stats(base.stats),
        "equity_curve": curve,
    }


def compute_backtest(
    strategy: str = "inverse_volatility",
    train_size: int = 252,
    test_size: int = 63,
) -> dict:
    """Backtest walk-forward OOS della strategia scelta vs baseline 1/N.

    Usa i rendimenti ATTIVI (dati reali caricati se presenti, altrimenti
    sintetico) sull'intera storia disponibile — le strategie baseline sono
    leggere, quindi resta interattivo. Espone ``POST /api/v1/backtest/run``.
    """
    from aa_engine.api.store import STORE
    from aa_engine.backtest import WalkForwardSplitter, walk_forward_backtest
    from aa_engine.backtest.strategies import equal_weight, inverse_volatility

    strat_map = {"equal_weight": equal_weight, "inverse_volatility": inverse_volatility}
    if strategy not in strat_map:
        raise ValueError(f"Strategia sconosciuta: {strategy!r}. Valide: {_BT_STRATEGIES}.")

    returns, src = STORE.active_returns()

    cache_key = (
        "backtest", strategy, train_size, test_size, _data_fingerprint(),
    )
    hit = _CACHE.get(cache_key)
    if hit is not None:
        return hit  # type: ignore[return-value]

    splitter = WalkForwardSplitter(train_size=train_size, test_size=test_size)
    res = walk_forward_backtest(returns, strat_map[strategy], splitter)
    base = walk_forward_backtest(returns, equal_weight, splitter)
    payload = _assemble_backtest_payload(strategy, res, base, src, train_size, test_size)
    return _cache_put(cache_key, payload)  # type: ignore[return-value]


def _make_ensemble_strategy(profile: str, currency: str, pstate: dict):
    """Strategia = l'ensemble dei 41 modelli col vincoli del profilo: train→pesi.

    Stessa firma delle baseline (``train_returns -> pesi``), quindi è un drop-in
    per ``walk_forward_backtest``. Aggiorna il progresso ad ogni fold.
    """
    import pandas as pd

    from aa_engine.api.store import acmap_for

    ens = default_ensemble(n_best=4)

    def strat(train_returns: "pd.DataFrame") -> "pd.Series":
        acmap = acmap_for(train_returns.columns, default="Other")
        constraints = constraints_for(profile, currency, acmap)
        with _quiet():
            res = ens.run(train_returns, constraints=constraints)
        pstate["done"] += 1
        if pstate.get("cb"):
            pstate["cb"](pstate["done"], pstate["total"])
        return pd.Series(res.final_weights, dtype=float).reindex(train_returns.columns).fillna(0.0)

    return strat


def compute_ensemble_backtest(
    profile: str = "medium",
    currency: str = "USD",
    train_size: int = 756,
    test_size: int = 126,
    progress=None,
) -> dict:
    """Backtest walk-forward OOS dell'ENSEMBLE (41 modelli) vs baseline 1/N.

    LENTO (decine di fold × secondi): va eseguito come job in background
    (``POST /api/v1/backtest/ensemble``), non in una richiesta sincrona.
    ``progress(done, total)`` è chiamato ad ogni fold.
    """
    from aa_engine.api.store import STORE
    from aa_engine.backtest import WalkForwardSplitter, walk_forward_backtest
    from aa_engine.backtest.strategies import equal_weight

    returns, src = STORE.active_returns()
    splitter = WalkForwardSplitter(train_size=train_size, test_size=test_size)
    total = splitter.n_splits(returns)
    if total == 0:
        raise ValueError("Nessun fold: train_size+test_size eccede la storia disponibile.")

    pstate = {"done": 0, "total": total, "cb": progress}
    strat = _make_ensemble_strategy(profile, currency, pstate)
    res = walk_forward_backtest(returns, strat, splitter)
    base = walk_forward_backtest(returns, equal_weight, splitter)

    payload = _assemble_backtest_payload("ensemble", res, base, src, train_size, test_size)
    payload["profile"] = profile
    payload["currency"] = currency
    return payload


# --------------------------------------------------------------------------- #
# CLI — il "bottone" da riga di comando
# --------------------------------------------------------------------------- #
def _main() -> None:
    import argparse
    from pathlib import Path

    from rich.console import Console

    from .report import render_markdown

    parser = argparse.ArgumentParser(description="AA engine — pipeline di allocazione (Fase 4).")
    parser.add_argument("--profile", default="moderate", choices=load_profiles().profile_ids)
    parser.add_argument("--currency", default="EUR", choices=["EUR", "USD", "CHF"])
    parser.add_argument("--as-of", default=None)
    parser.add_argument("--out", default=None, help="percorso del report markdown (default: report_<profile>.md)")
    args = parser.parse_args()

    console = Console()
    console.rule(f"[bold]Pipeline allocazione — {args.profile}/{args.currency} (~1 min)")
    res = run_allocation(args.profile, args.currency, args.as_of)

    console.print(f"Modelli attivi: {res.n_models_active} | 4 scelti: {res.selected_models}")
    console.print(f"Regimi: {res.regimes}")
    console.print(f"Selezionati: {res.selected}  |  scartati: {res.discarded}")
    console.print("Allocazione finale: " + ", ".join(f"{k}={v:.3f}" for k, v in res.final_weights.items()))
    console.print(
        f"Rischio → StdDev {res.risk['std_dev']:.3f}  CVaR {res.risk['cvar_95']:.3f}  "
        f"MaxDD {res.risk['max_drawdown']:.3f}  Calmar {res.risk['calmar']:.2f}"
    )

    out = Path(args.out or f"report_{args.profile}.md")
    out.write_text(render_markdown(res))
    console.print(f"\n[green]Report salvato in {out}[/green]")


if __name__ == "__main__":
    _main()
