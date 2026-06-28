# LFA Templates — Structure & Layout Playbook
### How these templates are built, abstracted from the LFA visual style

> **Purpose.** This is a *structural* reference for porting the **architecture, layout rhythm and spacing system** of the LFA templates (Institutional Brochure, Investment Process, One-Pager) into another design system — e.g. **LFGZEST** — **without** copying LFA's visual style. Keep your own colours, fonts, logo and imagery. Borrow the *bones*: how a slide is composed, how space is used, how rhythm and depth are created so pages never feel flat.
>
> The recurring complaint with flat decks ("piatte, spazi piatti") is almost never the colour palette — it's the **absence of structural devices**: no asymmetry, no hierarchy anchor, no alternation, no breathing room, no layering. This guide is the checklist for fixing exactly that.

---

## 1. File & folder architecture

Each template is a **self-contained folder** under `templates/<slug>/`. One folder = one deliverable type.

```
templates/
  brochure/
    Brochure.dc.html        ← the template (entry file, PascalCase of slug)
    ds-base.js              ← loads the design system (1 line to edit when porting)
    support.js              ← runtime (generated; never hand-edit)
  investment-process/
    InvestmentProcess.dc.html
    ds-base.js
    support.js
  one-pager/
    OnePager.dc.html
    ds-base.js
    support.js
  STRUCTURE-GUIDE.md        ← this file
```

**Rules that make this portable:**

1. **Entry file** carries `<!-- @template name="…" description="…" -->` as its first line. That one comment is what registers it as a starting point others can pick.
2. **`ds-base.js`** is the *only* coupling to the design system. It injects the global stylesheet(s) + the compiled bundle. Porting = change one `base` path and the list of stylesheets:
   ```js
   const base = '../..';                 // → point at your DS root / bound folder
   for (const p of ['styles.css']) { … } // → list YOUR global stylesheets
   ```
3. **Everything visual is driven by CSS variables / design tokens**, never hard-coded values scattered in markup. Swap the token layer → the whole template re-skins. (See §7.)
4. **`support.js` is machine-generated** — copy it as-is, don't touch.

> Net effect: a consuming project edits **one line** in `ds-base.js` and the template renders in *their* style. The structure below is what they keep.

---

## 2. The two output formats

| Template | Canvas | Print target | Use when |
|---|---|---|---|
| Brochure / Investment Process | **1280 × 720 stacked slides** (16:9) | A4 **landscape**, one slide per page | Narrative presentations, sections, charts |
| One-Pager | **794 × 1123** single sheet (A4 portrait) | A4 **portrait** | A single dense leave-behind |

**Slide-deck scaffold (the spine of both decks):**

```css
.slide   { position:relative; width:1280px; height:720px; overflow:hidden; }   /* fixed canvas */
.slide.dark { background: <brand-dark>; color:#fff; }                          /* two-tone variant */
.pad     { padding:58px 76px; height:100%; display:flex; flex-direction:column; } /* the inner frame */
@page    { size:A4 landscape; margin:0; }
@media print { .slide { break-after:page; } .<doc> { zoom:.876; } }            /* 1280px → A4 */
```

Key ideas, all style-independent:
- **Fixed pixel canvas** (not responsive) → predictable, print-perfect composition.
- **One padding constant** (`58px 76px` here) applied via a single `.pad` class → every slide shares the same margin frame. *This single decision is the biggest anti-"flat" lever: consistent generous breathing room.*
- **`zoom` on print** maps the 1280-wide canvas onto A4 with no reflow.

---

## 3. Slide taxonomy — the "system"

The deck is built from **a small set of slide archetypes**, reused with rhythm. This is what makes it read as a designed system rather than a pile of slides. Define your own equivalents:

| Archetype | Role | Structural signature |
|---|---|---|
| **Cover** | Open | Asymmetric split: ~44% artwork band ∣ title panel. (See §4.) |
| **Contents** | Orient | 2-column index, big serif numerals, hairline rule per row. |
| **Section divider** | Chapter break | **Dark** full-bleed, oversized ghost number, centered title. (See §5.) |
| **Content slide** | Carry information | `eyebrow → title → rule → body`; 2–4 column grids or card rows. |
| **Data / chart slide** | Show numbers | Live chart blocks in bordered panels on a grid. (See §6.) |
| **Statement slide** | Breathe / emphasize | One large italic pull-quote, lots of empty space. |
| **Back cover** | Close | Mirror of cover: contact panel ∣ artwork band (band on opposite side). |

**Rhythm rule:** alternate **dark dividers** with **light content runs**. Each numbered section = 1 dark divider + 3–6 light slides. The alternation alone creates pace and stops monotony — independent of palette.

---

## 4. The cover system (asymmetric split)

The single most "premium, not flat" device. **Never** a full-bleed photo with text floating on a scrim — that reads flat. Instead, a hard vertical split:

```
┌───────────────┬──────────────────────────────┐
│               │  [logo]                       │
│   ARTWORK     │                               │
│   BAND        │  EYEBROW (accent, tracked)    │
│   (~44%)      │  Big italic-serif Title       │
│               │  ── short accent rule         │
│   full-bleed  │  Lead paragraph (max ~42ch)   │
│   image /     │                               │
│   pattern     │  CONFIDENTIAL · DATE          │
│               │  www · email                  │
└───────────────┴──────────────────────────────┘
```

```html
<section class="slide" style="padding:0;">
  <div style="display:flex;height:100%;">
    <div style="width:44%;flex:none;position:relative;overflow:hidden;">
      <img src="<your-cover-art>" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
    </div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 72px;">
      <img src="<your-logo>" style="height:58px;align-self:flex-start;margin-bottom:52px;">
      <div class="eyebrow">Eyebrow · Date</div>
      <h1 class="cover-title">Document Title</h1>
      <p class="cover-lead">One-sentence positioning line.</p>
      <div class="cover-meta">Private &amp; Confidential · 2026</div>
      <div class="cover-web">www · email</div>
    </div>
  </div>
</section>
```

- **Back cover mirrors the front:** put the panel on the *left* and the artwork band on the *right* (different artwork than the front). Bookends the document.
- Band width 40–46% feels right. Below 35% it looks like a stripe; above 50% it crowds the title.
- The band carries the brand "texture" (pattern, photography, geometry). Swap the asset, keep the split.

---

## 5. Section dividers (depth via scale + tone)

```html
<section class="slide dark">
  <div class="ghostnum" style="right:40px;bottom:-90px;font-size:520px;opacity:.10;">01</div>
  <div class="pad" style="justify-content:center;">
    <p class="eyebrow">Section 01</p>
    <h2 class="divider-title">The Investment Philosophy</h2>
    <hr class="rule">
    <p class="divider-sub">One line previewing the section.</p>
  </div>
</section>
```

Three style-independent depth tricks here:
1. **Tone flip** — dividers are dark; content is light. Instant chapter signal.
2. **Ghost numeral** — a huge (≈520px) low-opacity number bleeding off a corner. Creates a background layer and scale contrast for *free* (no decoration, no clip-art).
3. **Vertical centering** — divider content sits centered, content slides start top-aligned. The change in vertical anchor reinforces "this is a break."

---

## 6. Content-slide anatomy (the anti-flat checklist)

Every content slide follows the same hierarchy spine:

```
eyebrow            ← small, tracked, accent colour, ALL CAPS  (the "kicker")
Title              ← large italic serif (or your display face)
── rule            ← short 56×3px accent bar — the recurring anchor
[ body region ]    ← grid of columns / cards / list rows
footer             ← left label ∣ right page-ref, hairline colour
```

What keeps the body region from going flat — **use at least two of these per slide**:

- **Grids with `gap`, not inline blocks.** 2/3/4-column `display:grid; gap:18–30px`. Explicit gaps = even rhythm.
- **Card duality.** Mix *outlined* cards (`border:1px solid line; background:paper`) with the occasional *filled* card (`background:<dark>; color:#fff`) to spotlight one item. The filled card in a row of outlined ones creates focal depth.
- **Number-led items.** Lead list/step items with a big serif numeral (`01`, `02`) in the accent colour. Cheap structure, strong rhythm.
- **Top-border accents.** `border-top:3px solid accent` on stat/step columns instead of full boxes — lighter, more editorial than boxing everything.
- **Constrained measure.** Body text capped at `max-width: ~92–108ch` (and leads ~42ch). Never let paragraphs run the full 1128px — that's a primary flatness cause.
- **Pull-quote breaks.** Every few slides, a single large italic statement with a left accent border and generous margins. Whitespace *is* the design.
- **Consistent vertical flow.** `flex-direction:column` + `flex:1` on the body region so footers pin to the bottom and content distributes — no floating, no dead bottom gaps.

**Spacing scale used (px):** `6 · 12 · 14 · 18 · 22 · 26 · 30 · 38 · 48`. Pick a scale and *stay on it*. Arbitrary one-off margins are what make spacing feel "piatta."

---

## 7. Tokenization (so style stays separable)

Every colour/size/font references a variable. The template body never names a brand hex directly:

```css
.<doc>{
  --accent:    <brand-accent>;
  --ink:       <brand-text>;
  --navy:      <brand-primary>;
  --navy-500:  <muted text>;
  --navy-300:  <faint text / captions>;
  --line:      <hairline border>;
  --paper:     <subtle fill for cards>;
}
```

- **Type roles, not faces:** `display/serif` for titles, `sans` for body, `mono` for figures. Map your fonts onto the roles; the markup doesn't change.
- **Accent rule, eyebrow, ghost number, footer** all read from these vars → re-skin in one place.
- This is the contract that lets LFGZEST keep its **own distinct look** while inheriting the structure: *swap the token layer, keep the markup.*

---

## 8. Live charts (data slides that aren't flat)

Charts are **live (ECharts), not images** — data is editable in the logic class.

- A shared `theme()` maps **chart colours/fonts onto the same tokens** → charts always match the deck.
- An `axis()` helper standardizes axis styling (hairline splitlines, muted labels, no ticks) so every chart looks like one family.
- Charts live inside **bordered panel cards** on a grid (same card vocabulary as content slides) — never floating on white.
- **Init guard:** create the chart only once the container has height (flex children measure 0 before layout), then `resize()` after render. Re-run on update.

```js
theme(){ return { ink:'var', grid:'var', axis:'var', cat:[…brand series…], accent:'var' }; }
init(id){ /* dispose-if-exists, skip if !clientHeight, echarts.init, store */ }
```

Port the *pattern* (token-driven theme + panel placement + init guard); plug your palette into `cat[]`.

---

## 9. The Design-Component mechanism (why these are `.dc.html`)

These templates are **Design Components**, which is what lets them (a) render standalone in a browser *and* (b) import the design system's real components. Structurally:

- **Template markup** = ordinary, directly-editable HTML between `<x-dc>`…`</x-dc>`. Headings, paragraphs, `<section>` slides are click-editable.
- **Logic class** (`class Component extends DCLogic`) holds data + chart code; `renderVals()` exposes values the template fills via `{{ dotted.paths }}`.
- **Control flow** via `<sc-for list="{{ items }}" as="x" hint-placeholder-count="N">` and `<sc-if>` — always set the `hint-*` so it paints while streaming.
- **Props metadata** (`data-props` JSON) turns chosen fields into editor tweaks (e.g. an accent-colour swatch).
- **Styling is inline** so the page paints from the first character (no FOUC); only `@font-face`/`@keyframes` go in `<helmet><style>`.

For a consuming design system the takeaway is the **split**: editable structural markup ∣ data/behaviour in a class ∣ style in tokens. That separation is what keeps templates both editable and on-brand.

---

## 10. Porting checklist for LFGZEST

1. **Copy** `templates/<slug>/` folders as a starting structure.
2. **Repoint** `ds-base.js`: set `base` to your DS, list your global stylesheet(s).
3. **Remap tokens** (§7) to LFGZEST colours, fonts (display/sans/mono), radii, hairline.
4. **Swap brand assets**: logo, cover artwork bands (front + back), any imagery — keep the **44% split**, the **ghost-number dividers**, the **eyebrow→title→rule** spine.
5. **Keep the spacing scale & `.pad` constant** (§2, §6). If your decks feel flat, this + the divider tone-flip + asymmetric cover are the fixes.
6. **Keep the slide taxonomy & alternation rhythm** (§3): dark divider → light content run → data slide → statement.
7. **Reuse the chart pattern** (§8) with your palette in `cat[]`.
8. **Do not** copy LFA colours, fonts, or the geometric Swiss artwork — those stay LFA's. Structure transfers; style does not.

---

*Generated as a structural reference. Pair it with the three `.dc.html` files in this folder as worked examples — read them for the concrete markup behind every pattern above.*
