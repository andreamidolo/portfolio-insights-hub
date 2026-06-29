"""Import di modelli/benchmark da estratti 'Situazione Patrimoniale' (AlgoEagle).

Legge un file Excel come ``Model.xlsx`` / ``Benchmark.xlsx`` (export con righe
macro A01/B01/C01/E01/G01/I01 e colonna 'Peso'), ne ricava i pesi per MACRO-CLASSE
canonica, li normalizza a un target strategico long-only (somma 1, niente leva) e
aggiorna ``config/risk_profiles.json`` per un dato profilo×valuta.

Allineato alla tassonomia del motore (vedi optimization.sample.MACRO_CLASS):
5 macro-classi = equity, fixed_income, alternatives, commodities, cash.

CLI:
    python -m aa_engine.config_tools FILE.xlsx --profile medium --currency USD \
           --kind model            # dry-run: stampa il target estratto e il confronto
    ... --apply                    # scrive davvero in config/risk_profiles.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

CLASSES = ["equity", "fixed_income", "alternatives", "commodities", "cash"]

# Codice Asset Class macro (AlgoEagle) -> macro-classe canonica.
ALGOEAGLE_MACRO: dict[str, str] = {
    "A01": "cash",          # Liquidità
    "B01": "cash",          # Mercato Monetario
    "C01": "fixed_income",  # Obbligazioni
    "E01": "equity",        # Azioni
    "G01": "alternatives",  # Investimenti Alternativi
    "I01": "commodities",   # Materie Prime
}

# Ampiezza bande per classe (target ± width), coerente con la config v2/v3.
BAND_W = {"equity": 0.10, "fixed_income": 0.10, "alternatives": 0.04,
          "commodities": 0.03, "cash": 0.08}


class ImportError_(ValueError):
    """File non interpretabile: messaggio per l'utente finale."""


def _find_header(rows: list[tuple]) -> tuple[int, dict[str, int]]:
    """Trova la riga di intestazione e mappa nome-colonna -> indice."""
    for i, r in enumerate(rows):
        labels = {str(v).strip(): j for j, v in enumerate(r) if v is not None}
        if "Cod Tit" in labels and "Peso" in labels:
            return i, labels
    raise ImportError_("Intestazione non trovata (servono colonne 'Cod Tit' e 'Peso').")


def parse_statement(path: str | Path) -> dict[str, float]:
    """Estrae i pesi (frazioni) per macro-classe canonica da un export AlgoEagle.

    Somma le righe macro (Cod Tit in A01/B01/.../I01). I pesi del file sono in %.
    Può restituire valori negativi (es. liquidità a leva): la pulizia avviene in
    :func:`strategic_target`.
    """
    try:
        import openpyxl
    except ImportError as exc:  # pragma: no cover
        raise ImportError_("Serve 'openpyxl' (pip install openpyxl).") from exc

    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb.worksheets[0]
    rows = list(ws.iter_rows(values_only=True))
    _, cols = _find_header(rows)
    c_cod, c_peso = cols["Cod Tit"], cols["Peso"]

    out: dict[str, float] = {c: 0.0 for c in CLASSES}
    found = False
    for r in rows:
        cod = r[c_cod] if c_cod < len(r) else None
        if cod is None:
            continue
        macro = ALGOEAGLE_MACRO.get(str(cod).strip())
        if macro is None:
            continue
        w = r[c_peso] if c_peso < len(r) else None
        if not isinstance(w, (int, float)):
            continue
        found = True
        # Le righe negative sono finanziamento/leva (es. scoperto di liquidità):
        # per un target strategico long-only le scartiamo, tenendo le posizioni
        # positive reali (es. il money market). La normalizzazione fa il resto.
        if w < 0:
            continue
        out[macro] += float(w) / 100.0  # da % a frazione
    if not found:
        raise ImportError_("Nessuna riga macro (A01/B01/C01/E01/G01/I01) trovata.")
    return out


def _round2_sum1(t: dict[str, float]) -> dict[str, float]:
    r = {c: round(t[c], 2) for c in CLASSES}
    resid = round(1.0 - sum(r.values()), 2)
    if abs(resid) >= 0.01:
        cmax = max(CLASSES, key=lambda c: r[c])
        r[cmax] = round(r[cmax] + resid, 2)
    return r


def strategic_target(raw: dict[str, float]) -> dict[str, float]:
    """Pulisce i pesi grezzi → target strategico long-only (somma 1, niente leva)."""
    pos = {c: max(0.0, raw.get(c, 0.0)) for c in CLASSES}  # via la leva (negativi)
    s = sum(pos.values()) or 1.0
    return _round2_sum1({c: pos[c] / s for c in CLASSES})


def bands_for(target: dict[str, float]) -> dict[str, dict[str, float]]:
    return {c: {"min": round(max(0.0, target[c] - BAND_W[c]), 2),
                "max": round(min(1.0, target[c] + BAND_W[c]), 2)} for c in CLASSES}


def update_config(config_path: str | Path, *, profile: str, currency: str,
                  kind: str, target: dict[str, float]) -> None:
    """Scrive target+bande nella cella (profilo×valuta) di model o benchmark."""
    path = Path(config_path)
    cfg = json.loads(path.read_text())
    if kind == "model":
        node = cfg["models"][profile][currency]
    elif kind == "benchmark":
        node = cfg["benchmarks"][f"bm_{profile}"][currency]
    else:
        raise ImportError_("kind deve essere 'model' o 'benchmark'.")
    node["target"] = target
    node["bands"] = bands_for(target)
    path.write_text(json.dumps(cfg, indent=2, ensure_ascii=False))


def _default_config() -> Path:
    return Path(__file__).resolve().parents[2] / "config" / "risk_profiles.json"


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Importa model/benchmark da export AlgoEagle.")
    ap.add_argument("file", help="Excel 'Situazione Patrimoniale'")
    ap.add_argument("--profile", required=True, choices=["low", "moderate", "medium", "high"])
    ap.add_argument("--currency", required=True, choices=["EUR", "USD", "CHF"])
    ap.add_argument("--kind", required=True, choices=["model", "benchmark"])
    ap.add_argument("--config", default=str(_default_config()))
    ap.add_argument("--apply", action="store_true", help="scrive davvero (default: dry-run)")
    args = ap.parse_args(argv)

    raw = parse_statement(args.file)
    tgt = strategic_target(raw)
    print("Pesi grezzi (frazione):", {c: round(raw[c], 4) for c in CLASSES})
    print("Target strategico     :", tgt, " Σ=", round(sum(tgt.values()), 2))

    cfg = json.loads(Path(args.config).read_text())
    node = (cfg["models"] if args.kind == "model" else cfg["benchmarks"])
    key = args.profile if args.kind == "model" else f"bm_{args.profile}"
    cur = node[key][args.currency]
    print(f"Config attuale {args.kind} {args.profile}/{args.currency}:", cur["target"])

    if args.apply:
        update_config(args.config, profile=args.profile, currency=args.currency,
                      kind=args.kind, target=tgt)
        print(f"\n✓ Scritto in {args.config}")
    else:
        print("\n(dry-run: rilancia con --apply per scrivere)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
