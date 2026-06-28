---
name: lfa-design
description: Use this skill to generate well-branded interfaces and assets for LFA — Lugano Financial Advisors SA (Swiss Wealth Management for U.S. Clients), either for production or throwaway prototypes/mocks/decks/one-pagers. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

# LFA Design System — skill

Read `readme.md` in this skill first (full brand guide: company context, content
fundamentals, visual foundations, iconography, manifest), then explore the other
files.

## What's here
- `styles.css` — single global entry point (link this). Pulls in `tokens/`
  (`colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`).
- `tokens/` — all CSS custom properties (`--lfa-navy`, `--lfa-rose`,
  `--font-serif`, spacing, radii, shadows, motion).
- `assets/` — logo lockup, Swiss imagery (Zürich, Alps, Bellinzona), hand-drawn
  Swiss flag illustration.
- `components/` — React primitives: `Button`, `Eyebrow`, `Tag`, `FeatureCard`,
  `StatCard`, `NavBar`, `MandateTabs`, `SectionHeading`, `RoseSection`.
- `ui_kits/website/` — high-fidelity click-through recreation of lfa.ch.
- `guidelines/` — foundation specimen cards.

## How to design as LFA (the short version)
- **Voice:** assured, calm, premium Swiss restraint. Address the reader as "you",
  the firm as "we / LFA". Headlines are quiet questions or declaratives in
  **italic serif (Cormorant Garamond)**; body & labels in **Mulish**. Labels and
  eyebrows are ALL-CAPS, letter-spaced. No emoji, no exclamations.
- **Color:** navy `#23366E` backbone; Swiss red `#C31F3A` only as a precise
  accent (the cross); rose `#C24A5E` for CTAs, links, and the full-bleed
  editorial section band. White-dominant, airy, photographic.
- **Imagery:** warm, sunlit Swiss photography (lakes, Alps, Zürich, castles).
- **Motion:** minimal — gentle fades + small reveals; no bounce.

## Output behavior
If creating visual artifacts (slides, mocks, throwaway prototypes, one/two-pagers,
brochures), copy assets out and create static HTML files for the user to view. If
working on production code, copy assets and apply the tokens/components directly.

If invoked with no other guidance, ask the user what they want to build, ask a few
focused questions, then act as an expert LFA brand designer who outputs HTML
artifacts **or** production code as needed.
