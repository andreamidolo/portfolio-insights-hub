"""Demo del backtest backbone — eseguibile end-to-end.

    python -m aa_engine.backtest.demo

Genera rendimenti multi-asset sintetici e mostra un backtest walk-forward e una
Combinatorial Purged CV con la strategia inverse-volatility.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from aa_engine.backtest import (
    CombinatorialPurgedCV,
    WalkForwardSplitter,
    cpcv_backtest,
    render,
    walk_forward_backtest,
)
from aa_engine.backtest.strategies import inverse_volatility


def _sample_returns() -> pd.DataFrame:
    rng = np.random.default_rng(7)
    dates = pd.bdate_range("2019-01-01", periods=1000)
    tickers = ["EQ_US", "EQ_EU", "BOND_US", "GOLD", "OIL"]
    mkt = rng.standard_t(df=5, size=len(dates)) * 0.008
    betas = np.array([1.1, 1.0, -0.2, 0.3, 0.9])
    idio = rng.normal(0, 0.006, size=(len(dates), len(tickers)))
    rets = mkt[:, None] * betas[None, :] + idio + 0.0002
    return pd.DataFrame(rets, index=dates, columns=tickers)


def main() -> None:
    returns = _sample_returns()

    wf = WalkForwardSplitter(train_size=252, test_size=63)
    wf_result = walk_forward_backtest(returns, inverse_volatility, wf)
    render(wf_result)

    cv = CombinatorialPurgedCV(n_groups=6, n_test_groups=2, embargo=0.01)
    cv_result = cpcv_backtest(returns, inverse_volatility, cv)
    render(cv_result)


if __name__ == "__main__":
    main()
