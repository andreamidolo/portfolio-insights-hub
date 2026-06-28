# Prompt 02 — Front-end (repo unica portfolio-insights-hub)

**Repo unica.** Il front-end e il motore vivono nella **stessa repo**
`portfolio-insights-hub`: il front-end React/Vite alla radice (scaffold Lovable),
il motore Python in `engine/`. Si parlano via API in locale (vedi
`docs/05_api_contract.md`). **Claude Code sviluppa entrambi** e può ristrutturare
la repo in totale autonomia. **Lovable** resta un aiuto opzionale per la parte
visuale, da usare dove/quando è comodo — non è un binario separato.

Il prompt qui sotto è quello con cui è stata generata la prima UI in Lovable;
serve come riferimento del risultato atteso. Da qui in avanti il front-end lo
evolve Claude Code.

---

## Prompt di riferimento (UI giorno 1)

```
Create a clean, professional internal dashboard for a quantitative asset 
allocation engine used by a wealth management firm. This is an internal tool, 
not a marketing site — prioritize clarity and data density over decoration.

PAGE 1 — "Risk Panel"
A portfolio risk dashboard showing:
- A header with the portfolio name and a risk-profile selector 
  (Moderate / Balanced / Aggressive) and a currency selector (EUR / USD).
- A table of risk metrics grouped into three sections: 
  "Return-based", "Tail risk", and "Drawdown-based". 
  Each row: metric name, value, and a "Return/Risk" ratio column.
- A few summary stat cards at the top: Cumulative Return, Sharpe Ratio, 
  Max Drawdown, Volatility.
- A market-regime indicator strip showing Bull/Bear status per asset class 
  (Equity, Fixed Income, Dollar, Commodities, Gold) — green for Bull, red for Bear.

Use mock/placeholder data for now (I'll connect a real API later). 
Structure the code so the data comes from a single typed data service / 
mock file that can later be swapped for real API calls.

STYLE
- Sober, institutional: navy / slate / white, one accent color.
- Dense but readable tables, clear typography. No flashy gradients.
- Desktop-first.

Keep it to this one page for now. I'll add Portfolio Optimization and 
Backtesting pages later.
```

## Note

- I valori mock devono avere la **stessa forma** del payload in
  `docs/05_api_contract.md` §2.4 (così lo switch all'API vera è solo un cambio di
  URL). Puoi incollare a Lovable, come riferimento, l'esempio JSON di quel
  paragrafo.
- Le pagine "Optimization" e "Backtesting" si aggiungono in Fase 3, quando
  esisteranno nel motore.

## Quando l'API del motore sarà viva

Il motore Python (in `engine/`) espone l'API in locale (es.
`http://localhost:8000/api/v1`). Nel data service del front-end, sostituire i mock
con chiamate a quegli endpoint secondo il contratto. Nessun'altra modifica alla UI.
