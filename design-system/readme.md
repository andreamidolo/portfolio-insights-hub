# LFG Holding Design System
### One system · two operating companies — *LFA* and *LFG+ZEST*

This design system encodes the **LFG Holding** group so design agents can produce
on-brand interfaces, decks, brochures, one-pagers and prototypes for either
operating company — **LFA** (the refreshed **lfa.ch** brand) or **LFG+ZEST** — from
one shared structural foundation, plus a rarely-used neutral **LFG Holding** layer.

Every document declares which brand it belongs to. The structure is shared; the
identity is swapped wholesale and **never blended** (see §0).

---

## 0 · Group structure — one system, three brand layers

**LFG Holding** is the parent. It contains two operating companies that go to
market with distinct identities, and a neutral holding-level voice used only for
group material:

| Brand value | Who | When to use | Frequency |
|---|---|---|---|
| `lfa` | **LFA — Lugano Financial Advisors SA** | Anything addressed to U.S. clients / the lfa.ch audience | Primary |
| `lfg-zest` | **LFG+ZEST** (Wealth & Fund Management) | Swiss/intl. wealth- & fund-management audience | Primary |
| `lfg-holding` | **LFG Holding** (the group) | Group-level / corporate / neutral material only | **Rare** |

### The principle — *one structure, swappable skins*

Everything that is **group-level or methodology-level** (slide geometry, the
investment-process flow, report & factsheet structure, cover/divider/footer
*logic*, chart & table placement, disclaimer placement, spacing & hierarchy)
lives **once**, in a shared, brand-neutral foundation. Everything that carries
**identity** (colour, logo, type, cover artwork, footer, contacts, voice) lives
in a **brand layer** that is swapped as a whole.

The shared layer never names a brand colour directly — it reads **brand slots**
(`--b-*`). Each brand layer fills those slots. Switching brand = re-pointing the
slots via one attribute on the root: `data-brand="lfa" | "lfg-zest" | "lfg-holding"`.

```css
/* Shared (structural) — reads only --b-* slots, never a brand value */
.cover .accent-rule { background: var(--b-accent); }
.ttl                { font-family: var(--b-font-display); }

/* Brand layers — each fills the SAME slots; never references another brand */
[data-brand="lfa"]      { --b-accent:#C24A5E; --b-font-display:'Cormorant Garamond',serif; }
[data-brand="lfg-zest"] { --b-accent:#83021A; --b-font-display:'Raleway',sans-serif; }
[data-brand="lfg-holding"] { --b-accent:#5A6678; --b-font-display:'Mulish',sans-serif; } /* neutral, provisional */
```

**Brand-slot reference**

| Slot | `lfa` | `lfg-zest` | `lfg-holding` (neutral) |
|---|---|---|---|
| `--b-ink` | `#23366E` navy | `#1E2225` charcoal | `#2A2E3A` graphite |
| `--b-accent` | `#C24A5E` rose | `#83021A` burgundy | `#5A6678` slate · *provisional* |
| `--b-ground` | navy gradient + band art | burgundy radial + Alpine watermark | flat navy / neutral · *provisional* |
| `--b-font-display` | Cormorant Garamond, italic | Raleway, light UPPERCASE | Mulish, semibold · *provisional* |
| `--b-font-body` | Mulish | Raleway | Mulish |
| `--b-radius` | `8px` | `14px` | `6px` · *provisional* |
| `--b-logo` | `logo-lfa-full.png` | LFG+ZEST lockup | LFG Holding mark · *needs supply* |
| `--b-footer` | `lfa.ch` | `LFGZEST.COM` | `lfg-holding.ch` · *needs confirm* |
| `--b-chart-theme` | `lfa` (navy/rose) | `lfg-zest` (burgundy/gold) | neutral · *provisional* |

> **`lfg-holding` is provisional.** The two operating companies are fully
> defined; the neutral holding identity is not yet a finished brand. Its slot
> values above are sensible neutral defaults — treat them as **needs-review** and
> replace once a holding-level brand is supplied. Because it is used rarely, this
> does not block LFA or LFG+ZEST work.

### How documents declare themselves

Each deck / proposal / template carries three data attributes on its root:

```html
<div data-brand="lfa"              <!-- lfa | lfg-zest | lfg-holding -->
     data-content-type="shared"    <!-- shared | lfa-only | lfg-zest-only | holding-only -->
     data-source="lfa">            <!-- where the DATA / numbers came from -->
```

- **`shared`** documents (e.g. the Investment Process) use the shared structure
  and can render in any brand — and may carry **brand-specific pages** that show
  only under their brand (`.only-lfa` / `.only-lfg-zest`). Numbers can also differ
  per brand (e.g. group AuM vs. LFA AuM).
- **`*-only`** documents are locked to one brand; the switch is disabled.

### Anti-contamination — enforced, not hoped

A single-brand document never loads another brand's logo, colours or fonts.
**No hybrid palette, no averaging of two brands, LFA is never replaced by
LFG+ZEST.** When a value is unknown (notably anything `lfg-holding`), render it
as **needs-review** rather than guessing.

> Working proofs of this architecture live in `proposals/` (the convertible
> Investment Process — one structure, brand switch, per-brand data, editable
> charts, brand-specific pages). They are drafts, kept **separate** from the live
> token/template/component sources.

---

## 1 · Company context

> **Scope note.** This section describes **LFA**, the primary operating company.
> LFG+ZEST is the sister operating company (Wealth & Fund Management, FINMA-
> authorised); its full brand context lives in the bound LFG+ZEST design system.
> LFG Holding is the neutral parent (see §0).

**LFA — Lugano Financial Advisors SA** is a Swiss, fee-based independent wealth
manager founded in **2009** by **Francesco Bernasconi** and **Siro Spellini**. In
**2010** it became one of the first Swiss firms registered with the **U.S. SEC** as
an Investment Adviser. LFA serves **U.S. investors exclusively** (resident in the
U.S. or abroad), delivering Swiss-based, cross-border wealth management structured
for U.S. tax reporting.

- **Part of LFG Holding** (LFG + ZEST) — one of Switzerland's largest independent
  wealth managers. ~CHF assets under management across the group, 20+ fund &
  portfolio managers, offices in **Zurich, Lugano, Sion** (+ USA, EU, Mexico
  group footprint).
- **Dual oversight:** SEC-registered (USA) + FINMA-licensed portfolio manager
  (Switzerland).
- **Values:** Accountability · Respect · Courage.
- **Offering:** Investment Management, International Wealth Planning, Alternative
  Investments, Family Office Services, Sports Division, Self-Directed IRAs.
  Delivered as **Discretionary Mandates** and **Advisory Mandates**.
- **Promise:** independent, open-architecture, relationship-driven, transparent
  fee-based advice; a Swiss "safe harbor" for globally diversified U.S. investors.

### Products / surfaces represented
| Surface | What it is | In this system |
|---|---|---|
| **lfa.ch website** (refreshed) | Public marketing site — About, What We Do, Who We Serve, Why LFA, Resources | `ui_kits/website/` (source of truth) |
| **LFA Brochure 2026** (PDF, 30pp) | Group / process / mandates brochure | text + assets extracted to `scraps/`, palette + tone informed by it |
| Future formats | One-pagers, two-pagers, refreshed brochure & investment-process deck | build with these tokens + components |

### Sources provided
- `uploads/LOGO LFA.PNG` — primary logo lockup.
- Website screenshots (refreshed site, **source of truth**): `HOME LFA.CH.png`,
  `About US LFA.png`, `LFA ABOUT US 2.png`, `WHAT DO WE DO.png`, `SERVICES.png`,
  `WHY LFA.png`.
- `uploads/LFA_Brochure - 2026.pdf` — 30-page brochure (text extracted; image
  pages did not rasterize in-tool — see Caveats).
- Live site: **www.lfa.ch** (not assumed accessible; stored for reference).

---

## 2 · CONTENT FUNDAMENTALS — how LFA writes

**Voice:** assured, calm, and quietly premium — a Swiss private bank's restraint
crossed with American clarity. Never salesy, never breathless.

- **Person:** addresses the reader as **"you"**, refers to the firm as **"we" / "LFA"**.
  ("*You can choose how involved you want to be.*" · "*We work primarily with U.S.
  investors…*")
- **Headlines are questions or quiet declaratives**, set in **italic serif**:
  - "*Your Swiss Guide to International Diversification*"
  - "*Why would a U.S. investor work with a Swiss-based wealth management firm?*"
  - "*What Makes LFA Different From Other Wealth Management Firms?*"
- **Casing:**
  - Display headlines → Title Case or sentence case, italic serif.
  - Labels / eyebrows / nav / feature titles → **ALL CAPS, letter-spaced**
    ("SEC REGISTERED", "PORTFOLIO MANAGEMENT OPTIONS", "WHO WE SERVE").
  - Body → sentence case.
- **Style:** "U.S." always punctuated. Swiss-specific nouns capitalized
  (Swiss Franc, Private Banks). Em-dashes for asides ("—not a model"). Short,
  structured paragraphs (2–4 sentences). Frequent parallel feature lists with a
  bold caps title + one explanatory sentence.
- **Tone words it leans on:** *diversification, independent, fee-based,
  transparent, tax-aware, discretion, stability, prudence, safe harbor,
  relationship, tailored, cross-border, open-architecture.*
- **Emoji:** never. **Exclamations:** essentially never. Icons are line icons,
  not decoration.
- **Recurring motifs in copy:** Swiss stability & the Swiss Franc; SEC + FINMA
  dual regulation; "single point of contact"; "sleep-well" / "safe harbor"
  reassurance; values triad *Accountability · Respect · Courage*.

> Writing test: would this sentence sit comfortably in a Swiss private-bank
> letter to a U.S. client? If it feels like an ad, rewrite it.

---

## 3 · VISUAL FOUNDATIONS

**Overall feel:** editorial, airy, photographic. White-dominant pages with
generous whitespace; one signature **italic serif** doing the emotional work; a
disciplined navy + Swiss-red palette; occasional **full-bleed dusty-rose
section** for emphasis. Premium, restrained, distinctly Swiss.

### Color
- **Navy `#23366E`** is the backbone — logo, headings, body text, dark sections.
- **Swiss red `#C31F3A`** — the bold cross in the logo; a precise accent, used
  sparingly (cross mark, small emphases). Not a fill color for big areas.
- **Rose / crimson `#C24A5E`** is the *working* accent: CTA text & borders,
  hover underlines, links, and the large editorial **rose section background
  `#C55466`** (the "What We Do" band).
- **Pastel diagram tints** — soft rose, pale blue `#D0E4ED`, sage `#BCD3D2`,
  steel `#60729B` — only inside the radial "Why LFA" wheel illustrations.
- Neutrals are cool and quiet: white, off-white `#F7F8FA`, hairline `#E0E4EB`.
- Imagery vibe: **warm, sunlit, optimistic** — golden-hour Zürich aerials, blue
  Swiss lakes & Alps, Bellinzona castles, watch macros. Real photography, never
  illustration-for-its-own-sake (the one illustration is a hand-drawn Swiss flag).

### Type
- **Display:** Cormorant Garamond — frequently *italic*, navy, large, calm.
  Signature of every hero and section title.
- **Body / UI:** Mulish — humanist sans, 400–700, comfortable 1.6 line-height.
- **Labels:** Mulish bold, ALL CAPS, `0.14em` tracking.
- Strong contrast between flowing serif headlines and tidy sans body is the
  core typographic tension. (Both are Google-Fonts substitutions — see Caveats.)

### Spacing & layout
- Big vertical rhythm (`--section-y: 96px`), readable `720px` text measure,
  `1200px` container. Two- and three-column feature grids. Centered headlines
  over centered intro paragraphs is a recurring section pattern.
- Sticky white top nav (`76px`), centered logo, links left & right, a single
  outlined rose **GET STARTED** pill at the right.

### Surfaces, borders, radii, shadow
- **Radii are subtle** (3–10px; pills only for buttons/tags) — this is a
  conservative, not bubbly, brand.
- **Cards:** white, hairline `1px #E0E4EB` border or a soft cool shadow
  (`--shadow-sm/md`), small radius. No heavy drop shadows, no colored
  left-border accent cards, no neon gradients.
- **Borders:** hairline cool-grey. Active tabs invert to solid navy fill with
  white text (see Services accordion). Inactive tabs are pale grey/blue.

### Motion & states
- **Motion is minimal and graceful:** gentle fades + small upward reveals on
  scroll, ~240ms, ease-out. No bounce, no parallax theatrics.
- **Hover:** links shift to deeper rose and the underline/arrow nudges right
  (`gap` grows); buttons fill or deepen. **Press:** slight darken, no big
  scale. Focus: soft rose ring.
- Use `prefers-reduced-motion` to disable reveals.

### Imagery treatment
- Full-bleed photographic heroes with a soft warm wash; text sits in clear
  space (often left third) in navy or white. Photos are warm and bright,
  never grainy or desaturated. Faint protection gradients only where text
  overlaps a busy photo.

---

## 4 · ICONOGRAPHY

LFA's site uses **thin, single-weight line icons** (globe, shield, dollar,
handshake, document, bank/columns, speech bubbles, thumbs-up, person-at-desk)
inside the radial "Why LFA / What Makes Us Different" wheels, plus a **`+`
expander** glyph on accordions. They are simple, geometric, navy or white,
~1.5px stroke — never filled, never multicolor, never emoji.

- **Recommended set:** **Lucide** (https://lucide.dev) — 1.5–2px stroke matches
  LFA's line weight closely. Load from CDN and color with `currentColor` in navy
  / rose / white. Mapping: `globe`, `shield`, `dollar-sign`, `handshake`,
  `file-text`, `landmark`, `messages-square`, `thumbs-up`, `user`, `plus`,
  `arrow-right`, `chevron-down`.
- **Substitution flag:** the site's exact icons are bespoke line drawings; Lucide
  is the closest open match (same stroke style). Swap to the licensed set if
  delivered.
- **The Swiss cross + 4-star mark** from the logo is the brand's signature
  glyph — prefer it over a generic icon wherever a brand stamp is needed.
  See `assets/logo-lfa-full.png`.
- **Emoji / unicode-as-icon:** never use.

---

## 5 · Index / manifest

**Root**
- `styles.css` — global entry (import this only).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`.
- `assets/` — `logo-lfa-full.png`, `img-hero-zurich.png`, `img-swiss-alps-lake.png`,
  `img-bellinzona-castle.png`, `img-market-analyst.png`, `illustration-swiss-flag.png`.
- `readme.md` (this file) · `SKILL.md` (portable Agent Skill).
- `scraps/` — extracted brochure text/notes (working material).

**Foundation cards** (Design System tab — `guidelines/`): color, type, spacing,
brand specimen `.html` cards.

**Components** (`components/`)
- `core/` — `Button`, `Eyebrow`, `Tag`, `Badge`
- `cards/` — `FeatureCard`, `StatCard`
- `navigation/` — `NavBar`, `MandateTabs`
- `layout/` — `SectionHeading`, `RoseSection`

**UI kit** (`ui_kits/website/`) — high-fidelity recreations of lfa.ch screens
(`index.html` + JSX screens).

**Templates** (`templates/`) — copy-and-fill starting documents. Each is a
`.dc.html` carrying a `data-brand` (`lfa` default). Current set:
`one-pager/`, `brochure/`, `investment-process/`, `wealth-depends-on/`.
Building a template convertible = drive its identity from `--b-*` slots so a
single `data-brand` swap re-skins it (see `proposals/` for the working pattern).

**Proposals / drafts** (`proposals/`) — architecture proofs kept **separate** from
the live sources: the LFG Holding binary-system proposal, and the convertible
Investment Process (LFA ⇄ LFG+ZEST switch, per-brand data, editable `<lfa-chart>`
charts, brand-specific pages). Promote into `templates/` once approved.

**Bound design systems** (`_ds/`) — the **LFG+ZEST** design system is bound here
(tokens, `_ds_bundle.js`, components). Read its real token/component values from
`_ds/lfg-zest-…/` rather than recreating them.

**Charts** (`charts/`) — `lfa-chart-engine.js` + `lfa-chart-studio.js`: the
`<lfa-chart>` element with the hover-to-edit Chart Studio. Carries both the `lfa`
(navy/rose) and `lfg-zest` (burgundy/gold) themes; pick via the `theme` attribute.

---

## 6 · LFG+ZEST — operating-company brand summary

The sister operating company has its **own full design system** (a separate
project): company context, content fundamentals, visual foundations, iconography
and templates — the same chapter structure as §§1–5 above. Here we keep only the
**bound tokens + bundle** (`_ds/lfg-zest-…/`) plus this on-page summary; read the
source DS for the authoritative detail (`readme.md` + `SKILL.md` there).

- **Company context.** LFG+ZEST SA — Swiss wealth- & fund-management boutique,
  FINMA-authorised, Lugano & Zurich. Part of **LFG Holding** (~CHF 2.5–3 bn AuM,
  700+ clients, ~55–60 people). Audiences: HNWI & families, professionals,
  institutions, corporate treasuries. Offering: Wealth Management, Fund
  Management (Zest UCITS SICAV + AIFs), Financial Structuring, plus segments
  (retirement / *Boutique della Previdenza*, sport & entertainment, US clients
  via LFA, impact, PE, real estate, gold, hedge funds).
- **Content fundamentals.** Institutional, measured, quietly confident — *"a
  pinnacle of wealth and fund management excellence."* "you / your family" ·
  "we / LFG+ZEST". Metaphors: *safe harbor, partners rather than clients*. Titles
  **UPPERCASE** tracked; **bilingual** (EN institutional, **IT** for Swiss
  retail/pension). Swiss number format (`CHF 750'000`, `37%`). Footer *"PRIVATE
  AND CONFIDENTIAL DOCUMENT — NOT INTENDED FOR DISTRIBUTION"* + FINMA disclaimer.
- **Visual foundations.** A **deep-red family**: logo crimson `#C72026`,
  presentation **burgundy `#83021A`**, maroon `#590112` (selected cards), oxblood
  `#45000B` (gradient floor) — on **white** / cream `#F9F4EE`, warmed by
  **sand/taupe** (`#D5C29A`, `#E9DDC9`, taupe `#9A8463`). Ink `#231F20`, silver
  numerals `#BDBCBD`. One typeface — **Raleway**, identity from *weight + tracking*
  (Light 300 UPPERCASE titles, Regular 400 body). Signature devices: **burgundy
  radial gradient** + **faint Swiss-Alps watermark** (`soft-light`), and the short
  **~44px burgundy rule**. Cards soft 14px radius, warm hairline borders.
- **Iconography.** An **almost icon-free brand** — the wordmark `+`, oversized
  thin numerals, burgundy rules, chevrons, duotone photography; burgundy `✓` on
  advantage lists. Lucide is the flagged substitute when UI genuinely needs icons.
- **Formats.** Two living expressions — the **institutional brochure** (burgundy
  covers, taupe chapter tabs, silver numerals) and **La Boutique della Previdenza**
  (white 16:9, rounded cards, maroon selected-option cards).

> One identity, two expressions — encoded in the bound tokens and the `lfg-zest`
> brand layer / chart theme. For LFA ⇄ LFG+ZEST switching see §0.

---

## 7 · Caveats / open questions
See the end-of-turn message — fonts and icons are substitutions pending the
licensed originals, and the brochure's image-heavy pages need re-supply as clean
assets.
