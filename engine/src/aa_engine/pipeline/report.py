"""Report dimostrativo della pipeline (Fase 4) — Markdown + HTML minimale.

Ricalca in versione minima la struttura dei report AlgoEagle. Niente LaTeX/grafici
(fase successiva): chiaro e completo, ma semplice. Sei sezioni (spec §3).
"""

from __future__ import annotations

import re

from .run import AllocationResult

_ARROW = {1: "▲ long", -1: "▼ short", 0: "• neutro"}


def _dir(cell: dict) -> str:
    return f"{_ARROW[cell['direction']]} ({cell['probability']:.2f})"


def _pct(x: float) -> str:
    return f"{x * 100:.2f}%"


def render_markdown(res: AllocationResult) -> str:
    L: list[str] = []

    # 1. Intestazione
    L += [
        f"# Report di Allocazione — profilo {res.profile.capitalize()}",
        "",
        f"- **Valuta**: {res.currency}",
        f"- **Data (as of)**: {res.as_of}",
        f"- **Modelli attivi nell'ensemble**: {res.n_models_active}",
        "",
    ]

    # 2. Executive summary (una riga per asset class)
    L += ["## Executive summary", "", "| Asset class | Regime | Postura (peso) |", "|---|---|---|"]
    for ac, reg in res.regimes.items():
        w = res.asset_class_weights.get(ac, 0.0)
        posture = "sovrappeso" if w >= 0.25 else ("sottopeso" if w < 0.10 else "neutro")
        L.append(f"| {ac} | {'🟢 bull' if reg == 'bull' else '🔴 bear'} | {posture} ({_pct(w)}) |")
    L.append("")

    # 3. Tabella segnali
    L += ["## Segnali per strumento", "",
          "| Strumento | Trend | Oscillator | Alpha Crash | SUMMARY |", "|---|---|---|---|---|"]
    for s in res.signals:
        L.append(
            f"| {s['ticker']} | {_dir(s['trend'])} | {_dir(s['oscillator'])} | "
            f"{_dir(s['alpha_crash'])} | **{_dir(s['summary'])}** |"
        )
    L += ["", "_A.I. (SVM) disattivato: non batte il baseline out-of-sample._", ""]

    # 4. Allocazione finale
    L += ["## Allocazione finale", "", "**Per strumento**", "", "| Strumento | Peso |", "|---|---|"]
    for t, w in sorted(res.final_weights.items(), key=lambda kv: -kv[1]):
        L.append(f"| {t} | {_pct(w)} |")
    L += ["", "**Per asset class**", "", "| Asset class | Peso |", "|---|---|"]
    for ac, w in sorted(res.asset_class_weights.items(), key=lambda kv: -kv[1]):
        L.append(f"| {ac} | {_pct(w)} |")
    if res.discarded:
        L += ["", f"_Strumenti scartati dalla selezione (regime): {', '.join(res.discarded)}._"]
    L.append("")

    # 5. Pannello di rischio
    r = res.risk
    L += ["## Pannello di rischio", "", "| Metrica | Valore |", "|---|---|",
          f"| Volatilità (StdDev) | {_pct(r['std_dev'])} |",
          f"| VaR 95% | {_pct(r['var_95'])} |",
          f"| CVaR 95% | {_pct(r['cvar_95'])} |",
          f"| Max Drawdown | {_pct(r['max_drawdown'])} |",
          f"| Calmar | {r['calmar']:.2f} |",
          f"| Sharpe | {r['sharpe']:.2f} |", ""]

    # 6. Dietro le quinte
    L += ["## Dietro le quinte", "",
          f"**Modelli scelti dall'ensemble** (4 migliori via walk-forward OOS): "
          f"{', '.join(res.selected_models)}."]
    if res.excluded_models:
        L.append(f"Modelli esclusi (non convergenti): {', '.join(res.excluded_models)}.")
    L += ["", "---", "_Report dimostrativo — backbone campione, nessun dato live._"]

    return "\n".join(L) + "\n"


def render_html(res: AllocationResult) -> str:
    """HTML minimale (converte il markdown generato sopra)."""
    body = _md_to_html(render_markdown(res))
    return (
        "<!doctype html><html lang='it'><head><meta charset='utf-8'>"
        f"<title>Allocazione — {res.profile}</title><style>"
        "body{font-family:system-ui,sans-serif;max-width:820px;margin:2rem auto;color:#1a1a1a}"
        "table{border-collapse:collapse;margin:.5rem 0}"
        "th,td{border:1px solid #ddd;padding:.35rem .6rem;text-align:left}"
        "th{background:#f4f4f5}h1{border-bottom:2px solid #eee}</style></head><body>"
        + body + "</body></html>"
    )


def _md_to_html(md: str) -> str:
    """Conversione minimale del subset di markdown usato (heading, tabelle, bold)."""
    html: list[str] = []
    rows: list[str] = []

    def flush_table():
        if not rows:
            return
        head = rows[0]
        cells = [c.strip() for c in head.strip("|").split("|")]
        out = ["<table><thead><tr>" + "".join(f"<th>{_inline(c)}</th>" for c in cells) + "</tr></thead><tbody>"]
        for row in rows[2:]:                       # salta la riga separatrice |---|
            cs = [c.strip() for c in row.strip("|").split("|")]
            out.append("<tr>" + "".join(f"<td>{_inline(c)}</td>" for c in cs) + "</tr>")
        out.append("</tbody></table>")
        html.append("".join(out))
        rows.clear()

    for line in md.splitlines():
        if line.startswith("|"):
            rows.append(line)
            continue
        flush_table()
        if line.startswith("# "):
            html.append(f"<h1>{_inline(line[2:])}</h1>")
        elif line.startswith("## "):
            html.append(f"<h2>{_inline(line[3:])}</h2>")
        elif line.strip() == "---":
            html.append("<hr>")
        elif line.startswith("- "):
            html.append(f"<p>{_inline(line[2:])}</p>")
        elif line.strip():
            html.append(f"<p>{_inline(line)}</p>")
    flush_table()
    return "\n".join(html)


def _inline(text: str) -> str:
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return re.sub(r"_(.+?)_", r"<em>\1</em>", text)
