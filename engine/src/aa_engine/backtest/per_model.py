"""Backtest **per-modello** dell'ensemble — registra ciò che l'aggregato scarta.

``pipeline.run.compute_ensemble_backtest`` restituisce solo le metriche aggregate
ensemble-vs-1/N: a ogni fold lo strategy callable consuma ``EnsembleResult`` e ne
tiene solo ``final_weights``. Score, selezione e pesi proposti dai singoli modelli
(``res.scores`` / ``res.selected`` / ``res.weights_by_model``) **non vengono
persistiti da nessuna parte**.

Questo modulo colma il vuoto: esegue lo stesso walk-forward dell'ensemble e, ad
ogni fold, registra per OGNI modello:

- se è entrato nei ``n_best`` (→ **frequenza di selezione** sui fold);
- il suo **score** (Calmar OOS interno dello scorer);
- la **performance OOS standalone** dei suoi pesi proposti, applicati al fold di
  test (track record cucito → Sharpe/Calmar/MaxDD/CAGR per modello).

Niente modifica al motore: i campi esistono già su ``EnsembleResult``; qui si
ciclano i fold e si leggono. Riusa ``WalkForwardSplitter`` e ``performance_summary``
del motore, così i numeri sono coerenti con il resto del sistema.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass, field
from pathlib import Path

import pandas as pd

from aa_engine.backtest.performance import PerformanceStats, performance_summary
from aa_engine.backtest.splitters import WalkForwardSplitter
from aa_engine.optimization import LITE_MODELS, OptimizationEnsemble, default_ensemble
from aa_engine.optimization.base import PortfolioConstraints, equal_weights

_LITE_NAMES = frozenset(m().name for m in LITE_MODELS)


@dataclass(frozen=True)
class PerModelStats:
    """Aggregato OOS per un singolo modello, sui fold in cui era attivo."""

    model: str
    in_lite: bool
    active_folds: int          # fold in cui il modello ha prodotto pesi validi
    selection_count: int       # quante volte è entrato nei n_best
    selection_freq: float      # selection_count / n_folds
    mean_score: float          # score medio (Calmar OOS interno) sui fold attivi
    # Performance OOS standalone (pesi proposti dal modello applicati al test):
    cagr: float
    sharpe: float
    sortino: float
    max_drawdown: float
    calmar: float


@dataclass
class PerModelReport:
    """Esito completo del backtest per-modello (serializzabile)."""

    n_folds: int
    n_models: int
    oos_days: int
    period_start: str
    period_end: str
    train_size: int
    test_size: int
    data_source: str
    ensemble: dict             # perf aggregata dell'ensemble (n_best, media pesi)
    equal_weight: dict         # perf aggregata della baseline 1/N
    per_model: list[PerModelStats]
    fold_selections: list[list[str]] = field(default_factory=list)

    # ------------------------------------------------------------------ #
    def to_frame(self) -> pd.DataFrame:
        """Tabella per-modello ordinata per frequenza di selezione (poi Calmar)."""
        df = pd.DataFrame(asdict(m) for m in self.per_model)
        if df.empty:
            return df
        return df.sort_values(
            ["selection_freq", "calmar"], ascending=False
        ).reset_index(drop=True)

    def to_dict(self) -> dict:
        d = asdict(self)
        d["per_model"] = [asdict(m) for m in self.per_model]
        return d

    def write_csv(self, path: str | Path) -> Path:
        path = Path(path)
        self.to_frame().to_csv(path, index=False)
        return path

    def write_json(self, path: str | Path) -> Path:
        path = Path(path)
        path.write_text(json.dumps(self.to_dict(), indent=2))
        return path


def _perf_or_nan(series: pd.Series) -> PerformanceStats | None:
    if series is None or len(series) < 2:
        return None
    return performance_summary(series)


def run_per_model_backtest(
    returns: pd.DataFrame,
    *,
    constraints: PortfolioConstraints | None = None,
    ensemble: OptimizationEnsemble | None = None,
    n_best: int = 4,
    train_size: int = 756,
    test_size: int = 252,
    step: int | None = None,
    expanding: bool = False,
    data_source: str = "unknown",
) -> PerModelReport:
    """Esegue il walk-forward dell'ensemble registrando i dettagli per-modello.

    Parametri
    ---------
    returns : DataFrame      rendimenti per-periodo (colonne = strumenti)
    constraints : vincoli di gruppo (cap/floor); ``None`` = nessun vincolo
    ensemble : ensemble da usare; default ``default_ensemble(n_best)`` (rispetta
               ``AA_ENGINE_LITE``)
    train_size / test_size / step / expanding : finestra walk-forward
    """
    ens = ensemble or default_ensemble(n_best=n_best)
    splitter = WalkForwardSplitter(
        train_size=train_size, test_size=test_size, step=step, expanding=expanding
    )
    cols = list(returns.columns)
    eqw = equal_weights(cols)

    sel_count: Counter[str] = Counter()
    score_sum: dict[str, float] = defaultdict(float)
    score_n: Counter[str] = Counter()
    model_oos: dict[str, list[pd.Series]] = defaultdict(list)
    ens_oos: list[pd.Series] = []
    eqw_oos: list[pd.Series] = []
    fold_selections: list[list[str]] = []

    for train_idx, test_idx in splitter.split(returns):
        train = returns.iloc[train_idx]
        test = returns.iloc[test_idx]
        res = ens.run(train, constraints=constraints)

        fold_selections.append(list(res.selected))
        for name in res.selected:
            sel_count[name] += 1
        for name, sc in res.scores.items():
            score_sum[name] += float(sc)
            score_n[name] += 1
        # OOS standalone: pesi proposti da ogni modello attivo applicati al test
        for name, w in res.weights_by_model.items():
            wv = w.reindex(cols).fillna(0.0)
            model_oos[name].append(test.mul(wv, axis=1).sum(axis=1))
        ens_oos.append(test.mul(res.final_weights.reindex(cols).fillna(0.0), axis=1).sum(axis=1))
        eqw_oos.append(test.mul(eqw, axis=1).sum(axis=1))

    n_folds = len(fold_selections)
    if n_folds == 0:
        raise ValueError("Nessun fold: train_size+test_size eccede la storia disponibile.")

    R_ens = pd.concat(ens_oos)
    R_eqw = pd.concat(eqw_oos)

    per_model: list[PerModelStats] = []
    for name in sorted(model_oos):
        oos = pd.concat(model_oos[name]) if model_oos[name] else None
        ps = _perf_or_nan(oos)
        nan = float("nan")
        per_model.append(
            PerModelStats(
                model=name,
                in_lite=name in _LITE_NAMES,
                active_folds=len(model_oos[name]),
                selection_count=sel_count[name],
                selection_freq=round(sel_count[name] / n_folds, 4),
                mean_score=round(score_sum[name] / score_n[name], 4) if score_n[name] else nan,
                cagr=round(ps.cagr, 4) if ps else nan,
                sharpe=round(ps.sharpe, 4) if ps else nan,
                sortino=round(ps.sortino, 4) if ps else nan,
                max_drawdown=round(ps.max_drawdown, 4) if ps else nan,
                calmar=round(ps.calmar, 4) if ps else nan,
            )
        )

    def _agg(series: pd.Series) -> dict:
        ps = performance_summary(series)
        return {
            "cagr": round(ps.cagr, 4), "volatility": round(ps.volatility, 4),
            "sharpe": round(ps.sharpe, 4), "sortino": round(ps.sortino, 4),
            "max_drawdown": round(ps.max_drawdown, 4), "calmar": round(ps.calmar, 4),
        }

    return PerModelReport(
        n_folds=n_folds,
        n_models=len(per_model),
        oos_days=len(R_ens),
        period_start=str(R_ens.index[0])[:10],
        period_end=str(R_ens.index[-1])[:10],
        train_size=train_size,
        test_size=test_size,
        data_source=data_source,
        ensemble=_agg(R_ens),
        equal_weight=_agg(R_eqw),
        per_model=per_model,
        fold_selections=fold_selections,
    )


# --------------------------------------------------------------------------- #
# CLI — esegue su dati reali (se disponibili) o sul backbone sintetico
# --------------------------------------------------------------------------- #
def _real_prices_returns() -> tuple[pd.DataFrame, dict[str, str], str] | None:
    """Carica i prezzi reali Yahoo da research/options-regime/data_local, se presenti."""
    here = Path(__file__).resolve()
    root = here.parents[3]  # …/engine
    csv = root / "research" / "options-regime" / "data_local" / "prices.csv"
    if not csv.exists():
        return None
    px = pd.read_csv(csv, index_col=0, parse_dates=True).sort_index()
    keep = [c for c in ("SPY", "TLT", "GLD", "DBC") if c in px.columns]
    px = px[keep].dropna()
    acmap = {"SPY": "Equity", "TLT": "Fixed Income", "GLD": "Gold", "DBC": "Commodities"}
    acmap = {k: v for k, v in acmap.items() if k in keep}
    return px.pct_change().dropna(), acmap, f"real:yahoo:{csv.name}"


def _main() -> None:
    import argparse

    from rich.console import Console
    from rich.table import Table

    p = argparse.ArgumentParser(description="Backtest per-modello dell'ensemble (OOS).")
    p.add_argument("--data", choices=["real", "sample"], default="real",
                   help="real = prezzi Yahoo data_local; sample = backbone sintetico")
    p.add_argument("--train", type=int, default=756)
    p.add_argument("--test", type=int, default=252)
    p.add_argument("--n-best", type=int, default=4)
    p.add_argument("--out", default=None, help="prefisso file output (.csv/.json)")
    args = p.parse_args()

    console = Console()
    constraints = None
    real = _real_prices_returns() if args.data == "real" else None
    if real is not None:
        returns, acmap, source = real
        constraints = PortfolioConstraints(w_max=0.40, asset_class_map=acmap)
    else:
        from aa_engine.optimization.sample import ASSET_CLASS_MAP, sample_returns
        returns = sample_returns(periods=756)
        constraints = PortfolioConstraints(w_max=0.40, asset_class_map=ASSET_CLASS_MAP)
        source = "sample:synthetic"
        if args.data == "real":
            console.print("[yellow]prezzi reali non trovati → backbone sintetico[/yellow]")

    console.rule(f"[bold]Backtest per-modello — {source} ({len(returns)} gg)")
    rep = run_per_model_backtest(
        returns, constraints=constraints, n_best=args.n_best,
        train_size=args.train, test_size=args.test, data_source=source,
    )
    console.print(
        f"Fold: {rep.n_folds} | Modelli: {rep.n_models} | OOS: {rep.oos_days} gg "
        f"({rep.period_start}→{rep.period_end})"
    )
    console.print(f"Ensemble: {rep.ensemble} | 1/N: {rep.equal_weight}\n")

    t = Table(title="Per-modello (ordinato per frequenza di selezione)")
    for c in ("model", "lite", "sel%", "score", "Sharpe", "Calmar", "MaxDD"):
        t.add_column(c, justify="left" if c == "model" else "right")
    for m in rep.to_frame().itertuples():
        t.add_row(m.model, "✓" if m.in_lite else "", f"{m.selection_freq:.0%}",
                  f"{m.mean_score:.2f}", f"{m.sharpe:.2f}", f"{m.calmar:.2f}",
                  f"{m.max_drawdown:.2f}")
    console.print(t)

    if args.out:
        console.print(f"[green]CSV → {rep.write_csv(args.out + '.csv')}[/green]")
        console.print(f"[green]JSON → {rep.write_json(args.out + '.json')}[/green]")


if __name__ == "__main__":
    _main()
