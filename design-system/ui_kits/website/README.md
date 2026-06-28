# LFA Website — UI Kit

High-fidelity, click-through recreation of the refreshed **lfa.ch** marketing
site, composed from the design-system components.

## Run
Open `index.html`. It loads `../../styles.css` + `../../_ds_bundle.js`, then the
screen files. Top-nav links route between screens (logo → Home).

## Screens
| File | Screen | Highlights |
|---|---|---|
| `Home.jsx` | Home | Golden-hour Zürich hero, Swiss-flag intro, Facts & Figures stats, Why-LFA feature grid |
| `WhatWeDo.jsx` | What We Do | Analyst banner, full-bleed **rose** intro band, services left-rail selector with `+` detail list |
| `About.jsx` | About / Why LFA | Bellinzona castle hero, Alps-lake split, "What Makes LFA Different" grid, Accountability · Respect · Courage values |
| `Footer.jsx` | Footer | Navy footer with the Zurich / Lugano / Sion offices |
| `shared.jsx` | helpers | `Icon` (Lucide line icons), `Container` |

## Components used (from `window.LFADesignSystem_f7f6ac`)
`NavBar`, `Button`, `SectionHeading`, `RoseSection`, `MandateTabs`, `FeatureCard`,
`StatCard`, `Eyebrow`, `Tag`.

## Notes
- Icons are **Lucide** (CDN) — the closest open match to LFA's bespoke line
  icons. Swap to licensed glyphs when available.
- Imagery is cropped from the supplied website screenshots; the hero/banner
  images carry some softness. Replace with clean source assets when supplied.
