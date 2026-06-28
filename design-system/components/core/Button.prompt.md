**LFA's primary call-to-action.** Use for "GET STARTED", form submits, and inline read-more links. Letterspaced uppercase, pill-shaped (except `link`).

```jsx
<Button variant="outline" href="/get-started">Get Started</Button>
<Button variant="primary" iconRight="→">Contact LFA</Button>
<Button variant="link" iconRight="→">Learn more</Button>
```

Variants: `primary` (solid rose), `outline` (rose pill — the site's nav CTA), `navy` (solid navy), `link` (underlined arrow link). Sizes `sm | md | lg`. Pass `href` to render an `<a>`. Hover deepens the fill / nudges the arrow right.
