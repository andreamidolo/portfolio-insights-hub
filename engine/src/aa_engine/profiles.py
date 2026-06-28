"""Profili di rischio CONFIGURABILI (spec docs/14).

Principio guida: **i profili sono DATI, non codice**. Vivono in una configurazione
esterna (``config/risk_profiles.json``) che il motore legge a ogni esecuzione:
4 linee, ognuna con una griglia min-max per 5 asset class, più un benchmark, in
3 valute. Cambiare le bande NON richiede di toccare il codice.

Le 5 asset class della config ("equity", "fixed_income", "commodities", "cash",
"alternatives") sono *gruppi* che aggregano le asset class dell'universo
(es. Fixed Income + HY → fixed_income). Le bande si applicano alla SOMMA del
gruppo, tradotte in ``PortfolioConstraints`` (cap + floor per gruppo) — riusa la
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
GROUPS: tuple[str, ...] = ("equity", "fixed_income", "commodities", "cash", "alternatives")

# Mappa asset class dell'universo → gruppo della config.
GROUP_OF_ASSET_CLASS: dict[str, str] = {
    "Equity": "equity",
    "Fixed Income": "fixed_income",
    "HY": "fixed_income",
    "Commodities": "commodities",
    "Gold": "commodities",
    "Money Market": "cash",
    "Cash": "cash",
    "Alternative": "alternatives",
    "Alternatives": "alternatives",
}

CURRENCIES: tuple[str, ...] = ("EUR", "USD", "CHF")

_DEFAULT_W_MAX = 0.40  # cap per-strumento (rete di sicurezza, come prima)


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
    bands: dict[str, Band]          # gruppo → banda (tutti e 5 i gruppi)
    benchmark: str


@dataclass(frozen=True)
class Benchmark:
    label: str
    composition: dict[str, float]   # gruppo → peso (somma ~1)


@dataclass(frozen=True)
class ProfilesConfig:
    profiles: dict[str, ProfileConfig]
    benchmarks: dict[str, Benchmark]
    placeholder: bool
    currencies: tuple[str, ...]
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


# --------------------------------------------------------------------------- #
# Caricamento
# --------------------------------------------------------------------------- #
def default_config_path() -> Path:
    """``config/risk_profiles.json`` nella root del motore (override: env var)."""
    env = os.getenv("AA_RISK_PROFILES_CONFIG")
    if env:
        return Path(env)
    # profiles.py = src/aa_engine/profiles.py → parents[2] = engine/
    return Path(__file__).resolve().parents[2] / "config" / "risk_profiles.json"


def _validate_grid(profile_id: str, bands: dict[str, Band]) -> None:
    """Feasibility di una griglia (spec §2): messaggi chiari, niente crash."""
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
        issues.append(f"somma dei minimi {sum_min:.2f} > 100% (i minimi da soli sforano)")
    if sum_max < 1.0 - 1e-9:
        issues.append(f"somma dei massimi {sum_max:.2f} < 100% (non si arriva a investire tutto)")
    if issues:
        raise ProfileConfigError(
            f"Profilo '{profile_id}' infeasibile: " + "; ".join(issues) + "."
        )


def _parse(raw: dict, source: str) -> ProfilesConfig:
    if "profiles" not in raw:
        raise ProfileConfigError("Config profili: manca la chiave 'profiles'.")
    profiles: dict[str, ProfileConfig] = {}
    for p in raw["profiles"]:
        try:
            pid = p["id"]
            bands = {g: Band(float(p["bands"][g]["min"]), float(p["bands"][g]["max"]))
                     for g in p["bands"]}
        except (KeyError, TypeError, ValueError) as exc:
            raise ProfileConfigError(f"Profilo malformato: {exc}") from exc
        _validate_grid(pid, bands)
        profiles[pid] = ProfileConfig(
            id=pid, label=p.get("label", pid), bands=bands,
            benchmark=p.get("benchmark", ""),
        )
    benchmarks = {
        bid: Benchmark(label=b.get("label", bid),
                       composition={k: float(v) for k, v in b.get("composition", {}).items()})
        for bid, b in raw.get("benchmarks", {}).items()
    }
    return ProfilesConfig(
        profiles=profiles, benchmarks=benchmarks,
        placeholder=bool(raw.get("_placeholder", False)),
        currencies=tuple(raw.get("currencies", CURRENCIES)),
        source=source,
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
# Da config → vincoli di ottimizzazione (gruppi)
# --------------------------------------------------------------------------- #
def group_map(acmap: dict[str, str]) -> dict[str, str]:
    """ticker → gruppo (a partire da ticker → asset class dell'universo)."""
    return {t: GROUP_OF_ASSET_CLASS.get(ac, "alternatives") for t, ac in acmap.items()}


def constraints_for(
    profile_id: str,
    acmap: dict[str, str],
    *,
    config: ProfilesConfig | None = None,
    w_max: float = _DEFAULT_W_MAX,
) -> PortfolioConstraints:
    """``PortfolioConstraints`` con bande di gruppo dalla config del profilo.

    Le bande diventano cap+floor per gruppo; ``asset_class_map`` mappa i ticker
    sui gruppi così la macchina di vincoli esistente (Riskfolio + enforce_caps)
    le applica senza modifiche. I floor di gruppi assenti dall'universo vengono
    ignorati a valle (vedi ``enforce_caps``).
    """
    cfg = config or load_profiles()
    prof = cfg.profile(profile_id)
    gmap = group_map(acmap)
    present = set(gmap.values())
    caps = {g: prof.bands[g].max for g in GROUPS if g in prof.bands}
    floors = {g: prof.bands[g].min for g in GROUPS if g in prof.bands and prof.bands[g].min > 0}
    return PortfolioConstraints(
        w_max=w_max,
        asset_class_caps=caps,
        asset_class_floors={g: v for g, v in floors.items() if g in present},
        long_only=True,
        asset_class_map=gmap,
    )


def benchmark_weights(
    profile_id: str,
    acmap: dict[str, str],
    *,
    config: ProfilesConfig | None = None,
) -> dict[str, float]:
    """Pesi del benchmark a livello di strumento (peso del gruppo / # membri).

    I gruppi del benchmark senza strumenti nell'universo vengono ridistribuiti
    pro-quota sui gruppi presenti (il benchmark resta investito al 100%).
    """
    cfg = config or load_profiles()
    prof = cfg.profile(profile_id)
    bm = cfg.benchmarks.get(prof.benchmark)
    if bm is None:
        return {}
    gmap = group_map(acmap)
    members: dict[str, list[str]] = {}
    for t, g in gmap.items():
        members.setdefault(g, []).append(t)

    comp = {g: w for g, w in bm.composition.items() if members.get(g)}
    total = sum(comp.values())
    if total <= 0:
        n = len(acmap)
        return {t: round(1.0 / n, 6) for t in acmap} if n else {}
    weights: dict[str, float] = {}
    for g, w in comp.items():
        share = (w / total)
        for t in members[g]:
            weights[t] = round(share / len(members[g]), 6)
    return weights
