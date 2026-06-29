"""Profili di rischio CONFIGURABILI dai dati reali (modelli + benchmark + bande).

Principio guida: **i profili sono DATI, non codice**. La configurazione
(``config/risk_profiles.json``, generata dal foglio Portfolio_Models_Benchmarks)
definisce 4 profili (Low / Moderate / Medium / High) × 3 valute (EUR/USD/CHF),
ognuno con una **griglia min-max per 5 asset class** e un **benchmark** (target +
bande). Le bande dipendono ANCHE dalla valuta: cambiando valuta cambiano i vincoli
e quindi l'allocazione.

Le 5 asset class della config ("equity", "fixed_income", "alternatives",
"commodities", "cash") sono *gruppi* che aggregano le asset class dell'universo;
le bande diventano cap+floor di gruppo in ``PortfolioConstraints`` — riusa la
macchina di vincoli esistente, senza nuova logica nell'ottimizzatore.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from aa_engine.optimization.base import PortfolioConstraints

# I 5 gruppi della config (ordine canonico).
GROUPS: tuple[str, ...] = ("equity", "fixed_income", "alternatives", "commodities", "cash")

# Mappa asset class dell'universo → gruppo della config.
GROUP_OF_ASSET_CLASS: dict[str, str] = {
    "Equity": "equity",
    "Fixed Income": "fixed_income",
    "HY": "fixed_income",
    "Bond": "fixed_income",
    "Alternatives": "alternatives",
    "Alternative": "alternatives",
    "Commodities": "commodities",
    "Gold": "commodities",
    "Money Market": "cash",
    "Cash": "cash",
    "Liquidity": "cash",
}

DEFAULT_CURRENCY = "EUR"
_DEFAULT_W_MAX = 0.40  # cap per-strumento (rete di sicurezza)


class ProfileConfigError(ValueError):
    """Configurazione profili non valida o griglia infeasibile (messaggio per l'utente)."""


@dataclass(frozen=True)
class Band:
    min: float
    max: float


@dataclass(frozen=True)
class ProfileConfig:
    id: str
    label: str
    benchmark: str


@dataclass(frozen=True)
class ProfilesConfig:
    profiles: dict[str, ProfileConfig]
    # models[profile_id][currency] = {"target": {group: w}, "bands": {group: Band}}
    models: dict[str, dict[str, dict]]
    # benchmarks[bm_id][currency] = {"target": {group: w}, "bands": {group: Band}}
    benchmarks: dict[str, dict[str, dict]]
    currencies: tuple[str, ...]
    asset_classes: tuple[str, ...]
    index_map: dict[str, dict[str, str]]
    placeholder: bool
    default_currency: str
    source: str

    def profile(self, profile_id: str) -> ProfileConfig:
        if profile_id not in self.profiles:
            raise ProfileConfigError(
                f"Profilo sconosciuto: {profile_id!r}. Disponibili: {sorted(self.profiles)}."
            )
        return self.profiles[profile_id]

    @property
    def profile_ids(self) -> list[str]:
        return list(self.profiles)

    def _pick_currency(self, currency: str | None) -> str:
        if currency and currency in self.currencies:
            return currency
        return self.default_currency

    def bands_for(self, profile_id: str, currency: str | None) -> dict[str, Band]:
        self.profile(profile_id)
        cur = self._pick_currency(currency)
        return self.models[profile_id][cur]["bands"]

    def benchmark_target(self, profile_id: str, currency: str | None) -> dict[str, float]:
        bm_id = self.profile(profile_id).benchmark
        cur = self._pick_currency(currency)
        return self.benchmarks.get(bm_id, {}).get(cur, {}).get("target", {})

    def benchmark_label(self, profile_id: str) -> str:
        bm_id = self.profile(profile_id).benchmark
        return self.benchmarks.get(bm_id, {}).get("label", bm_id)


# --------------------------------------------------------------------------- #
# Caricamento + validazione
# --------------------------------------------------------------------------- #
def default_config_path() -> Path:
    env = os.getenv("AA_RISK_PROFILES_CONFIG")
    if env:
        return Path(env)
    return Path(__file__).resolve().parents[2] / "config" / "risk_profiles.json"


def _validate_grid(profile_id: str, currency: str, bands: dict[str, Band]) -> None:
    """Feasibility di una griglia (per profilo+valuta): messaggi chiari, niente crash."""
    issues: list[str] = []
    for g in GROUPS:
        if g not in bands:
            issues.append(f"manca la banda per '{g}'")
            continue
        b = bands[g]
        if not (0.0 <= b.min <= 1.0) or not (0.0 <= b.max <= 1.0):
            issues.append(f"'{g}': valori fuori da [0,1] (min={b.min}, max={b.max})")
        if b.min > b.max:
            issues.append(f"'{g}': min {b.min} > max {b.max}")
    sum_min = sum(b.min for b in bands.values())
    sum_max = sum(b.max for b in bands.values())
    if sum_min > 1.0 + 1e-9:
        issues.append(f"somma dei minimi {sum_min:.2f} > 100%")
    if sum_max < 1.0 - 1e-9:
        issues.append(f"somma dei massimi {sum_max:.2f} < 100%")
    if issues:
        raise ProfileConfigError(
            f"Profilo '{profile_id}' ({currency}) infeasibile: " + "; ".join(issues) + "."
        )


def _bands(raw: dict) -> dict[str, Band]:
    return {g: Band(float(raw[g]["min"]), float(raw[g]["max"])) for g in raw}


def _parse(raw: dict, source: str) -> ProfilesConfig:
    if "profiles" not in raw or "models" not in raw:
        raise ProfileConfigError("Config profili: mancano 'profiles' o 'models'.")
    currencies = tuple(raw.get("currencies", (DEFAULT_CURRENCY,)))
    profiles = {
        p["id"]: ProfileConfig(id=p["id"], label=p.get("label", p["id"]),
                               benchmark=p.get("benchmark", ""))
        for p in raw["profiles"]
    }
    models: dict[str, dict[str, dict]] = {}
    for pid, by_cur in raw["models"].items():
        models[pid] = {}
        for cur, entry in by_cur.items():
            bands = _bands(entry["bands"])
            _validate_grid(pid, cur, bands)
            models[pid][cur] = {
                "target": {g: float(v) for g, v in entry.get("target", {}).items()},
                "bands": bands,
            }
    benchmarks: dict[str, dict[str, dict]] = {}
    for bid, by_cur in raw.get("benchmarks", {}).items():
        benchmarks[bid] = {}
        for cur, entry in by_cur.items():
            if cur == "label":
                benchmarks[bid]["label"] = entry
                continue
            benchmarks[bid][cur] = {
                "target": {g: float(v) for g, v in entry.get("target", {}).items()},
                "bands": _bands(entry.get("bands", {})),
            }
    return ProfilesConfig(
        profiles=profiles, models=models, benchmarks=benchmarks,
        currencies=currencies, asset_classes=tuple(raw.get("asset_classes", GROUPS)),
        index_map=raw.get("index_map", {}),
        placeholder=bool(raw.get("_placeholder", False)),
        default_currency=raw.get("default_currency", DEFAULT_CURRENCY),
        source=str(raw.get("_source", Path(source).name)),
    )


@lru_cache(maxsize=4)
def _load_cached(path_str: str) -> ProfilesConfig:
    path = Path(path_str)
    if not path.exists():
        raise ProfileConfigError(f"Config profili non trovata: {path}")
    try:
        raw = json.loads(path.read_text())
    except json.JSONDecodeError as exc:
        raise ProfileConfigError(f"Config profili: JSON non valido ({exc}).") from exc
    return _parse(raw, source=str(path))


def load_profiles(path: str | Path | None = None) -> ProfilesConfig:
    """Carica e valida la configurazione profili (cache per path)."""
    return _load_cached(str(path or default_config_path()))


# --------------------------------------------------------------------------- #
# Da config → vincoli di ottimizzazione (gruppi), per profilo + valuta
# --------------------------------------------------------------------------- #
def group_map(acmap: dict[str, str]) -> dict[str, str]:
    """ticker → gruppo (a partire da ticker → asset class dell'universo)."""
    return {t: GROUP_OF_ASSET_CLASS.get(ac, "alternatives") for t, ac in acmap.items()}


def constraints_for(
    profile_id: str,
    currency: str | None,
    acmap: dict[str, str],
    *,
    config: ProfilesConfig | None = None,
    w_max: float = _DEFAULT_W_MAX,
) -> PortfolioConstraints:
    """``PortfolioConstraints`` con bande di gruppo dalla config (profilo + valuta).

    Le bande diventano cap+floor per gruppo; ``asset_class_map`` mappa i ticker
    sui gruppi così la macchina di vincoli esistente le applica senza modifiche.
    """
    cfg = config or load_profiles()
    bands = cfg.bands_for(profile_id, currency)
    gmap = group_map(acmap)
    present = set(gmap.values())
    caps = {g: bands[g].max for g in GROUPS if g in bands}
    floors = {g: bands[g].min for g in GROUPS if g in bands and bands[g].min > 0 and g in present}
    return PortfolioConstraints(
        w_max=w_max,
        asset_class_caps=caps,
        asset_class_floors=floors,
        long_only=True,
        asset_class_map=gmap,
    )


def benchmark_weights(
    profile_id: str,
    currency: str | None,
    acmap: dict[str, str],
    *,
    config: ProfilesConfig | None = None,
) -> dict[str, float]:
    """Pesi del benchmark a livello di strumento (target del gruppo / # membri).

    I gruppi del benchmark senza strumenti nell'universo vengono ridistribuiti
    pro-quota sui gruppi presenti (il benchmark resta investito al 100%).
    """
    cfg = config or load_profiles()
    target = cfg.benchmark_target(profile_id, currency)
    if not target:
        return {}
    gmap = group_map(acmap)
    members: dict[str, list[str]] = {}
    for t, g in gmap.items():
        members.setdefault(g, []).append(t)

    comp = {g: w for g, w in target.items() if members.get(g) and w > 0}
    total = sum(comp.values())
    if total <= 0:
        n = len(acmap)
        return {t: round(1.0 / n, 6) for t in acmap} if n else {}
    weights: dict[str, float] = {}
    for g, w in comp.items():
        share = w / total
        for t in members[g]:
            weights[t] = round(share / len(members[g]), 6)
    return weights
