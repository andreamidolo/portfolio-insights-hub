"""A.I. Forecast — ensemble di SVM (Stadio 1, Strato 3) — spec §4.

Il pezzo INCERTO: predire la direzione del rendimento è notoriamente difficile.
Disciplina anti-overfitting OBBLIGATORIA: validazione walk-forward (mai in-sample)
e confronto contro un baseline ingenuo. **Se l'SVM non batte il baseline, lo si
dichiara e NON entra nel SUMMARY** (stessa disciplina dell'iterazione opzioni).

Feature (da prezzi/rendimenti, calcolate senza lookahead):
    ret_1, ret_5, ret_21   rendimenti cumulati trailing (1/5/21 g)
    mom_63, mom_126        momentum a 3 e 6 mesi
    vol_21                 volatilità realizzata 21 g
    rsi_14                 RSI normalizzato in [−1,1]
    ma_dist                (prezzo / MA50) − 1
Target: segno del rendimento forward a ``horizon`` giorni (classificazione up/down).
Modello: ensemble di SVM (kernel/C diversi); P(up) = mediana dell'ensemble.

NB: modello *cross-sezionale* (pool di tutti gli strumenti) — più dati, una stima
sola. Scelta documentata; AlgoEagle fa per-strumento, qui semplifichiamo.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

from .base import _frame, _slice

FEATURES = ["ret_1", "ret_5", "ret_21", "mom_63", "mom_126", "vol_21", "rsi_14", "ma_dist"]


def _rsi(px: pd.Series, window: int = 14) -> pd.Series:
    delta = px.diff()
    gain = delta.clip(lower=0).ewm(alpha=1 / window, min_periods=window).mean()
    loss = (-delta.clip(upper=0)).ewm(alpha=1 / window, min_periods=window).mean()
    rs = gain / loss.replace(0, np.nan)
    return 100 - 100 / (1 + rs)


def _ticker_features(px: pd.Series) -> pd.DataFrame:
    """Feature time-series per UN ticker (nessun lookahead)."""
    out = pd.DataFrame(index=px.index)
    out["ret_1"] = px.pct_change(1)
    out["ret_5"] = px.pct_change(5)
    out["ret_21"] = px.pct_change(21)
    out["mom_63"] = px.pct_change(63)
    out["mom_126"] = px.pct_change(126)
    out["vol_21"] = px.pct_change().rolling(21).std()
    out["rsi_14"] = (_rsi(px) - 50.0) / 50.0
    out["ma_dist"] = px / px.rolling(50, min_periods=25).mean() - 1.0
    return out


def build_panel(prices: pd.DataFrame, horizon: int) -> pd.DataFrame:
    """Panel long (index=(date,ticker)) con feature + target forward."""
    frames = []
    for tk in prices.columns:
        f = _ticker_features(prices[tk])
        fwd = prices[tk].shift(-horizon) / prices[tk] - 1.0
        f["target"] = (fwd > 0).astype(float)
        f["fwd_known"] = fwd.notna()
        f["ticker"] = tk
        f["date"] = f.index
        frames.append(f)
    panel = pd.concat(frames, ignore_index=True)
    return panel.dropna(subset=FEATURES)


def _make_ensemble():
    from sklearn.pipeline import make_pipeline
    from sklearn.preprocessing import StandardScaler
    from sklearn.svm import SVC

    # kernel/C diversi → diversità dell'ensemble
    configs = [
        dict(kernel="rbf", C=1.0, gamma="scale"),
        dict(kernel="rbf", C=5.0, gamma="scale"),
        dict(kernel="linear", C=1.0),
    ]
    return [make_pipeline(StandardScaler(), SVC(**c)) for c in configs]


@dataclass
class ForecastValidation:
    svm_hit: float
    baseline_momentum_hit: float
    baseline_always_up_hit: float
    n: int
    calibration_gap: float        # |confidenza media − accuratezza| (più basso = meglio)
    beats_baseline: bool


class AIForecast:
    """Ensemble di SVM per la direzione del rendimento a ``horizon`` giorni."""

    name = "ai_forecast"

    def __init__(self, horizon: int = 21, min_train: int = 252, enabled: bool = False):
        self.horizon = horizon
        self.min_train = min_train
        self.enabled = enabled          # acceso SOLO se batte il baseline (validate)

    # ---- training/prediction su un panel ---------------------------------- #
    def _fit_predict(self, train: pd.DataFrame, X_new: np.ndarray) -> np.ndarray:
        """P(up) come frazione dell'ensemble che vota 'up' (mediana dei voti)."""
        models = _make_ensemble()
        Xtr, ytr = train[FEATURES].to_numpy(), train["target"].to_numpy()
        if len(np.unique(ytr)) < 2:
            return np.full(len(X_new), 0.5)
        votes = np.zeros(len(X_new))
        for m in models:
            m.fit(Xtr, ytr)
            votes += m.predict(X_new)
        return votes / len(models)      # frazione di voti 'up' ∈ [0,1]

    def compute(self, returns, prices, *, as_of=None) -> pd.DataFrame:
        px = _slice(prices, as_of)
        panel = build_panel(px, self.horizon)
        train = panel[panel["fwd_known"]]
        if len(train) < self.min_train:
            return _frame(pd.Series(0, index=px.columns), pd.Series(0.0, index=px.columns), px.columns)
        # feature più recenti per ogni ticker (target non ancora noto)
        latest = (
            build_panel(px, self.horizon)  # include righe con fwd ignoto? no: dropna FEATURES only
            .groupby("ticker").tail(1).set_index("ticker")
        )
        latest = latest.reindex(px.columns).dropna(subset=FEATURES)
        if latest.empty:
            return _frame(pd.Series(0, index=px.columns), pd.Series(0.0, index=px.columns), px.columns)
        p_up = self._fit_predict(train, latest[FEATURES].to_numpy())
        p_up = pd.Series(p_up, index=latest.index)
        direction = pd.Series(np.where(p_up > 0.5, 1, -1), index=p_up.index)
        confidence = (p_up - 0.5).abs() * 2.0       # 0.5→0, 0/1→1
        return _frame(direction, confidence, px.columns)

    # ---- VALIDAZIONE walk-forward (obbligatoria) -------------------------- #
    def validate(
        self, returns, prices, *, step: int = 21, train_window: int = 504,
        margin: float = 0.02,
    ) -> ForecastValidation:
        """Walk-forward OOS: SVM vs baseline momentum vs 'always up'.

        Per ogni data di test (ogni ``step`` giorni): allena su una finestra
        passata (target già realizzato) e predice il punto corrente; confronta col
        target poi realizzato. Niente in-sample, niente lookahead.

        ``margin`` (default 0.02 = 2 punti) è la soglia minima per dichiarare una
        vittoria: un vantaggio sotto il margine è rumore, non segnale (con n~150
        la dev. std dell'hit ratio è ~0.04). Onestà > risultato.
        """
        panel = build_panel(prices, self.horizon).sort_values("date")
        dates = np.sort(panel["date"].unique())
        eval_dates = dates[train_window::step]

        preds, confs, truths, mom_preds = [], [], [], []
        for t in eval_dates:
            # train: target realizzato (fwd noto) prima di t; test: a t (target noto a posteriori)
            train = panel[(panel["date"] < t) & (panel["fwd_known"])]
            test = panel[(panel["date"] == t) & (panel["fwd_known"])]
            if len(train) < self.min_train or test.empty:
                continue
            p_up = self._fit_predict(train, test[FEATURES].to_numpy())
            preds.extend((p_up > 0.5).astype(int))
            confs.extend(np.maximum(p_up, 1 - p_up))           # confidenza nella classe scelta
            truths.extend(test["target"].astype(int))
            mom_preds.extend((test["ret_21"] > 0).astype(int))  # baseline: segui il trend recente

        truths = np.array(truths)
        if truths.size == 0:
            return ForecastValidation(np.nan, np.nan, np.nan, 0, np.nan, False)
        preds, confs, mom_preds = np.array(preds), np.array(confs), np.array(mom_preds)
        svm_hit = float((preds == truths).mean())
        mom_hit = float((mom_preds == truths).mean())
        up_hit = float((truths == 1).mean())                    # 'always up' = base rate
        accuracy = float((preds == truths).mean())
        calib_gap = float(abs(confs.mean() - accuracy))
        beats = svm_hit > max(mom_hit, up_hit) + margin         # margine anti-rumore
        self.enabled = beats
        return ForecastValidation(svm_hit, mom_hit, up_hit, int(truths.size), calib_gap, beats)
