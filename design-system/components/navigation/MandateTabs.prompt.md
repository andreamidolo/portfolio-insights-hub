**Vertical left-rail tab selector** from LFA's Services section. Active item fills solid navy; pairs with a content panel on the right.

```jsx
<MandateTabs
  items={['Investment Management','International Wealth Planning','Alternative Investments','Family Office Services','Sports Division','Self-Directed IRAs']}
  defaultValue="Investment Management"
  onChange={setTab}
/>
```

Controlled (`value`) or uncontrolled (`defaultValue`).
