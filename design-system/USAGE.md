# LFG design system — come lo usa la dashboard

Riferimento del design system multi-brand di LFG Holding (brand `lfa`,
`lfg-zest`, `lfg-holding`). La dashboard usa il brand **`lfg-zest`** (Wealth &
Fund Management): burgundy `#83021A` + sand/taupe + neutri su cream, font
**Raleway**.

## Cosa usiamo (token + componenti, non ricreati a mano)

- **Token / palette**: tradotti negli alias semantici Tailwind in
  [`src/styles.css`](../src/styles.css) — i raw token `--lfgz-*` alimentano
  `--primary`, `--surface-card`, `--text-body`, ecc. La UI è autorata SOLO contro
  gli alias semantici, mai contro un colore di brand diretto (anti-contaminazione).
- **Tipografia**: Raleway (display + body), eyebrow/label UPPERCASE con
  letter-spacing ampio (`.ds-eyebrow`), numerali grandi e thin (`.ds-numeral`).
- **Data-viz**: tema `lfg-zest` (burgundy primario, sand/oro + teal/navy di
  supporto), implementato con `recharts` in
  [`src/components/dashboard/charts.tsx`](../src/components/dashboard/charts.tsx)
  e i colori in [`src/lib/lfg-theme.ts`](../src/lib/lfg-theme.ts). Niente
  arcobaleni; positivo/bull = teal, negativo/bear = burgundy.
- **Componenti**: StatCard, eyebrow, tabelle editoriali (hairline, header
  UPPERCASE, numeri allineati a destra) sono adattati in
  `src/components/dashboard/ui.tsx`.

## Switch di brand

`data-brand="lfg-zest"` è impostato sul tag `<html>`
([`src/routes/__root.tsx`](../src/routes/__root.tsx)). Definendo un altro layer
di brand (`[data-brand="..."]`) con gli stessi alias semantici si potrebbe
ri-skinnare tutto senza toccare i componenti.

## Nota sul contenuto

Le **immagini demo** del brand LFA (foto marketing: Zurigo, castelli, orologi —
~4 MB) sono state **rimosse** da questa copia: non servono alla dashboard, che
usa solo token, guidelines, chart-theme e componenti. Il design system originale
completo resta la fonte di verità presso LFG.
