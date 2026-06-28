/* @ds-bundle: {"format":3,"namespace":"FundFactsheetDesignSystem_2d23bc","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"KpiStat","sourcePath":"components/core/KpiStat.jsx"},{"name":"PerfValue","sourcePath":"components/core/PerfValue.jsx"},{"name":"SectionTitle","sourcePath":"components/core/SectionTitle.jsx"},{"name":"BrandHeader","sourcePath":"components/document/BrandHeader.jsx"},{"name":"Disclaimer","sourcePath":"components/document/Disclaimer.jsx"},{"name":"FundManagerBio","sourcePath":"components/document/FundManagerBio.jsx"},{"name":"RiskScale","sourcePath":"components/indicators/RiskScale.jsx"},{"name":"SfdrBadge","sourcePath":"components/indicators/SfdrBadge.jsx"},{"name":"HoldingsTable","sourcePath":"components/tables/HoldingsTable.jsx"},{"name":"InfoTable","sourcePath":"components/tables/InfoTable.jsx"},{"name":"MonthlyReturnsTable","sourcePath":"components/tables/MonthlyReturnsTable.jsx"},{"name":"ShareClassTable","sourcePath":"components/tables/ShareClassTable.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"13e2a4dfb749","components/core/KpiStat.jsx":"9398a4eca02f","components/core/PerfValue.jsx":"3ab5e03556d5","components/core/SectionTitle.jsx":"e1e1cbcaf3dd","components/document/BrandHeader.jsx":"c76cc2a02dec","components/document/Disclaimer.jsx":"37813898cde3","components/document/FundManagerBio.jsx":"08849372db45","components/indicators/RiskScale.jsx":"545a9d116c40","components/indicators/SfdrBadge.jsx":"e6de892c7a90","components/tables/HoldingsTable.jsx":"d9206cb48042","components/tables/InfoTable.jsx":"c28152429c8e","components/tables/MonthlyReturnsTable.jsx":"7a661c64c64a","components/tables/ShareClassTable.jsx":"7ddc6168562d","ui_kits/factsheet/ChartEditor.jsx":"0f7bacd05c37","ui_kits/factsheet/Charts.jsx":"5110c67fea06","ui_kits/factsheet/FactsheetHive.jsx":"af2d54f33096","ui_kits/factsheet/FactsheetVG.jsx":"4c2d898ba925","ui_kits/factsheet/FactsheetZest.jsx":"af59a7876e25","ui_kits/factsheet/chart-bridge.js":"400c04bf0912","ui_kits/factsheet/data.js":"10f428258f42","ui_kits/factsheet/echarts-kit.js":"5eca3cfad840","ui_kits/factsheet/excel.js":"75b05005d16f","ui_kits/factsheet/layout-kit.jsx":"85d929ca40eb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FundFactsheetDesignSystem_2d23bc = window.FundFactsheetDesignSystem_2d23bc || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status / classification pill.
 * Tones map to financial-doc semantics. Used for SFDR labels,
 * "Marketing Material", share-class flags, risk tags.
 */
function Badge({
  children,
  tone = 'neutral',
  solid = false,
  style = {},
  ...rest
}) {
  const map = {
    neutral: {
      fg: 'var(--ink-600)',
      bg: 'var(--surface-sunken)',
      bd: 'var(--line)'
    },
    accent: {
      fg: 'var(--accent)',
      bg: 'var(--doc-mist)',
      bd: 'var(--accent)'
    },
    positive: {
      fg: 'var(--pos)',
      bg: 'var(--pos-soft)',
      bd: 'var(--pos)'
    },
    negative: {
      fg: 'var(--neg)',
      bg: 'var(--neg-soft)',
      bd: 'var(--neg)'
    },
    gold: {
      fg: '#8a6a26',
      bg: '#f6efe0',
      bd: 'var(--accent-2)'
    }
  };
  const c = map[tone] || map.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-tiny)',
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.03em',
      padding: '4px 9px',
      borderRadius: 'var(--r-pill)',
      textTransform: 'uppercase',
      color: solid ? 'var(--accent-ink, #fff)' : c.fg,
      background: solid ? c.fg : c.bg,
      border: `1px solid ${solid ? c.fg : c.bd}`,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/KpiStat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * KpiStat — a single "In a nutshell" metric: label + big value (+ optional note).
 * Stacks in a row of 4-6 across the top of VG factsheets.
 */
function KpiStat({
  label,
  value,
  note,
  accent = false,
  align = 'left',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      textAlign: align,
      padding: '2px 0',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-500)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontWeight: 600,
      marginBottom: '3px'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-xl)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      color: accent ? 'var(--accent)' : 'var(--doc-ink)',
      fontVariantNumeric: 'tabular-nums lining-nums'
    }
  }, value), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-400)',
      marginTop: '2px'
    }
  }, note));
}
Object.assign(__ds_scope, { KpiStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/KpiStat.jsx", error: String((e && e.message) || e) }); }

// components/core/PerfValue.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * PerfValue — a performance number colored by sign.
 * The single most-used atom in a factsheet: tabular figures,
 * institutional green for gains, brick red for losses, grey for flat/null.
 */
function PerfValue({
  value,
  format = 'percent',
  // 'percent' | 'number' | 'bps'
  digits = 2,
  showSign = true,
  size = 'inherit',
  weight = 600,
  style = {},
  ...rest
}) {
  const isNull = value === null || value === undefined || value === '' || Number.isNaN(value);
  let n = typeof value === 'string' ? parseFloat(value) : value;
  let color = 'var(--flat)';
  if (!isNull) color = n > 0 ? 'var(--pos)' : n < 0 ? 'var(--neg)' : 'var(--flat)';
  let text = '–';
  if (!isNull) {
    const sign = showSign && n > 0 ? '+' : n < 0 ? '−' : '';
    const abs = Math.abs(n);
    if (format === 'percent') text = `${sign}${(abs * 100).toFixed(digits)}%`;else if (format === 'bps') text = `${sign}${Math.round(abs * 10000)} bps`;else text = `${sign}${abs.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    })}`;
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: 'var(--font-mono)',
      fontVariantNumeric: 'tabular-nums lining-nums',
      fontWeight: weight,
      fontSize: size === 'inherit' ? 'inherit' : size,
      color,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), text);
}
Object.assign(__ds_scope, { PerfValue });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PerfValue.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionTitle — a factsheet section heading.
 * Two brand treatments:
 *  - 'bar'       centered filled bar (HIVE bordeaux, Zest navy)
 *  - 'underline' uppercase accent text + rule (VG / AQA)
 * Defaults follow the active family's --section-style via the `variant` prop.
 */
function SectionTitle({
  children,
  variant = 'bar',
  align,
  style = {},
  ...rest
}) {
  if (variant === 'underline') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        fontFamily: 'var(--font-body)',
        color: 'var(--section-title-color, var(--accent))',
        fontWeight: 700,
        fontSize: 'var(--fs-sm)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderBottom: '2px solid var(--accent)',
        paddingBottom: '4px',
        textAlign: align || 'left',
        ...style
      }
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      background: 'var(--section-bar-bg, var(--accent))',
      color: 'var(--section-bar-ink, #fff)',
      fontWeight: 600,
      fontSize: 'var(--fs-sm)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '7px 12px',
      textAlign: align || 'center',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/document/BrandHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BrandHeader — top-of-page band: fund/family identity on the left,
 * 1–3 partner logos by role on the right, plus the "Monthly Factsheet /
 * Marketing Material" eyebrow and as-of date. Logo src paths are supplied
 * by the consumer (relative to the page).
 */
function BrandHeader({
  eyebrow = 'Monthly Factsheet',
  tag = 'Marketing Material',
  date,
  logos = [],
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '16px',
      paddingBottom: '8px',
      borderBottom: '2px solid var(--accent)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-tiny)',
      fontWeight: 700,
      color: 'var(--accent)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      marginTop: '3px'
    }
  }, tag && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-500)'
    }
  }, tag), date && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-400)'
    }
  }, "\xB7 ", date))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }
  }, logos.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: l.src,
    alt: l.alt || l.role || '',
    style: {
      height: (l.h || 30) + 'px',
      width: 'auto',
      display: 'block'
    }
  }), l.role && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '7px',
      color: 'var(--ink-400)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, l.role)))));
}
Object.assign(__ds_scope, { BrandHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/BrandHeader.jsx", error: String((e && e.message) || e) }); }

// components/document/Disclaimer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Disclaimer — the dense multi-paragraph legal footer set in fine print.
 * Accepts an array of {heading, body} blocks or a single string.
 */
function Disclaimer({
  blocks,
  text,
  columns = 1,
  style = {},
  ...rest
}) {
  const items = blocks || (text ? [{
    body: text
  }] : []);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-micro)',
      lineHeight: 1.4,
      color: 'var(--ink-500)',
      textAlign: 'justify',
      columnCount: columns,
      columnGap: '8mm',
      ...style
    }
  }, rest), items.map((b, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: '0 0 5px'
    }
  }, b.heading && /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--ink-700)',
      fontWeight: 700
    }
  }, b.heading, " "), b.body)));
}
Object.assign(__ds_scope, { Disclaimer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/Disclaimer.jsx", error: String((e && e.message) || e) }); }

// components/document/FundManagerBio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * FundManagerBio — portrait slot + name + role + bio paragraph.
 * Used in the "Fund Manager" / "Investment Manager" blocks (hive, zest).
 * Pass `photo` for an image, or omit for an accent-tinted initials disc.
 */
function FundManagerBio({
  name,
  role,
  bio,
  photo,
  initials,
  style = {},
  ...rest
}) {
  const ini = initials || (name ? name.split(' ').map(w => w[0]).slice(0, 2).join('') : '');
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: '12px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 auto'
    }
  }, photo ? /*#__PURE__*/React.createElement("img", {
    src: photo,
    alt: name,
    style: {
      width: '54px',
      height: '54px',
      objectFit: 'cover',
      borderRadius: 'var(--r-md)',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '54px',
      height: '54px',
      borderRadius: 'var(--r-md)',
      background: 'var(--doc-mist)',
      color: 'var(--accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: 'var(--fs-lg)',
      letterSpacing: '0.02em'
    }
  }, ini)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 'var(--fs-sm)',
      color: 'var(--doc-ink)'
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--accent)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginBottom: '4px'
    }
  }, role), bio && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-600)',
      lineHeight: 1.45,
      textWrap: 'pretty'
    }
  }, bio)));
}
Object.assign(__ds_scope, { FundManagerBio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/document/FundManagerBio.jsx", error: String((e && e.message) || e) }); }

// components/indicators/RiskScale.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * RiskScale — the SRI / KID 1–7 risk meter with the active cell highlighted.
 * "Lower risk" ↔ "Higher risk" rail beneath, as on VG / Zest factsheets.
 */
function RiskScale({
  value = 4,
  labels = true,
  style = {},
  ...rest
}) {
  const cells = [1, 2, 3, 4, 5, 6, 7];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '3px'
    }
  }, cells.map(n => {
    const active = n === value;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        flex: 1,
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--fs-xs)',
        fontWeight: 700,
        borderRadius: 'var(--r-sm)',
        color: active ? 'var(--accent-ink, #fff)' : 'var(--ink-500)',
        background: active ? 'var(--accent)' : 'var(--surface-sunken)',
        border: active ? '1px solid var(--accent)' : '1px solid var(--line)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, n);
  })), labels && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '4px',
      fontSize: 'var(--fs-tiny)',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Lower risk"), /*#__PURE__*/React.createElement("span", null, "Higher risk")));
}
Object.assign(__ds_scope, { RiskScale });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/RiskScale.jsx", error: String((e && e.message) || e) }); }

// components/indicators/SfdrBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SfdrBadge — the SFDR classification selector strip (Art 6 / Art 8 / Art 9),
 * with the active article filled in the brand accent.
 */
function SfdrBadge({
  value = 'Art 8',
  style = {},
  ...rest
}) {
  const arts = ['Art 6', 'Art 8', 'Art 9'];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      gap: '4px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), arts.map(a => {
    const active = a === value;
    return /*#__PURE__*/React.createElement("span", {
      key: a,
      style: {
        height: '26px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--fs-tiny)',
        fontWeight: 700,
        padding: '0 10px',
        borderRadius: 'var(--r-sm)',
        color: active ? 'var(--accent-ink, #fff)' : 'var(--ink-400)',
        background: active ? 'var(--accent)' : 'var(--surface-sunken)',
        border: active ? '1px solid var(--accent)' : '1px solid var(--line)',
        boxSizing: 'border-box',
        letterSpacing: '0.02em'
      }
    }, a.replace('Art ', 'Art. '));
  }));
}
Object.assign(__ds_scope, { SfdrBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/indicators/SfdrBadge.jsx", error: String((e && e.message) || e) }); }

// components/tables/HoldingsTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * HoldingsTable — top holdings / breakdown rows as Name + Weight%, with an
 * optional inline weight bar. Used for top-10 equity holdings and
 * strategy/sector breakdowns (hive, zest).
 */
function HoldingsTable({
  rows = [],
  showBar = true,
  valueLabel = 'Wgt %',
  nameLabel = 'Name',
  rank = false,
  style = {},
  ...rest
}) {
  const max = Math.max(...rows.map(r => typeof r.weight === 'number' ? r.weight : 0), 0.0001);
  const th = {
    fontSize: 'var(--fs-tiny)',
    color: 'var(--ink-500)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    padding: '4px 0',
    borderBottom: '1px solid var(--accent)'
  };
  const td = {
    padding: '4px 0',
    fontSize: 'var(--fs-xs)',
    borderBottom: '0.75px solid var(--doc-line)'
  };
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'left'
    }
  }, nameLabel), showBar && /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: '38%'
    }
  }), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right',
      width: '64px'
    }
  }, valueLabel))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--doc-ink)',
      fontWeight: 500
    }
  }, rank && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-400)',
      fontFamily: 'var(--font-mono)',
      marginRight: '8px',
      fontSize: 'var(--fs-tiny)'
    }
  }, String(i + 1).padStart(2, '0')), r.name), showBar && /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px',
      background: 'var(--doc-mist)',
      borderRadius: '2px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${r.weight / max * 100}%`,
      background: r.color || 'var(--accent)'
    }
  }))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right',
      fontFamily: 'var(--font-mono)',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums lining-nums',
      color: 'var(--doc-ink)'
    }
  }, typeof r.weight === 'number' ? `${(r.weight * 100).toFixed(2)}%` : r.weight)))));
}
Object.assign(__ds_scope, { HoldingsTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/HoldingsTable.jsx", error: String((e && e.message) || e) }); }

// components/tables/InfoTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * InfoTable — the "General Information" / "Key Term Sheet" / "Dashboard" block.
 * A label→value key list with hairline rules. Appears in every family.
 */
function InfoTable({
  rows = [],
  dense = false,
  accentLabels = false,
  style = {},
  ...rest
}) {
  const pad = dense ? '3px 0' : '5px 0';
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)',
      fontSize: dense ? 'var(--fs-tiny)' : 'var(--fs-xs)',
      color: 'var(--doc-ink)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: '0.75px solid var(--doc-line)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: pad,
      color: accentLabels ? 'var(--accent)' : 'var(--ink-600)',
      fontWeight: accentLabels ? 600 : 500,
      textAlign: 'left',
      whiteSpace: 'nowrap',
      paddingRight: '12px'
    }
  }, r.label), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: pad,
      textAlign: 'right',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums lining-nums',
      fontFamily: r.mono ? 'var(--font-mono)' : 'inherit'
    }
  }, r.value)))));
}
Object.assign(__ds_scope, { InfoTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/InfoTable.jsx", error: String((e && e.message) || e) }); }

// components/tables/MonthlyReturnsTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function fmt(v) {
  if (v === null || v === undefined || v === '' || Number.isNaN(v)) return '–';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  const sign = n < 0 ? '−' : '';
  return `${sign}${Math.abs(n * 100).toFixed(2)}`;
}
function col(v) {
  if (v === null || v === undefined || v === '' || Number.isNaN(v)) return 'var(--ink-300)';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return n > 0 ? 'var(--pos)' : n < 0 ? 'var(--neg)' : 'var(--flat)';
}

/**
 * MonthlyReturnsTable — the year×month performance matrix with a highlighted
 * YTD column, accent header row, zebra striping and sign coloring.
 * `data` = { 2026: { JAN:0.0217, …, YTD:0.0919 }, … }
 */
function MonthlyReturnsTable({
  data = {},
  style = {},
  ...rest
}) {
  const years = Object.keys(data).sort();
  const th = {
    background: 'var(--table-header-bg)',
    color: 'var(--table-header-ink)',
    fontWeight: 600,
    fontSize: 'var(--fs-tiny)',
    padding: '5px 4px',
    textAlign: 'right'
  };
  const td = {
    padding: '4px',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums lining-nums',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--fs-tiny)'
  };
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'left'
    }
  }, "Year"), MONTHS.map(m => /*#__PURE__*/React.createElement("th", {
    key: m,
    style: th
  }, m)), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      background: 'var(--accent-deep)'
    }
  }, "YTD"))), /*#__PURE__*/React.createElement("tbody", null, years.map((y, i) => /*#__PURE__*/React.createElement("tr", {
    key: y,
    style: {
      background: i % 2 ? 'var(--table-zebra)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      color: 'var(--doc-ink)'
    }
  }, y), MONTHS.map(m => /*#__PURE__*/React.createElement("td", {
    key: m,
    style: {
      ...td,
      color: col(data[y][m])
    }
  }, fmt(data[y][m]))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 700,
      color: col(data[y].YTD),
      background: 'var(--doc-mist)'
    }
  }, fmt(data[y].YTD))))));
}
Object.assign(__ds_scope, { MonthlyReturnsTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/MonthlyReturnsTable.jsx", error: String((e && e.message) || e) }); }

// components/tables/ShareClassTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ShareClassTable — the multi-share-class summary (ISIN / Name / CCY / AuM / NAV / MTD / YTD).
 * Accent header row, mono figures, sign-colored MTD & YTD.
 */
function ShareClassTable({
  rows = [],
  style = {},
  ...rest
}) {
  const th = {
    background: 'var(--table-header-bg)',
    color: 'var(--table-header-ink)',
    fontWeight: 600,
    fontSize: 'var(--fs-tiny)',
    padding: '6px 8px',
    textAlign: 'right',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '5px 8px',
    textAlign: 'right',
    fontSize: 'var(--fs-xs)',
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums lining-nums',
    borderBottom: '0.75px solid var(--doc-line)'
  };
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'left'
    }
  }, "ISIN"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'left'
    }
  }, "Class"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "CCY"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "AuM"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "NAV"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "MTD"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "YTD"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'left',
      color: 'var(--ink-600)'
    }
  }, r.isin), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      color: 'var(--doc-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r.ccy), /*#__PURE__*/React.createElement("td", {
    style: td
  }, typeof r.aum === 'number' ? r.aum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : r.aum), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600,
      color: 'var(--doc-ink)'
    }
  }, typeof r.nav === 'number' ? r.nav.toFixed(2) : r.nav), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(__ds_scope.PerfValue, {
    value: r.mtd,
    weight: 500
  })), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(__ds_scope.PerfValue, {
    value: r.ytd,
    weight: 700
  }))))));
}
Object.assign(__ds_scope, { ShareClassTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/tables/ShareClassTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/ChartEditor.jsx
try { (() => {
/* Chart Studio — the on-brand chart editor integrated into the factsheet builder.
   Now driven by the SAME ECharts engine as the factsheet: the live preview is a
   real ECharts chart built with FactsheetECharts.buildOption(model, theme), and
   the type picker offers the full catalog (~21 renderers). Mirrors
   app/chart-studio.html (docs/chart-studio-integration.md §3): edit a chart's
   TYPE / COLORS / series NUMBERS against the locked family palette, then "Apply
   to factsheet" writes the {type,series,meta} model back into the document. */
const {
  useState: useCS,
  useEffect: useCSE
} = React;
const FAMILY_LABEL = {
  vg: 'VG / AQA',
  hive: 'HIVE / LFG·Zest',
  zest: 'Zest AM'
};
function ChartStudioModal() {
  const [open, setOpen] = useCS(false);
  const [seed, setSeed] = useCS(null);
  const [type, setType] = useCS('bar');
  const [series, setSeries] = useCS([]);
  const [family, setFamily] = useCS('vg');
  const [pasteOpen, setPasteOpen] = useCS(false);
  const [pasteText, setPasteText] = useCS('');
  useCSE(() => {
    const handler = e => {
      const s = e.detail;
      setSeed(s);
      setType(s.type || 'bar');
      setFamily(s.family || 'vg');
      setSeries(s.series.map(p => ({
        ...p
      })));
      setOpen(true);
      setPasteOpen(false);
      setPasteText('');
    };
    window.addEventListener('chart:edit', handler);
    return () => window.removeEventListener('chart:edit', handler);
  }, []);
  if (!open) return null;
  const {
    EChart
  } = window.KitCharts;
  const {
    resolveTheme,
    CHART_CATALOG
  } = window.FactsheetECharts;
  const theme = resolveTheme(family);
  const cats = theme.palette.categorical;
  const baseMeta = seed && seed.meta || {};
  // preview uses the chart's OWN meta so number format / sign match the factsheet
  const model = {
    type,
    series,
    color: (series.find(s => s.color) || {}).color,
    meta: Object.assign({}, baseMeta, {
      title: seed.title,
      compact: false,
      noLabel: false
    })
  };
  const valUnit = baseMeta.numFmt === 'num0' || baseMeta.numFmt === 'num' ? '' : '%';
  const setVal = (i, v) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    value: v
  } : p));
  const setName = (i, v) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    name: v
  } : p));
  const setColor = (i, c) => setSeries(s => s.map((p, k) => k === i ? {
    ...p,
    color: c
  } : p));
  const addRow = () => setSeries(s => [...s, {
    name: 'New',
    value: 0
  }]);
  const delRow = i => setSeries(s => s.filter((_, k) => k !== i));

  /* parse pasted spreadsheet data: lines of "Label <tab|,|;> Value" (Value may carry % or thousands separators) */
  const parsePaste = txt => {
    const rows = [];
    txt.split(/\r?\n/).forEach(line => {
      if (!line.trim()) return;
      const parts = line.split(/\t|;|,(?=\s*-?\d)|\s{2,}/).map(p => p.trim()).filter(Boolean);
      if (!parts.length) return;
      let name, raw;
      if (parts.length === 1) {
        const m = parts[0].match(/^(.*?)[\s]+(-?[\d.,]+%?)$/);
        if (m) {
          name = m[1];
          raw = m[2];
        } else {
          name = parts[0];
          raw = '0';
        }
      } else {
        name = parts.slice(0, -1).join(' ');
        raw = parts[parts.length - 1];
      }
      const val = parseFloat(String(raw).replace(/[^0-9.\-]/g, ''));
      rows.push({
        name: name.trim(),
        value: isNaN(val) ? 0 : val
      });
    });
    return rows;
  };
  const applyPaste = mode => {
    const rows = parsePaste(pasteText);
    if (!rows.length) {
      setPasteOpen(false);
      return;
    }
    setSeries(s => mode === 'append' ? [...s, ...rows] : rows.map((r, i) => ({
      ...r,
      color: (s[i] || {}).color
    })));
    setPasteOpen(false);
    setPasteText('');
  };
  const apply = () => {
    seed.onApply && seed.onApply({
      type,
      series,
      meta: {
        title: seed.title
      }
    });
    setOpen(false);
  };
  const reset = () => {
    seed.onReset && seed.onReset();
    setOpen(false);
  };
  const copyJSON = () => navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(model, null, 2));

  // group the catalog
  const groups = {};
  CHART_CATALOG.forEach(c => {
    (groups[c.group] = groups[c.group] || []).push(c);
  });
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(20,25,31,.46)',
      backdropFilter: 'blur(2px)',
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    "data-family": family,
    style: {
      width: '960px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 24px 70px rgba(20,25,31,.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 18px',
      borderBottom: '1px solid var(--line)',
      background: 'var(--accent)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '14px'
    }
  }, "\u26ED Chart Studio"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '12px',
      opacity: .85
    }
  }, seed.title), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      opacity: .85,
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#fff'
    }
  }), "ECharts \xB7 ", FAMILY_LABEL[family], " palette"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      border: 0,
      background: 'rgba(255,255,255,.16)',
      color: '#fff',
      width: '26px',
      height: '26px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '15px'
    }
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 290px',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      borderRight: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '8px'
    }
  }, "Live preview"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-app)',
      borderRadius: '8px',
      padding: '12px',
      height: '300px'
    }
  }, /*#__PURE__*/React.createElement(EChart, {
    key: family,
    model: model,
    theme: theme,
    height: 276
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px',
      overflowY: 'auto',
      maxHeight: '150px'
    }
  }, Object.entries(groups).map(([g, items]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '8.5px',
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '5px'
    }
  }, g), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px'
    }
  }, items.map(k => /*#__PURE__*/React.createElement("button", {
    key: k.id,
    onClick: () => setType(k.id),
    style: {
      border: '1px solid ' + (type === k.id ? 'var(--accent)' : 'var(--line)'),
      background: type === k.id ? 'var(--accent)' : '#fff',
      color: type === k.id ? '#fff' : 'var(--ink-700)',
      fontWeight: 600,
      fontSize: '10.5px',
      padding: '5px 10px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, k.label))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)',
      fontWeight: 700,
      marginBottom: '10px'
    }
  }, "Series data ", valUnit && '(' + valUnit + ')'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, series.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "color",
    value: (p.color || cats[i % cats.length] || '#888').slice(0, 7),
    onChange: e => setColor(i, e.target.value),
    style: {
      width: '22px',
      height: '26px',
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: 0,
      background: 'none',
      cursor: 'pointer',
      flex: '0 0 auto'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: p.name,
    onChange: e => setName(i, e.target.value),
    style: {
      flex: 1,
      minWidth: 0,
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: '5px 7px',
      fontSize: '11px',
      fontFamily: 'var(--font-body)'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.01",
    value: p.value,
    onChange: e => setVal(i, e.target.value),
    style: {
      width: '62px',
      border: '1px solid var(--line)',
      borderRadius: '5px',
      padding: '5px 6px',
      fontSize: '11px',
      fontFamily: 'var(--font-mono)',
      textAlign: 'right'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => delRow(i),
    title: "Remove",
    style: {
      border: 0,
      background: 'none',
      color: 'var(--ink-300)',
      cursor: 'pointer',
      fontSize: '15px',
      flex: '0 0 auto'
    }
  }, "\xD7")))), /*#__PURE__*/React.createElement("button", {
    onClick: addRow,
    style: {
      marginTop: '10px',
      border: '1px dashed var(--line-strong)',
      background: 'none',
      color: 'var(--ink-500)',
      fontSize: '11px',
      fontWeight: 600,
      padding: '7px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "+ Add row"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPasteOpen(o => !o),
    style: {
      marginTop: '6px',
      border: '1px solid ' + (pasteOpen ? 'var(--accent)' : 'var(--line)'),
      background: pasteOpen ? 'var(--accent)' : '#fff',
      color: pasteOpen ? '#fff' : 'var(--ink-700)',
      fontSize: '11px',
      fontWeight: 600,
      padding: '7px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "\u232C Paste data from Excel"), pasteOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: pasteText,
    onChange: e => setPasteText(e.target.value),
    autoFocus: true,
    placeholder: 'Paste rows copied from Excel / Sheets:\nInformation Technology\t28.53\nFinancials\t11.25\n…',
    style: {
      width: '100%',
      height: '92px',
      border: '1px solid var(--line)',
      borderRadius: '6px',
      padding: '6px 8px',
      fontSize: '10px',
      fontFamily: 'var(--font-mono)',
      resize: 'vertical'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => applyPaste('replace'),
    style: {
      flex: 1,
      border: 0,
      background: 'var(--accent)',
      color: '#fff',
      fontSize: '10.5px',
      fontWeight: 700,
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "Replace"), /*#__PURE__*/React.createElement("button", {
    onClick: () => applyPaste('append'),
    style: {
      flex: 1,
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--ink-700)',
      fontSize: '10.5px',
      fontWeight: 600,
      padding: '6px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  }, "Append")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      color: 'var(--ink-400)',
      lineHeight: 1.4
    }
  }, "One row per line \xB7 label and value separated by Tab, comma or semicolon. The % sign is optional.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: '12px',
      fontSize: '9.5px',
      color: 'var(--ink-400)',
      lineHeight: 1.5
    }
  }, "Colours snap to the ", /*#__PURE__*/React.createElement("b", null, FAMILY_LABEL[family]), " categorical palette unless overridden. Rendered by ECharts 5.5 via the shared ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, "buildOption"), "."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 18px',
      borderTop: '1px solid var(--line)',
      background: 'var(--surface-app)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '10px',
      color: 'var(--ink-400)'
    }
  }, "Model = the repo's ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)'
    }
  }, '{type,series,meta}'), " unit"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: '8px'
    }
  }, seed.edited && /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--neg)',
      fontWeight: 600,
      fontSize: '12px',
      padding: '8px 14px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "\u21BA Reset chart"), /*#__PURE__*/React.createElement("button", {
    onClick: copyJSON,
    style: {
      border: '1px solid var(--line)',
      background: '#fff',
      color: 'var(--ink-700)',
      fontWeight: 600,
      fontSize: '12px',
      padding: '8px 14px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "Copy model JSON"), /*#__PURE__*/React.createElement("button", {
    onClick: apply,
    style: {
      border: 0,
      background: 'var(--accent)',
      color: '#fff',
      fontWeight: 700,
      fontSize: '12px',
      padding: '8px 18px',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  }, "Apply to factsheet")))));
}
function openChartStudio(detail) {
  window.dispatchEvent(new CustomEvent('chart:edit', {
    detail
  }));
}
window.ChartStudio = {
  ChartStudioModal,
  openChartStudio
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/ChartEditor.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/Charts.jsx
try { (() => {
/* Charts.jsx — ECharts 5.x render layer for the factsheet UI kit.
   Every chart goes through FactsheetECharts.buildOption(model, theme) — the SAME
   function the Chart Studio uses — so the factsheet and the editor speak one
   language (docs/chart-studio-integration.md §2–4).

   Per-chart editing model (matches the sister project):
   ─ every <EChart> with an `id` is individually editable via a ✎ Edit button.
   ─ edits are stored as a per-chart OVERRIDE { type, series, color } keyed by
     `<activeDoc>::<id>`, so they survive re-render and switching pages, and are
     reverted independently. The factsheet reads its own override at render.
   Exposes window.KitCharts (EChart, CumulativeChart, MonthlyBars, Donut, CatChart). */

const {
  useRef: useCR,
  useEffect: useCE,
  useLayoutEffect: useCLE,
  useState: useCSt
} = React;
const {
  buildOption,
  resolveTheme
} = window.FactsheetECharts;
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/* ---------- per-chart override store ---------- */
const OV = window.__chartOv = window.__chartOv || {};
const keyOf = id => (window.__activeDoc || 'doc') + '::' + id;
window.__getChartOv = id => OV[keyOf(id)];
window.__setChartOv = (id, ov) => {
  OV[keyOf(id)] = ov;
  window.__sheetRerender && window.__sheetRerender();
};
window.__clearChartOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  Object.keys(OV).forEach(k => {
    if (k.indexOf(p) === 0) delete OV[k];
  });
  window.__sheetRerender && window.__sheetRerender();
};
window.__hasChartOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  return Object.keys(OV).some(k => k.indexOf(p) === 0);
};
function mergeOverride(model, ov) {
  if (!ov) return model;
  return Object.assign({}, model, {
    type: ov.type || model.type,
    series: ov.series || model.series,
    color: ov.color !== undefined && ov.color !== null ? ov.color : model.color
  });
}
function flattenMonthly(monthly) {
  const out = [];
  Object.keys(monthly).sort().forEach(y => {
    MONTHS.forEach(m => {
      const v = monthly[y][m];
      if (v !== undefined && v !== null) out.push({
        label: `${m} ${y.slice(2)}`,
        year: y,
        m,
        r: v
      });
    });
  });
  return out;
}
function cumulativeSeries(monthly, base = 100) {
  const flat = flattenMonthly(monthly);
  let nav = base;
  const pts = [{
    nav: base,
    label: 'Start'
  }];
  flat.forEach(p => {
    nav = nav * (1 + p.r);
    pts.push({
      nav,
      label: p.label
    });
  });
  return pts;
}

/* ---------- generic ECharts mount + ✎ Edit affordance ---------- */
function EChart({
  id,
  title,
  model,
  family,
  theme,
  height = 150,
  width,
  style,
  editable = true
}) {
  const ref = useCR(null);
  const inst = useCR(null);
  const themeRef = useCR(theme);
  const famRef = useCR(family || 'vg');
  const ov = id ? window.__getChartOv(id) : null;
  const eff = mergeOverride(model, ov);
  const effKey = JSON.stringify(eff);
  useCLE(() => {
    if (!ref.current || !window.echarts) return;
    const fam = family || (ref.current.closest('[data-family]') || {}).dataset?.family || 'vg';
    famRef.current = fam;
    themeRef.current = theme || resolveTheme(fam);
    const chart = window.echarts.init(ref.current, null, {
      renderer: 'svg'
    });
    inst.current = chart;
    chart.setOption(buildOption(eff, themeRef.current), true);
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(ref.current);
    const onPrint = () => {
      try {
        chart.resize();
      } catch (e) {}
    };
    window.addEventListener('beforeprint', onPrint);
    const mq = window.matchMedia && window.matchMedia('print');
    mq && mq.addEventListener && mq.addEventListener('change', onPrint);
    return () => {
      ro.disconnect();
      window.removeEventListener('beforeprint', onPrint);
      mq && mq.removeEventListener && mq.removeEventListener('change', onPrint);
      chart.dispose();
    };
  }, []);
  useCE(() => {
    if (inst.current) inst.current.setOption(buildOption(eff, themeRef.current), true);
  }, [effKey]);
  const onEdit = e => {
    e.stopPropagation();
    window.ChartStudio && window.ChartStudio.openChartStudio({
      id,
      title: title || eff.meta && eff.meta.title || 'Chart',
      family: famRef.current,
      type: eff.type,
      series: (eff.series || []).map(s => Object.assign({}, s)),
      meta: eff.meta || {},
      edited: !!ov,
      onApply: m => window.__setChartOv(id, {
        type: m.type,
        series: m.series,
        color: (m.series.find(s => s.color) || {}).color
      }),
      onReset: () => {
        delete OV[keyOf(id)];
        window.__sheetRerender && window.__sheetRerender();
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'ec-wrap' + (ov ? ' ec-edited' : ''),
    style: {
      position: 'relative',
      width: width || '100%',
      height: height + 'px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%',
      height: '100%'
    }
  }), editable && id && /*#__PURE__*/React.createElement("button", {
    className: "ec-edit",
    onClick: onEdit,
    title: "Edit chart in Chart Studio"
  }, "\u270E Edit"));
}

/* ---- Cumulative NAV (line / area / column …) ---- */
function CumulativeChart({
  monthly,
  base = 100,
  height = 150,
  type = 'area',
  id,
  title
}) {
  const pts = cumulativeSeries(monthly, base);
  const model = {
    type: type === 'bars' ? 'column' : type,
    series: pts.map(p => ({
      name: p.label,
      value: +p.nav.toFixed(2)
    })),
    meta: {
      numFmt: 'num0',
      compact: true,
      title: title || 'Performance Since Inception'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: height
  });
}

/* ---- Monthly returns vs zero (signed columns) ---- */
function MonthlyBars({
  monthly,
  height = 130,
  year,
  id,
  title
}) {
  const flat = flattenMonthly(monthly);
  const data = year ? flat.filter(p => p.year === String(year)) : flat.slice(-18);
  const model = {
    type: 'column',
    series: data.map(p => ({
      name: p.m,
      value: +(p.r * 100).toFixed(2)
    })),
    meta: {
      numFmt: 'pct',
      compact: true,
      signed: true,
      title: title || 'Monthly Performance vs Zero'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: height
  });
}

/* ---- Donut (ring only by default; callers render their own legend) ---- */
function Donut({
  data,
  size = 150,
  thickness = 26,
  labels = false,
  id,
  title
}) {
  const inner = ((size / 2 - thickness) / (size / 2) * 100).toFixed(0);
  const model = {
    type: 'donut',
    series: data.map(d => ({
      name: d.name,
      value: +(d.weight * 100).toFixed(2),
      color: d.color
    })),
    meta: {
      numFmt: 'pct',
      compact: true,
      noLabel: !labels,
      radius: [inner + '%', '80%'],
      title: title || 'Allocation'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: size,
    width: size
  });
}

/* ---- Generic categorical chart (defaults to horizontal bars) ---- */
function CatChart({
  data,
  type = 'bar',
  height,
  compact = true,
  id,
  title
}) {
  const h = height || Math.max(58, data.length * (compact ? 19 : 26) + 12);
  const model = {
    type,
    series: data.map(d => ({
      name: d.name || d.sector,
      value: +((d.weight || 0) * 100).toFixed(2),
      color: d.color
    })),
    meta: {
      numFmt: 'pct',
      compact,
      title: title || 'Breakdown'
    }
  };
  return /*#__PURE__*/React.createElement(EChart, {
    id: id,
    title: title,
    model: model,
    height: h
  });
}
window.KitCharts = {
  EChart,
  CumulativeChart,
  MonthlyBars,
  Donut,
  CatChart,
  flattenMonthly,
  cumulativeSeries
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/Charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/FactsheetHive.jsx
try { (() => {
/* HIVE / LFG·Zest factsheet — bordeaux cover + 2 serif content pages. */
const DSh = window.FundFactsheetDesignSystem_2d23bc;
const {
  SectionTitle: HSectionTitle,
  Badge: HBadge,
  KpiStat: HKpiStat,
  InfoTable: HInfoTable,
  MonthlyReturnsTable: HMonthly,
  HoldingsTable: HHoldings,
  FundManagerBio: HBio,
  Disclaimer: HDisc,
  PerfValue: HPerf,
  RiskScale: HRisk,
  SfdrBadge: HSfdr
} = DSh;
const HCum = window.KitCharts.CumulativeChart;
const HBars = window.KitCharts.MonthlyBars;
const HCat = window.KitCharts.CatChart;
const {
  A4: HA4,
  DISCLAIMER: HDISC,
  Lead: HLead,
  LOGO: HLOGO,
  PageFoot: HFoot,
  MiniHeader: HMini
} = window.Factsheets;
const {
  ModuleGrid: HGrid,
  Module: HModule,
  CanvasPages: HCanvasPages,
  EditableTable: HEditable
} = window.KitLayout;

/* General Information & Costs as an editable key/value table (+/− rows) — Hive style */
function HGenInfo({
  rows,
  id
}) {
  return /*#__PURE__*/React.createElement(HEditable, {
    id: id,
    noHead: true,
    rows: rows.map(r => ({
      label: r.label,
      value: r.value
    })),
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}
const HLabel = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '9px',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: 'var(--accent-2)',
    fontWeight: 700,
    marginBottom: '5px'
  }
}, children);
function HiveCover({
  d
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "a4",
    "data-family": "hive",
    "data-screen-label": "hive-cover",
    style: {
      width: '210mm',
      height: '297mm',
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: 'var(--shadow-sheet)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 400",
    style: {
      position: 'absolute',
      top: '-60px',
      right: '-60px',
      width: '320px',
      opacity: 0.16
    }
  }, Array.from({
    length: 24
  }).map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: "200",
    y1: "200",
    x2: "200",
    y2: "0",
    stroke: "#b08d3c",
    strokeWidth: "1.2",
    transform: `rotate(${i * 15} 200 200)`
  })), [60, 120, 180].map(r => /*#__PURE__*/React.createElement("circle", {
    key: r,
    cx: "200",
    cy: "200",
    r: r,
    fill: "none",
    stroke: "#b08d3c",
    strokeWidth: "1"
  }))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 800 200",
    preserveAspectRatio: "none",
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '180px',
      opacity: 0.5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L0,120 L120,60 L240,110 L360,40 L500,100 L640,30 L800,90 L800,200 Z",
    fill: "#4f141f"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,200 L0,150 L160,90 L300,140 L460,70 L620,130 L800,80 L800,200 Z",
    fill: "#3a0f17"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24mm 20mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      padding: '8px',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: HLOGO('lfg-zest-red.png'),
    style: {
      width: '72px',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      fontSize: '10px',
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: '#d8b96a'
    }
  }, "LFGZEST.COM")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '0 20mm 60mm',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '54px',
      height: '2px',
      background: 'var(--accent-2)',
      marginBottom: '20px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '64px',
      lineHeight: 1.02,
      fontWeight: 600
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '18px',
      fontSize: '14px',
      letterSpacing: '.28em',
      textTransform: 'uppercase',
      color: '#e7d4ae'
    }
  }, d.meta.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '6px',
      fontSize: '11px',
      color: '#cbb08a'
    }
  }, d.meta.asOf)));
}
function HiveFactsheet({
  d
}) {
  const isAlloc = d.layout === 'hive-allocation';
  const pageTotal = window.__pageTotal ? window.__pageTotal('hive', [{
    id: 'hive-p2'
  }], 1) : 2;
  const seed2 = [{
    key: 'breakdown',
    kind: 'preset',
    preset: 'breakdown',
    w: 'half'
  }, {
    key: 'manager',
    kind: 'preset',
    preset: 'manager',
    w: 'half'
  }, window.Factsheets.shareClassBlock(d), {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: HDISC.map(b => b.heading + ' ' + b.body).join('\n\n')
  }];
  const presets2 = {
    breakdown: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
      variant: "bar"
    }, isAlloc ? 'Portfolio Breakdown' : 'Top 10 Holdings'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), /*#__PURE__*/React.createElement(HCat, {
      data: isAlloc ? d.strategy : d.holdings,
      id: "holdings",
      title: isAlloc ? 'Portfolio Breakdown' : 'Top 10 Holdings',
      compact: false
    })),
    manager: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
      variant: "bar"
    }, isAlloc ? 'The Investment Advisor' : 'The Fund Manager'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '9px'
      }
    }), isAlloc ? /*#__PURE__*/React.createElement(HBio, {
      name: d.advisor.name,
      role: "Investment Advisor",
      bio: d.advisor.bio,
      photo: HLOGO(d.advisor.logo)
    }) : /*#__PURE__*/React.createElement(HBio, {
      name: d.manager.name,
      role: d.manager.role,
      bio: d.manager.bio
    }))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HiveCover, {
    d: d
  }), /*#__PURE__*/React.createElement(HA4, {
    family: "hive"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--accent-2)',
      fontWeight: 700
    }
  }, d.meta.subtitle), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '26px',
      fontWeight: 600,
      color: 'var(--accent)',
      lineHeight: 1.1
    }
  }, d.meta.fundName)), /*#__PURE__*/React.createElement("img", {
    src: HLOGO('lfg-zest-red.png'),
    style: {
      height: '40px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: '7mm',
      marginTop: '12px',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "The Fund"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HLead, null, d.mission), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: '15px',
      fontWeight: 600,
      color: 'var(--accent)',
      margin: '6px 0 4px'
    }
  }, "The Investment Strategy"), /*#__PURE__*/React.createElement(HLead, null, d.strategyText), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '20px',
      marginTop: 'auto',
      padding: '12px 14px',
      background: 'var(--doc-mist)',
      borderLeft: '3px solid var(--accent-2)'
    }
  }, /*#__PURE__*/React.createElement(HKpiStat, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(HKpiStat, {
    label: "YTD",
    value: /*#__PURE__*/React.createElement(HPerf, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(HKpiStat, {
    label: "AuM",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, isAlloc ? 'Key Term Sheet' : 'General Information', " & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HGenInfo, {
    id: d.layout + '-geninfo',
    rows: d.generalInfo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '14px'
    }
  }, /*#__PURE__*/React.createElement(HLabel, null, "Risk Category (SRI)"), /*#__PURE__*/React.createElement(HLabel, null, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(HRisk, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(HSfdr, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(HGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(HModule, {
    id: "h-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HCum, {
    monthly: d.monthly,
    base: d.startNav || 100,
    height: 120,
    id: "perf-cum",
    title: "Performance Since Inception"
  })), /*#__PURE__*/React.createElement(HModule, {
    id: "h-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), /*#__PURE__*/React.createElement(HBars, {
    monthly: d.monthly,
    height: 92,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  })), /*#__PURE__*/React.createElement(HModule, {
    id: "h-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HSectionTitle, {
    variant: "bar"
  }, "Monthly Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '7px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(HBars, {
    monthly: d.monthly,
    height: 110,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(HMonthly, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(HFoot, {
    left: "HIVE ILP (Ireland) \xB7 IM LFG+Zest SA \xB7 ManCo AQA Capital (MT)",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(HCanvasPages, {
    docKey: "hive",
    family: "hive",
    d: d,
    logo: "lfg-zest-red.png",
    serif: true,
    footerLeft: "More information: info@lfgzest.com \xB7 info@aqa-capital.com",
    presets: presets2,
    pagesSeed: [{
      id: 'hive-p2'
    }],
    blockSeeds: {
      'hive-p2': seed2
    },
    fixedBefore: 1
  }));
}
window.Factsheets.HiveFactsheet = HiveFactsheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/FactsheetHive.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/FactsheetVG.jsx
try { (() => {
/* Factsheet layouts — VG/AQA.  2-page A4 model shared by all families:
   PAGE 1 → identity, KPIs/costs, line + bar performance, monthly matrix.
   PAGE 2 → breakdown, holdings/share classes, manager, disclaimer.
   Defines shared page helpers on window.Factsheets. */

const DS = window.FundFactsheetDesignSystem_2d23bc;
const {
  PerfValue,
  SectionTitle,
  Badge,
  KpiStat,
  InfoTable,
  MonthlyReturnsTable,
  ShareClassTable,
  HoldingsTable,
  RiskScale,
  SfdrBadge,
  BrandHeader,
  FundManagerBio,
  Disclaimer
} = DS;
const VCum = window.KitCharts.CumulativeChart;
const VBars = window.KitCharts.MonthlyBars;
const VCat = window.KitCharts.CatChart;
const {
  ModuleGrid,
  Module,
  EditableTable,
  ModuleCanvas,
  CanvasPages
} = window.KitLayout;
const LOGO = s => `../../assets/logos/${s}`;
const DISCLAIMER = [{
  heading: 'No distribution, no offer, no advice.',
  body: 'The information herein is purely informative and shall in no way constitute an invitation, offer, recommendation or advice to buy or sell securities or financial instruments. This marketing communication is distributed for information purposes only and does not constitute an offer to subscribe for shares of the Fund.'
}, {
  heading: 'No guarantee.',
  body: 'Every care has been taken in preparing this document; however the content may not always be correct, accurate, complete or up to date. In no circumstance — including negligence — may the Fund or its directors be held liable for any loss deriving from the use of this document.'
}, {
  heading: 'Investment risks.',
  body: 'Past performance is not a guide to future performance. The performance data does not take into account commissions and costs incurred on issue and redemption of units. The value of investments and any income can go down as well as up and may be affected by exchange-rate fluctuations; an investor may not get back the amount invested.'
}];
function A4({
  family,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "a4",
    "data-family": family,
    "data-screen-label": "factsheet-page",
    style: {
      width: '210mm',
      minHeight: '297mm',
      background: 'var(--surface-page)',
      color: 'var(--doc-ink)',
      fontFamily: 'var(--font-body)',
      padding: 'var(--page-margin)',
      boxSizing: 'border-box',
      boxShadow: 'var(--shadow-sheet)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, children);
}
const Lead = ({
  children
}) => /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: '11px',
    lineHeight: 1.5,
    color: 'var(--ink-700)',
    margin: '0 0 8px',
    textWrap: 'pretty'
  }
}, children);
const Bullets = ({
  items
}) => /*#__PURE__*/React.createElement("ul", {
  style: {
    margin: '0 0 8px',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  }
}, items.map((b, i) => /*#__PURE__*/React.createElement("li", {
  key: i,
  style: {
    display: 'flex',
    gap: '6px',
    fontSize: '10.5px',
    lineHeight: 1.4,
    color: 'var(--ink-700)'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'var(--accent)',
    fontWeight: 700
  }
}, "\u2713"), /*#__PURE__*/React.createElement("span", null, b))));
const Foot = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '8px',
    color: 'var(--ink-400)',
    marginTop: '4px'
  }
}, children);

/* Page footer pinned to bottom of the sheet */
function PageFoot({
  left,
  page,
  total = 2
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '8px',
      color: 'var(--ink-400)',
      borderTop: '0.75px solid var(--doc-line)'
    }
  }, /*#__PURE__*/React.createElement("span", null, left), /*#__PURE__*/React.createElement("span", null, "Page ", page, " of ", total));
}
/* Compact running header for continuation pages */
function MiniHeader({
  d,
  variant = 'underline',
  serif = false,
  logo
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '6px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: serif ? 'var(--font-serif)' : 'var(--font-body)',
      fontWeight: serif ? 600 : 800,
      fontSize: serif ? '18px' : '15px',
      color: 'var(--accent)',
      letterSpacing: serif ? 0 : '-0.01em'
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '8px',
      color: 'var(--ink-400)',
      textTransform: 'uppercase',
      letterSpacing: '.08em'
    }
  }, d.meta.asOf, " \xB7 Marketing Material"), logo && /*#__PURE__*/React.createElement("img", {
    src: LOGO(logo),
    style: {
      height: '20px'
    }
  })));
}
function PerfDuo({
  d,
  base = 100
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VCum, {
    monthly: d.monthly,
    base: base,
    height: 132,
    id: "perf-cum",
    title: "Performance Since Inception"
  }), /*#__PURE__*/React.createElement(Foot, null, "Rebased to ", base, " at inception \xB7 net of costs."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '10px'
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 104,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  }));
}

/* Shared "Other Share Classes" table block (dynamic rows AND columns) reused by all families */
function shareClassBlock(d) {
  return {
    key: 'shareclasses',
    kind: 'table',
    w: 'full',
    title: 'Other Share Classes',
    accentHeader: true,
    zebra: true,
    columns: [{
      key: 'name',
      label: 'Class'
    }, {
      key: 'isin',
      label: 'ISIN',
      mono: true
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'nav',
      label: 'NAV',
      type: 'num',
      dp: 2
    }, {
      key: 'ytd',
      label: 'YTD',
      type: 'pct'
    }],
    rows: (d.shareClasses || []).map(s => ({
      name: s.name,
      isin: s.isin,
      ccy: s.ccy,
      nav: s.nav,
      ytd: +((s.ytd || 0) * 100).toFixed(2)
    }))
  };
}

/* ============================================================ VG / AQA ============================================================ */
function VGFactsheet({
  d
}) {
  const isMBC = d.layout === 'vg-mbc';
  const pageTotal = window.__pageTotal ? window.__pageTotal('vg', [{
    id: 'vg-p2'
  }], 1) : 2;

  /* page-2 freeform canvas: seeded preset blocks, plus user-created blocks */
  const seed2 = [{
    key: 'breakdown',
    kind: 'preset',
    preset: 'breakdown',
    w: 'full'
  }, shareClassBlock(d), {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: DISCLAIMER.map(b => b.heading + ' ' + b.body).join('\n\n')
  }];
  const presets2 = {
    breakdown: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      variant: "underline"
    }, isMBC ? 'Asset Allocation — Strategy Breakdown' : 'Sectorial Allocation — Passive vs Active'), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), isMBC ? /*#__PURE__*/React.createElement(StrategyTable, {
      rows: d.strategy
    }) : /*#__PURE__*/React.createElement(PassiveActiveTable, {
      rows: d.sectors
    })),
    shareclasses: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
      variant: "underline"
    }, "Other Share Classes"), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '8px'
      }
    }), /*#__PURE__*/React.createElement(ShareClassEditable, {
      rows: d.shareClasses
    }))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(A4, {
    family: "vg"
  }, /*#__PURE__*/React.createElement(BrandHeader, {
    date: `Monthly Factsheet · ${d.meta.asOf}`,
    eyebrow: "Marketing Material",
    tag: d.meta.category,
    logos: d.logos.map(l => ({
      ...l,
      src: LOGO(l.src)
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '12px',
      margin: '12px 0 10px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: '23px',
      letterSpacing: '-0.02em',
      lineHeight: 1.05,
      margin: 0,
      color: 'var(--accent)'
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent",
    style: {
      flex: '0 0 auto',
      whiteSpace: 'nowrap'
    }
  }, d.meta.shareClass)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6mm',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Fund's Mission"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Lead, null, d.mission), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Objective & Strategy"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Bullets, {
    items: d.objective
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Investment Process"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(Lead, null, d.process), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '18px',
      marginTop: 'auto',
      paddingTop: '12px',
      padding: '10px 12px',
      background: 'var(--doc-mist)',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement(KpiStat, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(KpiStat, {
    label: "Perf YTD",
    value: /*#__PURE__*/React.createElement(PerfValue, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(KpiStat, {
    label: "Fund Size",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "General Information & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(GeneralInfoEditable, {
    rows: d.generalInfo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, "Risk Category (SRI)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RiskScale, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(SfdrBadge, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(ModuleGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(Module, {
    id: "p1-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Performance Since Inception"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VCum, {
    monthly: d.monthly,
    base: 100,
    height: 132,
    id: "perf-cum",
    title: "Performance Since Inception"
  }), /*#__PURE__*/React.createElement(Foot, null, "Rebased to 100 at inception \xB7 net of costs.")), /*#__PURE__*/React.createElement(Module, {
    id: "p1-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance vs Zero"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 96,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  })), /*#__PURE__*/React.createElement(Module, {
    id: "p1-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SectionTitle, {
    variant: "underline"
  }, "Monthly Performance (since inception)"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(VBars, {
    monthly: d.monthly,
    height: 120,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(MonthlyReturnsTable, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(PageFoot, {
    left: "VG SICAV SA \xB7 UCITS \xB7 Luxembourg \u2014 reserved to professional investors",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(CanvasPages, {
    docKey: "vg",
    family: "vg",
    d: d,
    logo: d.logos[0].src,
    footerLeft: "More information: info@aqa-capital.com \xB7 www.aqa-capital.com",
    presets: presets2,
    pagesSeed: [{
      id: 'vg-p2'
    }],
    blockSeeds: {
      'vg-p2': seed2
    },
    fixedBefore: 1
  }));
}

/* General Information & Costs as an editable key/value table (+/− rows) */
function GeneralInfoEditable({
  rows
}) {
  const data = rows.map(r => ({
    label: r.label,
    value: r.value
  }));
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-geninfo",
    noHead: true,
    rows: data,
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}

/* Passive-vs-Active sectors as an editable table (sector · bar · passive · active · total) */
function PassiveActiveTable({
  rows
}) {
  const data = rows.map(s => ({
    sector: s.sector,
    passive: +(s.passive * 100).toFixed(2),
    active: +(s.active * 100).toFixed(2)
  }));
  const REF = 40; // bar scale reference (%)
  const bar = r => {
    const tot = (+r.passive || 0) + (+r.active || 0);
    const pw = tot ? +r.passive / tot * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '8px',
        width: `${Math.min(100, tot / REF * 100)}%`,
        borderRadius: '2px',
        overflow: 'hidden',
        minWidth: '4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${pw}%`,
        background: 'var(--cat-3)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${100 - pw}%`,
        background: 'var(--accent)'
      }
    }));
  };
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-pa",
    rows: data,
    columns: [{
      key: 'sector',
      label: 'Sector'
    }, {
      key: 'bar',
      label: '',
      compute: bar,
      width: '34%'
    }, {
      key: 'passive',
      label: 'Passive',
      type: 'pct',
      color: () => 'var(--cat-3)'
    }, {
      key: 'active',
      label: 'Active',
      type: 'pct',
      color: () => 'var(--accent)'
    }, {
      key: 'total',
      label: 'Total',
      type: 'pct',
      bold: true,
      compute: r => ((+r.passive || 0) + (+r.active || 0)).toFixed(2) + '%'
    }]
  });
}

/* MBC strategy weights as an editable table */
function StrategyTable({
  rows
}) {
  const data = rows.map(s => ({
    name: s.name,
    weight: +(s.weight * 100).toFixed(2)
  }));
  const max = Math.max(...data.map(r => r.weight), 1);
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-strategy",
    rows: data,
    columns: [{
      key: 'name',
      label: 'Strategy'
    }, {
      key: 'bar',
      label: '',
      width: '34%',
      compute: r => /*#__PURE__*/React.createElement("div", {
        style: {
          height: '8px',
          width: `${r.weight / max * 100}%`,
          minWidth: '4px',
          background: 'var(--accent)',
          borderRadius: '2px'
        }
      })
    }, {
      key: 'weight',
      label: 'Wgt %',
      type: 'pct',
      bold: true
    }]
  });
}

/* Share classes as an editable table */
function ShareClassEditable({
  rows
}) {
  const data = rows.map(s => ({
    name: s.name,
    isin: s.isin,
    ccy: s.ccy,
    nav: s.nav,
    ytd: +(s.ytd * 100).toFixed(2)
  }));
  return /*#__PURE__*/React.createElement(EditableTable, {
    id: "vg-sc",
    accentHeader: true,
    zebra: true,
    rows: data,
    columns: [{
      key: 'name',
      label: 'Class'
    }, {
      key: 'isin',
      label: 'ISIN',
      mono: true
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'nav',
      label: 'NAV',
      type: 'num',
      dp: 2
    }, {
      key: 'ytd',
      label: 'YTD',
      type: 'pct',
      bold: true,
      color: r => +r.ytd >= 0 ? 'var(--pos)' : 'var(--neg)'
    }]
  });
}
window.Factsheets = {
  VGFactsheet,
  A4,
  DISCLAIMER,
  Lead,
  Bullets,
  Foot,
  LOGO,
  PageFoot,
  MiniHeader,
  PerfDuo,
  shareClassBlock
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/FactsheetVG.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/FactsheetZest.jsx
try { (() => {
/* Zest AM SICAV factsheet — navy/teal, dense Morningstar-style module grid. */
const DSz = window.FundFactsheetDesignSystem_2d23bc;
const {
  SectionTitle: ZSection,
  Badge: ZBadge,
  KpiStat: ZKpi,
  InfoTable: ZInfo,
  MonthlyReturnsTable: ZMonthly,
  HoldingsTable: ZHoldings,
  FundManagerBio: ZBio,
  Disclaimer: ZDisc,
  PerfValue: ZPerf,
  RiskScale: ZRisk,
  SfdrBadge: ZSfdr
} = DSz;
const {
  CumulativeChart: ZCum,
  Donut: ZDonut,
  CatChart: ZCat
} = window.KitCharts;
const ZMBars = window.KitCharts.MonthlyBars;
const {
  A4: ZA4,
  DISCLAIMER: ZDISC,
  Lead: ZLead,
  LOGO: ZLOGO,
  Bullets: ZBullets,
  PageFoot: ZFoot,
  MiniHeader: ZMini
} = window.Factsheets;
const {
  CanvasPages: ZCanvasPages,
  EditableTable: ZEditable,
  ModuleGrid: ZGrid,
  Module: ZMod
} = window.KitLayout;

/* General Information & Costs as an editable key/value table — Zest style */
function ZGenInfo({
  rows,
  id
}) {
  return /*#__PURE__*/React.createElement(ZEditable, {
    id: id,
    noHead: true,
    rows: rows.map(r => ({
      label: r.label,
      value: r.value
    })),
    columns: [{
      key: 'label',
      color: () => 'var(--ink-600)'
    }, {
      key: 'value',
      align: 'right',
      bold: true
    }]
  });
}
const ZLabel = ({
  children
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: '8.5px',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: 'var(--accent-2)',
    fontWeight: 700,
    marginBottom: '5px'
  }
}, children);
function ZDonutBlock({
  data,
  id,
  title
}) {
  const cats = ['#14153e', '#2e5f9e', '#0f4c7d', '#5b8cc4', '#8aa9d2', '#b8c6d8'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(ZDonut, {
    data: data,
    size: 88,
    thickness: 17,
    id: id,
    title: title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      flex: 1
    }
  }, data.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '9px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '9px',
      height: '9px',
      borderRadius: '2px',
      background: r.color || cats[i % cats.length]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--doc-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 700
    }
  }, (r.weight * 100).toFixed(1), "%")))));
}
function Stars({
  n = 4
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent-2)',
      fontSize: '14px',
      letterSpacing: '2px'
    }
  }, '★'.repeat(n), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--line-strong)'
    }
  }, '★'.repeat(5 - n)));
}
function ZModule({
  title,
  children,
  span = 1
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: `span ${span}`,
      border: '1px solid var(--doc-line)',
      borderRadius: '4px',
      overflow: 'hidden',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--doc-mist)',
      color: 'var(--accent)',
      fontSize: '8.5px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      padding: '5px 8px',
      borderBottom: '1px solid var(--doc-line)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px'
    }
  }, children));
}
function ZBars({
  data,
  id,
  title
}) {
  return /*#__PURE__*/React.createElement(ZCat, {
    data: data,
    type: "bar",
    compact: true,
    id: id,
    title: title
  });
}
function ZSleeveBanner({
  label,
  weight,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gridColumn: '1 / -1',
      background: accent ? 'var(--accent)' : 'var(--accent-2)',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 700
    }
  }, (weight * 100).toFixed(1), "% of NAV"));
}
function ZMiniKpi({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '7.5px',
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: 'var(--ink-500)',
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      fontWeight: 700,
      color: 'var(--accent)'
    }
  }, value));
}
function ZestFactsheet({
  d
}) {
  const balanced = !!d.balanced;
  const pageTotal = window.__pageTotal ? window.__pageTotal('zest', d.balanced ? [{
    id: 'zest-p2'
  }, {
    id: 'zest-p3'
  }] : [{
    id: 'zest-p2'
  }], 1) : d.balanced ? 3 : 2;

  /* page-2 seed = self-contained, individually copyable blocks (charts/tables/text) */
  const ser = (arr, k = 'weight') => (arr || []).map(r => ({
    name: r.name || r.sector,
    value: +((r[k] || 0) * 100).toFixed(2)
  }));
  const kvCols = [{
    key: 'label'
  }, {
    key: 'value',
    align: 'right',
    bold: true
  }];
  const disclaimerBlock = {
    key: 'disclaimer',
    kind: 'text',
    w: 'full',
    size: 'fine',
    title: 'Disclaimer',
    text: ZDISC.map(b => b.heading + ' ' + b.body).join('\n\n')
  };
  const seed2 = balanced ? [{
    key: 'alloc',
    kind: 'chart',
    w: 'third',
    title: 'Asset Allocation',
    chartType: 'donut',
    series: ser(d.allocation)
  }, {
    key: 'currency',
    kind: 'chart',
    w: 'third',
    title: 'Currency Allocation',
    chartType: 'bar',
    series: ser(d.currency)
  }, {
    key: 'metrics',
    kind: 'table',
    w: 'third',
    title: 'Portfolio Metrics',
    noHead: true,
    columns: kvCols,
    rows: d.metrics.map(r => ({
      ...r
    }))
  }, {
    key: 'eq-head',
    kind: 'banner',
    w: 'full',
    accent: true,
    title: 'Equity Sleeve',
    value: (d.equitySleeve.weight * 100).toFixed(1) + '% of NAV',
    sub: 'Perf MTD ' + (d.equitySleeve.perfMtd * 100).toFixed(2) + '%   ·   Contribution +' + (d.equitySleeve.contribution * 100).toFixed(2) + '%   ·   ' + d.equitySleeve.names + ' holdings'
  }, {
    key: 'eq-sectors',
    kind: 'chart',
    w: 'half',
    title: 'Equity — Sector Exposure',
    chartType: 'bar',
    series: ser(d.equitySleeve.sectors)
  }, {
    key: 'eq-holdings',
    kind: 'chart',
    w: 'half',
    title: 'Top Equity Holdings',
    chartType: 'bar',
    series: ser(d.holdings.slice(0, 8))
  }, {
    key: 'fi-head',
    kind: 'banner',
    w: 'full',
    accent: false,
    title: 'Fixed Income Sleeve',
    value: (d.fiSleeve.weight * 100).toFixed(1) + '% of NAV',
    sub: 'Yield to Maturity ' + (d.fiSleeve.ytm * 100).toFixed(2) + '%   ·   Duration ' + d.fiSleeve.duration + '   ·   ' + d.fiSleeve.issuers + ' issuers'
  }, {
    key: 'fi-ratings',
    kind: 'chart',
    w: 'half',
    title: 'Rating Breakdown',
    chartType: 'bar',
    series: ser(d.fiSleeve.ratings)
  }, {
    key: 'fi-credit',
    kind: 'table',
    w: 'half',
    title: 'Credit Quality',
    noHead: true,
    columns: kvCols,
    rows: [{
      label: 'IG / HY — by Issuer',
      value: d.fiSleeve.igHyIssuer
    }, {
      label: 'IG / HY — by Issue',
      value: d.fiSleeve.igHyIssue
    }, {
      label: 'Average Yield to Maturity',
      value: (d.fiSleeve.ytm * 100).toFixed(2) + '%'
    }, {
      label: 'Modified Duration',
      value: String(d.fiSleeve.duration)
    }]
  }] : d.napr ? [{
    key: 'sectors',
    kind: 'chart',
    w: 'two-thirds',
    title: 'GICS Sector Allocation',
    chartType: 'bar',
    series: ser(d.sectors)
  }, {
    key: 'geography',
    kind: 'chart',
    w: 'third',
    title: 'Geographic Allocation',
    chartType: 'bar',
    series: ser(d.countries)
  }, {
    key: 'holdings',
    kind: 'table',
    w: 'full',
    title: 'Top 10 Holdings — Equity Sleeve',
    accentHeader: true,
    zebra: true,
    columns: [{
      key: 'name',
      label: 'Security'
    }, {
      key: 'sector',
      label: 'GICS Sector'
    }, {
      key: 'ccy',
      label: 'Ccy',
      align: 'center'
    }, {
      key: 'weight',
      label: 'Weight',
      type: 'pct',
      dp: 2
    }],
    rows: (d.holdings || []).map(h => ({
      name: h.name,
      sector: h.sector || '',
      ccy: h.ccy || 'USD',
      weight: +((h.weight || 0) * 100).toFixed(2)
    }))
  }, Object.assign({}, window.Factsheets.shareClassBlock(d), {
    w: 'full'
  }), {
    key: 'fees',
    kind: 'table',
    w: 'half',
    title: 'Fees & Classification',
    noHead: true,
    columns: kvCols,
    rows: d.generalInfo.slice(8).map(r => ({
      label: r.label,
      value: r.value
    }))
  }, {
    key: 'currency',
    kind: 'chart',
    w: 'half',
    title: 'Currency Allocation',
    chartType: 'bar',
    series: ser(d.currency || [{
      name: 'USD',
      weight: 1
    }])
  }, disclaimerBlock] : [{
    key: 'countries',
    kind: 'chart',
    w: 'third',
    title: 'Exposure by Country',
    chartType: 'bar',
    series: ser((d.countries || []).slice(0, 7))
  }, {
    key: 'sectors',
    kind: 'chart',
    w: 'third',
    title: 'Equity Sectors',
    chartType: 'bar',
    series: ser((d.sectors || []).slice(0, 7))
  }, {
    key: 'holdings',
    kind: 'chart',
    w: 'third',
    title: 'Top Holdings',
    chartType: 'bar',
    series: ser(d.holdings || [])
  }, {
    key: 'manager',
    kind: 'text',
    w: 'half',
    title: 'Fund Manager',
    text: d.manager.name + ' — ' + d.manager.role + '\n\n' + d.manager.bio
  }, {
    key: 'fees',
    kind: 'table',
    w: 'half',
    title: 'Fees & Classification',
    noHead: true,
    columns: kvCols,
    rows: d.generalInfo.slice(8).map(r => ({
      label: r.label,
      value: r.value
    }))
  }, window.Factsheets.shareClassBlock(d), disclaimerBlock];
  const presets2 = {};
  /* balanced fund spills share classes + disclaimer onto a second canvas page so each stays within A4 */
  const seed3 = [window.Factsheets.shareClassBlock(d), disclaimerBlock];
  const zPagesSeed = balanced ? [{
    id: 'zest-p2'
  }, {
    id: 'zest-p3'
  }] : [{
    id: 'zest-p2'
  }];
  const zBlockSeeds = balanced ? {
    'zest-p2': seed2,
    'zest-p3': seed3
  } : {
    'zest-p2': seed2
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ZA4, {
    family: "zest"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      borderBottom: '2px solid var(--accent)',
      paddingBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '24px',
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, d.meta.fundName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-geometric)',
      fontSize: '12px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--accent-2)',
      marginTop: '3px'
    }
  }, d.meta.subtitle, " \xB7 ", d.meta.shareClass)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--accent)',
      padding: '6px 8px',
      borderRadius: '4px',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: ZLOGO('zest-am-sicav.png'),
    style: {
      height: '26px',
      display: 'block',
      marginLeft: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '8px',
      color: 'var(--ink-400)',
      marginTop: '4px'
    }
  }, "As of ", d.meta.asOf, " \xB7 Marketing Material"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6mm',
      marginTop: '10px',
      alignItems: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "Fund's Mission"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(ZLead, null, d.mission), balanced && /*#__PURE__*/React.createElement(ZBullets, {
    items: d.objective
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '22px',
      alignItems: 'center',
      marginTop: 'auto',
      padding: '10px 14px',
      background: 'var(--doc-mist)',
      borderRadius: '4px'
    }
  }, /*#__PURE__*/React.createElement(ZKpi, {
    label: "NAV / Share",
    value: d.nutshell.nav
  }), /*#__PURE__*/React.createElement(ZKpi, {
    label: "Perf YTD",
    value: /*#__PURE__*/React.createElement(ZPerf, {
      value: d.nutshell.ytd,
      weight: 800
    }),
    accent: true
  }), /*#__PURE__*/React.createElement(ZKpi, {
    label: "Fund Size",
    value: d.nutshell.fundSize
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "General Information & Costs"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), /*#__PURE__*/React.createElement(ZGenInfo, {
    id: d.layout + '-geninfo',
    rows: d.generalInfo.slice(0, 8)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      columnGap: '18px',
      rowGap: '5px',
      alignItems: 'start',
      marginTop: 'auto',
      paddingTop: '14px'
    }
  }, /*#__PURE__*/React.createElement(ZLabel, null, "Risk Category (SRI)"), /*#__PURE__*/React.createElement(ZLabel, null, "SFDR"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ZRisk, {
    value: d.risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(ZSfdr, {
    value: d.sfdr
  }))))), /*#__PURE__*/React.createElement(ZGrid, {
    style: {
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-cum",
    order: 1,
    title: "Performance Since Inception",
    width: "full"
  }, /*#__PURE__*/React.createElement(ZModule, {
    title: "Performance Since Inception"
  }, /*#__PURE__*/React.createElement(ZCum, {
    monthly: d.monthly,
    base: d.startNav || 100,
    height: 148,
    id: "perf-cum",
    title: "Performance Since Inception"
  }))), /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-bars",
    order: 2,
    title: "Monthly Performance vs Zero",
    width: "full"
  }, /*#__PURE__*/React.createElement(ZModule, {
    title: "Monthly Performance vs Zero"
  }, /*#__PURE__*/React.createElement(ZMBars, {
    monthly: d.monthly,
    height: 132,
    id: "perf-bars",
    title: "Monthly Performance vs Zero"
  }))), /*#__PURE__*/React.createElement(ZMod, {
    id: "zp1-table",
    order: 3,
    title: "Monthly Performance (since inception)",
    width: "full",
    swap: ['table', 'chart']
  }, view => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ZSection, {
    variant: "underline"
  }, "Monthly Performance (since inception)"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '6px'
    }
  }), view === 'chart' ? /*#__PURE__*/React.createElement(ZMBars, {
    monthly: d.monthly,
    height: 110,
    id: "perf-table-chart",
    title: "Monthly Performance"
  }) : /*#__PURE__*/React.createElement(ZMonthly, {
    data: d.monthly
  })))), /*#__PURE__*/React.createElement(ZFoot, {
    left: "Zest Asset Management SICAV \xB7 UCITS \xB7 Luxembourg (RCS B 130156)",
    page: 1,
    total: pageTotal
  })), /*#__PURE__*/React.createElement(ZCanvasPages, {
    docKey: "zest",
    family: "zest",
    d: d,
    logo: "zest-am-sicav.png",
    footerLeft: "Source: Official NAV & Bloomberg \xB7 Distributed by LFG+Zest SA \xB7 info@lfgzest.com",
    presets: presets2,
    pagesSeed: zPagesSeed,
    blockSeeds: zBlockSeeds,
    fixedBefore: 1
  }));
}
window.Factsheets.ZestFactsheet = ZestFactsheet;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/FactsheetZest.jsx", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/chart-bridge.js
try { (() => {
/* Bridge between the factsheet data object and Chart Studio.
   - editableSeries(d): list the charts in a fund that can be opened in the studio.
   - applyModel(d, slot, model): write a studio model back into the fund object
     (mutates a clone the caller owns) and return it. Categorical edits change the
     underlying numbers; the performance slot maps month rows back to d.monthly and
     records type/colour in window.__perfStyle for the cumulative chart to honour. */
(function () {
  const MUP = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function getDeep(o, path) {
    return path.split('.').reduce((t, k) => t ? t[k] : undefined, o);
  }
  function setDeep(o, path, v) {
    const ks = path.split('.');
    let t = o;
    while (ks.length > 1) {
      const k = ks.shift();
      t = t[k] = t[k] || {};
    }
    t[ks[0]] = v;
  }
  const CAT = (field, title, type) => ({
    field,
    title,
    type
  });
  const CANDIDATES = [CAT('allocation', 'Asset Allocation', 'donut'), CAT('currency', 'Currency Allocation', 'donut'), CAT('sectors', 'Equity Sectors', 'bar'), CAT('countries', 'Exposure by Country', 'bar'), CAT('strategy', 'Strategy Breakdown', 'bar'), CAT('holdings', 'Top Holdings', 'bar'), CAT('equitySleeve.sectors', 'Equity Sleeve — Sectors', 'bar'), CAT('fiSleeve.ratings', 'Fixed Income — Ratings', 'column')];
  function flatMonthly(monthly) {
    const out = [];
    Object.keys(monthly).sort().forEach(y => MUP.forEach(m => {
      const v = monthly[y][m];
      if (v !== undefined && v !== null) out.push({
        y,
        m,
        name: `${m} ${y.slice(2)}`,
        value: +(v * 100).toFixed(3)
      });
    }));
    return out;
  }
  function editableSeries(d) {
    const list = [{
      slot: 'perf',
      title: 'Performance (monthly returns)',
      type: (window.__perfStyle || {}).type || 'area',
      kinds: ['area', 'line', 'column', 'bar'],
      series: flatMonthly(d.monthly)
    }];
    CANDIDATES.forEach(c => {
      const arr = getDeep(d, c.field);
      if (Array.isArray(arr) && arr.length && typeof arr[0].weight === 'number') {
        list.push({
          slot: c.field,
          title: c.title,
          type: c.type,
          kinds: ['bar', 'column', 'donut', 'pie', 'rose', 'treemap', 'funnel'],
          series: arr.map(r => ({
            name: r.name || r.sector,
            value: +((r.weight || 0) * 100).toFixed(2),
            color: r.color
          }))
        });
      }
    });
    return list;
  }
  function applyModel(d, slot, model) {
    if (slot === 'perf') {
      window.__perfStyle = d._perf = {
        type: model.type,
        color: (model.series.find(s => s.color) || {}).color
      };
      // map edited month rows back into the matrix
      const flat = flatMonthly(d.monthly);
      model.series.forEach((s, i) => {
        const f = flat[i];
        if (f && d.monthly[f.y]) d.monthly[f.y][f.m] = +s.value / 100;
      });
      // recompute YTD per year + nutshell
      Object.keys(d.monthly).forEach(y => {
        let c = 1,
          any = false;
        MUP.forEach(m => {
          const v = d.monthly[y][m];
          if (v != null) {
            c *= 1 + v;
            any = true;
          }
        });
        if (any) d.monthly[y].YTD = +(c - 1).toFixed(6);
      });
      const years = Object.keys(d.monthly).sort();
      const last = d.monthly[years[years.length - 1]];
      if (last && last.YTD != null) d.nutshell.ytd = last.YTD;
      return d;
    }
    // categorical: write weights + colours back
    const arr = getDeep(d, slot) || [];
    const next = model.series.map((s, i) => ({
      ...(arr[i] || {}),
      name: s.name,
      sector: s.name,
      weight: +s.value / 100,
      color: s.color
    }));
    setDeep(d, slot, next);
    return d;
  }
  window.FactsheetCharts = {
    editableSeries,
    applyModel
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/chart-bridge.js", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/data.js
try { (() => {
/* ============================================================
   Sample FundData — extracted from the 5 real marketing factsheets.
   Mirrors the FundData schema in ARCHITECTURE.md. Window global.
   Returns are decimal fractions. Demo / marketing figures only.
   ============================================================ */
window.FUND_DATA = {
  /* ---------------- VG / AQA ---------------- */
  'prime-guard': {
    family: 'vg',
    layout: 'vg-prime',
    meta: {
      fundName: 'Prime Guard US Fund',
      shareClass: 'Class I USD',
      asOf: '31.05.2026',
      category: 'Long US Equity',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'aqa-capital.png',
      role: 'ManCo & IM',
      h: 30
    }],
    nutshell: {
      nav: '118.77',
      ytd: 0.099,
      fundSize: 'USD 46.1M'
    },
    mission: 'The Fund provides investors with a strategic mix of passive and active exposure to the largest US stocks, balancing market correlation with targeted alpha generation and risk management.',
    objective: ['Passive Tracking (≈55%) of the largest US stocks', 'Alpha Generation (≈45%) — actively manages 60–100 US stocks via proprietary models', 'Drawdown Control — hedging activated only in extreme market conditions'],
    process: 'The Active Exposure is based on a quantamental approach applied to the largest US companies, ranked through proprietary quant-fundamental models (the sector analyser and the stock selection model). Expected tracking error 2–3%.',
    generalInfo: [{
      label: 'Name',
      value: 'Prime Guard US Fund'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of VG SICAV SA'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'ManCo & IM',
      value: 'AQA Capital'
    }, {
      label: 'Depositary Bank',
      value: 'Swissquote Bank'
    }, {
      label: 'Fund Currency',
      value: 'USD'
    }, {
      label: 'ISIN',
      value: 'LU2962132416',
      mono: true
    }, {
      label: 'Min. Subscription',
      value: "20'000"
    }, {
      label: 'Management Fees',
      value: '1.20%'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }, {
      label: 'Ongoing charges (I)',
      value: '1.83%'
    }],
    risk: 5,
    sfdr: 'Art 6',
    monthly: {
      2025: {
        JAN: 0,
        FEB: -.0209,
        MAR: -.0637,
        APR: -.0022,
        MAY: .059,
        JUN: .0406,
        JUL: .0166,
        AUG: .0192,
        SEP: .0364,
        OCT: .0165,
        NOV: -.0045,
        DEC: -.0096,
        YTD: .085
      },
      2026: {
        JAN: .0227,
        FEB: -.0118,
        MAR: -.0439,
        APR: .0933,
        MAY: .0404,
        YTD: .099
      }
    },
    cumulative: 'monthly',
    // build series from monthly
    shareClasses: [{
      isin: 'LU2962132333',
      name: 'R-EUR',
      ccy: 'EUR',
      aum: 2022465.42,
      nav: 115.12,
      mtd: .0388,
      ytd: .0879
    }, {
      isin: 'LU2962132689',
      name: 'I-EUR',
      ccy: 'EUR',
      aum: 6601855.02,
      nav: 111.21,
      mtd: .0388,
      ytd: .0901
    }, {
      isin: 'LU2962132507',
      name: 'I-CHF',
      ccy: 'CHF',
      aum: 7090811.61,
      nav: 102.41,
      mtd: .0372,
      ytd: .0815
    }, {
      isin: 'LU2962132416',
      name: 'I-USD',
      ccy: 'USD',
      aum: 26994967.69,
      nav: 118.77,
      mtd: .0404,
      ytd: .099
    }],
    sectors: [
    // {sector, fund, passive, active}
    {
      sector: 'Information Technology',
      fund: .3845,
      passive: .2853,
      active: .0992
    }, {
      sector: 'Communication Services',
      fund: .1102,
      passive: .0899,
      active: .0203
    }, {
      sector: 'Financials',
      fund: .1125,
      passive: .0427,
      active: .0698
    }, {
      sector: 'Consumer Discretionary',
      fund: .1005,
      passive: .0608,
      active: .0397
    }, {
      sector: 'Industrials',
      fund: .087,
      passive: .0116,
      active: .0754
    }, {
      sector: 'Health Care',
      fund: .0864,
      passive: .0343,
      active: .0521
    }, {
      sector: 'Consumer Staples',
      fund: .0457,
      passive: .0202,
      active: .0255
    }, {
      sector: 'Energy',
      fund: .0331,
      passive: .015,
      active: .0181
    }, {
      sector: 'Utilities',
      fund: .0215,
      passive: 0,
      active: .0215
    }, {
      sector: 'Materials',
      fund: .0184,
      passive: 0,
      active: .0184
    }]
  },
  'mbc': {
    family: 'vg',
    layout: 'vg-mbc',
    meta: {
      fundName: 'MBC Diversified Fund',
      shareClass: 'I2 USD',
      asOf: '31.05.2026',
      category: 'Fund of Hedge Funds',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'aqa-capital.png',
      role: 'ManCo & IM',
      h: 30
    }, {
      src: 'tages.png',
      role: 'Advisor',
      h: 22
    }],
    nutshell: {
      nav: '119.63',
      ytd: 0.0376,
      fundSize: 'EUR 11.6M'
    },
    mission: 'The MBC Diversified Fund is a UCITS portfolio with daily liquidity, leveraging a well-structured investment process to deliver stable returns.',
    objective: ['Limited beta to the equity market', 'Good protection capability in down markets', 'Expected target return roughly twice the volatility'],
    process: 'The investment strategy involves multi-layered screening and evaluation across manager research, capital allocation and risk management.',
    generalInfo: [{
      label: 'Name',
      value: 'MBC Diversified Fund'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of VG SICAV SA'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'ManCo & IM',
      value: 'AQA Capital Ltd.'
    }, {
      label: 'Depositary Bank',
      value: 'Swissquote Bank'
    }, {
      label: 'Fund Currency',
      value: 'EUR'
    }, {
      label: 'ISIN (I2 USD)',
      value: 'LU2853682941',
      mono: true
    }, {
      label: 'Min. Subscription',
      value: "50'000"
    }, {
      label: 'Management Fees',
      value: '1.50%'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }],
    risk: 4,
    sfdr: 'Art 8',
    monthly: {
      2024: {
        SEP: -.0027,
        OCT: -.0047,
        NOV: -.0029,
        DEC: -.0018,
        YTD: -.02
      },
      2025: {
        JAN: .0091,
        FEB: .0029,
        MAR: -.0037,
        APR: .005,
        MAY: .0224,
        JUN: -.0003,
        JUL: .0002,
        AUG: .0103,
        SEP: .0101,
        OCT: .0017,
        NOV: -.0031,
        DEC: .0098,
        YTD: .066
      },
      2026: {
        JAN: .0255,
        FEB: .0057,
        MAR: -.031,
        APR: .0329,
        MAY: .0053,
        YTD: .0376
      }
    },
    cumulative: 'monthly',
    shareClasses: [{
      isin: 'LU2853682941',
      name: 'I2-USD',
      ccy: 'USD',
      aum: 12381514.66,
      nav: 119.63,
      mtd: .0053,
      ytd: .0376
    }, {
      isin: 'LU2853682784',
      name: 'I2-EUR',
      ccy: 'EUR',
      aum: 201213.70,
      nav: 105.90,
      mtd: .0041,
      ytd: .032
    }],
    strategy: [{
      name: 'Global Macro',
      weight: .1735
    }, {
      name: 'Global Rates',
      weight: .1663
    }, {
      name: 'Engadine Long/Short Equity',
      weight: .1491
    }, {
      name: 'European Equity L/S',
      weight: .143
    }, {
      name: 'North America Long/Short Equity',
      weight: .1031
    }, {
      name: 'Event Driven',
      weight: .0953
    }, {
      name: 'Systematic Trend Following',
      weight: .0748
    }, {
      name: 'Global Bonds',
      weight: .0452
    }, {
      name: 'Global Equity Long Bias',
      weight: .0128
    }]
  },
  /* ---------------- HIVE / LFG·Zest ---------------- */
  'hive-equity': {
    family: 'hive',
    layout: 'hive-equity',
    cover: true,
    meta: {
      fundName: 'The Hive Equity Fund',
      subtitle: 'MONTHLY FACTSHEET',
      shareClass: 'USD',
      asOf: 'May 31, 2026',
      category: 'Long Equity',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'lfg-zest-red.png',
      role: 'Investment Manager',
      h: 38
    }],
    nutshell: {
      nav: '141.31',
      ytd: 0.0919,
      fundSize: 'USD 12.4M'
    },
    risk: 5,
    sfdr: 'Art 6',
    shareClasses: [{
      isin: 'IE000036PHN0',
      name: 'Class USD',
      ccy: 'USD',
      aum: 9100000,
      nav: 141.31,
      mtd: .0387,
      ytd: .0919
    }, {
      isin: 'IE000RFV0ON0',
      name: 'Class EUR (hgd)',
      ccy: 'EUR',
      aum: 3300000,
      nav: 138.04,
      mtd: .0371,
      ytd: .0884
    }],
    mission: 'The Hive Equity Fund is a long equity fund designed as an optimal proposition for US taxable investors categorized as qualified purchasers under 3(c)(7) of the 1940 Act — offering K-1 reporting and remaining outside 40 Act registration and PFIC requirements.',
    strategyText: 'A strategy that blends passive and active investing for high correlation to the largest US companies (expected tracking error 2–3%): ≈55% passive exposure to the largest companies, ≈45% actively managed across 60–100 names (min. mkt cap $5bn), with drawdown control hedging activated only in extreme circumstances.',
    generalInfo: [{
      label: 'Investment Manager',
      value: 'LFG+Zest SA (CH)'
    }, {
      label: 'Portfolio Managers',
      value: 'A. Conca, G. Nicodemo'
    }, {
      label: 'Launch Date',
      value: 'September 2023'
    }, {
      label: 'AuM',
      value: 'USD 12.4 M'
    }, {
      label: 'Jurisdiction',
      value: 'Ireland'
    }, {
      label: 'Structure',
      value: 'ILP QIAIF'
    }, {
      label: 'Depositary & Admin',
      value: 'Caceis (IR)'
    }, {
      label: 'ManCo',
      value: 'AQA Capital (MT)'
    }, {
      label: 'Class USD ISIN',
      value: 'IE000036PHN0',
      mono: true
    }, {
      label: 'Class EUR (hgd) ISIN',
      value: 'IE000RFV0ON0',
      mono: true
    }, {
      label: 'Management Fees',
      value: '1.40% p.a.'
    }, {
      label: 'Performance Fees (HWM)',
      value: '10%'
    }],
    manager: {
      name: 'Alberto Conca',
      role: 'CIO of LFG+Zest SA',
      bio: 'Alberto joined LFG+Zest in 2018 and has over 20 years in investment management. He co-managed long-short equity funds at Lemanik and Sequoia, the global long-short fund at Pioneer Alternative Investments, and was a partner at Kairos Alternative Investments. Graduated in Economics at the University of Pavia.'
    },
    monthly: {
      2023: {
        SEP: -.0184,
        OCT: -.0356,
        NOV: .0742,
        DEC: .0375,
        YTD: .055
      },
      2024: {
        JAN: .0064,
        FEB: .0397,
        MAR: .0257,
        APR: -.0415,
        MAY: .0407,
        JUN: .0111,
        JUL: .0049,
        AUG: .0179,
        SEP: .0095,
        OCT: -.0165,
        NOV: .0318,
        DEC: -.0205,
        YTD: .1112
      },
      2025: {
        JAN: .0241,
        FEB: -.0191,
        MAR: -.0652,
        APR: -.0016,
        MAY: .06,
        JUN: .0361,
        JUL: .0158,
        AUG: .019,
        SEP: .0361,
        OCT: .0145,
        NOV: -.0033,
        DEC: -.0114,
        YTD: .104
      },
      2026: {
        JAN: .0217,
        FEB: -.0117,
        MAR: -.046,
        APR: .0913,
        MAY: .0387,
        YTD: .0919
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    holdings: [{
      name: 'NVIDIA Corp',
      weight: .0791
    }, {
      name: 'Apple Inc',
      weight: .0713
    }, {
      name: 'Alphabet Inc-A',
      weight: .0642
    }, {
      name: 'Microsoft Corp',
      weight: .0499
    }, {
      name: 'Amazon.com Inc',
      weight: .0414
    }, {
      name: 'Broadcom Inc',
      weight: .0312
    }, {
      name: 'Meta Platforms-A',
      weight: .0216
    }, {
      name: 'Tesla Inc',
      weight: .0203
    }, {
      name: 'Micron Tech',
      weight: .0159
    }, {
      name: 'Eli Lilly & Co',
      weight: .0149
    }]
  },
  'hive-allocation': {
    family: 'hive',
    layout: 'hive-allocation',
    cover: true,
    meta: {
      fundName: 'Hive Funds Allocation',
      subtitle: 'MONTHLY REPORT',
      shareClass: 'A USD',
      asOf: 'April 30, 2026',
      category: 'Fund of Hedge Funds',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'lfg-zest-red.png',
      role: 'Investment Manager',
      h: 38
    }],
    nutshell: {
      nav: '—',
      ytd: 0.0669,
      fundSize: 'USD 16.4M'
    },
    risk: 4,
    sfdr: 'Art 8',
    shareClasses: [{
      isin: 'IE000A1USD00',
      name: 'Class A USD',
      ccy: 'USD',
      aum: 11200000,
      nav: 112.40,
      mtd: .0102,
      ytd: .0669
    }, {
      isin: 'IE000A1EUR00',
      name: 'Class A EUR',
      ccy: 'EUR',
      aum: 5200000,
      nav: 109.85,
      mtd: .0094,
      ytd: .0631
    }],
    mission: 'The Hive Funds Allocation is a Fund of Hedge Funds providing diversification by strategy, exposure, geography and functionality, to create an attractive risk-adjusted return stream across a full market cycle — including bear markets — via an all-weather, uncorrelated approach.',
    strategyText: 'The methodology combines a top-down environment assessment with bottom-up manager selection to dynamically build a portfolio that is both quantitatively and qualitatively robust.',
    generalInfo: [{
      label: 'Investment Manager',
      value: 'LFG+Zest SA (CH)'
    }, {
      label: 'Fund Manager',
      value: 'Alberto Conca'
    }, {
      label: 'Investment Advisor',
      value: 'Tages Capital (UK)'
    }, {
      label: 'Launch Date',
      value: 'September 2023'
    }, {
      label: 'AuM (USD)',
      value: "16'420'511"
    }, {
      label: 'Structure',
      value: 'ILP (IE)'
    }, {
      label: 'Depo & Admin',
      value: 'Caceis (Ireland)'
    }, {
      label: 'Management Company',
      value: 'AQA Capital (Malta)'
    }, {
      label: 'Class A USD ISIN',
      value: 'IE000BEFF4J2',
      mono: true
    }, {
      label: 'Management Fees',
      value: '1.40% p.a.'
    }, {
      label: 'Perf. Fees (HWM)',
      value: '10%'
    }],
    advisor: {
      name: 'Tages Capital',
      logo: 'tages.png',
      bio: 'Part of Investcorp-Tages, a specialist investor, manager and advisor of liquid alternative strategies with over 25 years of experience and $4.7B in revenue-generating assets, with offices in London, New York and Milan.'
    },
    monthly: {
      2023: {
        SEP: -.0009,
        OCT: -.0059,
        NOV: -.0109,
        DEC: -.0108,
        YTD: -.0282
      },
      2024: {
        JAN: .0082,
        FEB: .0134,
        MAR: -.0003,
        APR: .0132,
        MAY: .0039,
        JUN: .0056,
        JUL: -.0103,
        AUG: -.0139,
        SEP: .0015,
        OCT: -.001,
        NOV: .0145,
        DEC: .002,
        YTD: .0369
      },
      2025: {
        JAN: -.0001,
        FEB: -.0155,
        MAR: .0003,
        APR: -.0074,
        MAY: .008,
        JUN: .0027,
        JUL: .0032,
        AUG: .0074,
        SEP: .0057,
        OCT: .0049,
        NOV: .0016,
        DEC: .0114,
        YTD: .0222
      },
      2026: {
        JAN: .0166,
        FEB: .0202,
        MAR: -.0158,
        APR: .0452,
        YTD: .0669
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    strategy: [{
      name: 'Merger Arbitrage',
      weight: .166
    }, {
      name: 'Market Neutral Credit',
      weight: .145
    }, {
      name: 'Fundamental L/S',
      weight: .132
    }, {
      name: 'Activist Event Driven',
      weight: .121
    }, {
      name: 'Emerging Credit',
      weight: .098
    }, {
      name: 'Global Rates Macro',
      weight: .091
    }, {
      name: 'Commodities L/S',
      weight: .088
    }, {
      name: 'NA SMID L/S',
      weight: .087
    }, {
      name: 'US Equity L/S',
      weight: .051
    }, {
      name: 'Systematic EM Macro',
      weight: .019
    }]
  },
  /* ---------------- Zest AM SICAV ---------------- */
  'zest-med': {
    family: 'zest',
    layout: 'zest-morningstar',
    cover: false,
    meta: {
      fundName: 'Zest Mediterraneus',
      subtitle: 'Absolute Value',
      shareClass: 'I Acc',
      asOf: '31.05.2026',
      category: 'EAA Fund Long/Short Equity Europe',
      navFreq: 'Daily',
      rating: 4
    },
    logos: [{
      src: 'zest-am-sicav.svg',
      role: 'Investment Manager',
      h: 34
    }],
    nutshell: {
      nav: '118.43',
      rating: 'QQQQ',
      ytd: 0.0599,
      fundSize: 'EUR 68.9M'
    },
    shareClasses: [{
      isin: 'LU1216091261',
      name: 'I Acc',
      ccy: 'EUR',
      aum: 52400000,
      nav: 118.43,
      mtd: .0121,
      ytd: .0599
    }, {
      isin: 'LU1216091428',
      name: 'R Acc',
      ccy: 'EUR',
      aum: 16500000,
      nav: 113.07,
      mtd: .0112,
      ytd: .0541
    }],
    mission: 'Zest Mediterraneus Absolute Value is an open-end fund incorporated in Luxembourg. It seeks a consistent, absolute return while emphasising capital preservation in the medium term, investing long and short primarily in liquid European equities — focused on Italy, Spain, France and Portugal.',
    generalInfo: [{
      label: 'Name',
      value: 'Zest Mediterraneus Abs. Value'
    }, {
      label: 'ISIN',
      value: 'LU1216091261',
      mono: true
    }, {
      label: 'Manager',
      value: 'Gianrito Nicodemo'
    }, {
      label: 'Category',
      value: 'L/S Equity Europe'
    }, {
      label: 'Fund Size',
      value: "68'898'030 EUR"
    }, {
      label: 'Total Ret YTD',
      value: '5.99%'
    }, {
      label: 'Morningstar Rating',
      value: 'QQQQ'
    }, {
      label: 'Ret Annlzd 3 Yr',
      value: '8.50%'
    }, {
      label: 'Sharpe 3 Yr',
      value: '0.78'
    }, {
      label: 'Management Fee',
      value: '1.00%'
    }, {
      label: 'Performance Fee',
      value: '20.00%'
    }, {
      label: 'PRIIPS Ongoing Costs',
      value: '1.59%'
    }],
    risk: 4,
    sfdr: 'Art 8',
    manager: {
      name: 'Gianrito Nicodemo',
      role: 'Portfolio Manager',
      bio: 'Manages the Mediterraneus Absolute Value strategy, focused on liquid European equities across Italy, Spain, France and Portugal, with an absolute-return, capital-preservation mandate.'
    },
    monthly: {
      2023: {
        JAN: .0454,
        FEB: .0164,
        MAR: .0248,
        APR: .0015,
        MAY: .0212,
        JUN: .0124,
        JUL: .0235,
        AUG: .0102,
        SEP: .0145,
        OCT: .0316,
        NOV: .0475,
        DEC: .0162,
        YTD: .0551
      },
      2024: {
        JAN: .0008,
        FEB: .0034,
        MAR: .0286,
        APR: .0041,
        MAY: .0351,
        JUN: .0296,
        JUL: .0075,
        AUG: .0101,
        SEP: .0061,
        OCT: .0208,
        NOV: .0178,
        DEC: .0137,
        YTD: .0255
      },
      2025: {
        JAN: .0147,
        FEB: .0272,
        MAR: .0152,
        APR: .0119,
        MAY: .0339,
        JUN: .0042,
        JUL: .0053,
        AUG: .0172,
        SEP: .004,
        OCT: .0013,
        NOV: .0029,
        DEC: .0255,
        YTD: .1279
      },
      2026: {
        JAN: .0247,
        FEB: .0001,
        MAR: .0349,
        APR: .0437,
        MAY: .0269,
        YTD: .0599
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    countries: [{
      name: 'Italy',
      weight: .445
    }, {
      name: 'France',
      weight: .166
    }, {
      name: 'Netherlands',
      weight: .099
    }, {
      name: 'Spain',
      weight: .09
    }, {
      name: 'Germany',
      weight: .071
    }, {
      name: 'Greece',
      weight: .048
    }, {
      name: 'Singapore',
      weight: .024
    }, {
      name: 'Finland',
      weight: .022
    }, {
      name: 'Belgium',
      weight: .019
    }, {
      name: 'United States',
      weight: .016
    }],
    sectors: [{
      name: 'Financial Services',
      weight: .233
    }, {
      name: 'Technology',
      weight: .196
    }, {
      name: 'Industrials',
      weight: .179
    }, {
      name: 'Utilities',
      weight: .109
    }, {
      name: 'Consumer Cyclical',
      weight: .099
    }, {
      name: 'Healthcare',
      weight: .049
    }, {
      name: 'Communication Services',
      weight: .049
    }, {
      name: 'Consumer Defensive',
      weight: .041
    }, {
      name: 'Real Estate',
      weight: .024
    }, {
      name: 'Basic Materials',
      weight: .02
    }],
    holdings: [{
      name: 'LUVE SpA',
      weight: .0522
    }, {
      name: 'Intesa Sanpaolo',
      weight: .0446
    }, {
      name: 'EssilorLuxottica',
      weight: .0297
    }, {
      name: 'Generali',
      weight: .029
    }, {
      name: 'Banca MPS',
      weight: .026
    }, {
      name: 'Schneider Electric SE',
      weight: .0259
    }, {
      name: 'Banco BPM SpA',
      weight: .0258
    }]
  },
  'zest-napr': {
    family: "zest",
    layout: "zest-morningstar",
    cover: false,
    meta: {
      fundName: "Zest North America Pairs Relative",
      subtitle: "Equity Market Neutral",
      shareClass: "R EUR",
      asOf: "31.05.2026",
      category: "EAA Fund Equity Market Neutral",
      navFreq: "Daily"
    },
    logos: [{
      src: "zest-am-sicav.svg",
      role: "Investment Manager",
      h: 34
    }],
    nutshell: {
      nav: "1’243.73",
      mtd: 0.0007,
      ytd: 0.0119,
      fundSize: "EUR 53.5M"
    },
    risk: 3,
    sfdr: "Art 6",
    shareClasses: [{
      isin: "LU1216084993",
      name: "R EUR",
      ccy: "EUR",
      aum: 0,
      nav: 1243.73,
      mtd: 0.0007,
      ytd: 0.0119
    }, {
      isin: "LU1216084308",
      name: "I EUR",
      ccy: "EUR",
      aum: 0,
      nav: 1452.75,
      mtd: 0.0012,
      ytd: 0.0145
    }, {
      isin: "LU1532291983",
      name: "R USD",
      ccy: "USD",
      aum: 0,
      nav: 142.79,
      mtd: 0.0019,
      ytd: 0.018
    }, {
      isin: "LU1532291801",
      name: "I USD",
      ccy: "USD",
      aum: 0,
      nav: 123.92,
      mtd: 0.0024,
      ytd: 0.0197
    }, {
      isin: "LU2510449965",
      name: "I CHF",
      ccy: "CHF",
      aum: 0,
      nav: 109.98,
      mtd: -0.0009,
      ytd: 0.0036
    }],
    mission: "Zest North America Pairs Relative seeks consistent, low-volatility absolute returns largely independent of the direction of equity markets. The strategy invests in North-American equities through a market-neutral, pairs-relative approach — pairing long and short positions of comparable size within the same sector, so that performance is driven by relative stock selection rather than broad market exposure.",
    generalInfo: [{
      label: "Name",
      value: "Zest N. America Pairs Relative"
    }, {
      label: "ISIN",
      value: "LU1216084993",
      mono: true
    }, {
      label: "Manager",
      value: "Pasquale Corvino"
    }, {
      label: "Category",
      value: "Equity Market Neutral"
    }, {
      label: "Fund Size",
      value: "EUR 53.5M"
    }, {
      label: "Currency",
      value: "EUR"
    }, {
      label: "Total Ret YTD",
      value: "1.19%"
    }, {
      label: "Ret Annlzd 3 Yr",
      value: "4.30%"
    }, {
      label: "Management Fee",
      value: "1.50%"
    }, {
      label: "Performance Fee",
      value: "20.00%"
    }, {
      label: "Max Front Load",
      value: "3.00%"
    }, {
      label: "Domicile",
      value: "Luxembourg"
    }],
    manager: {
      name: "Pasquale Corvino",
      role: "Portfolio Manager",
      bio: "Manages the North America Pairs Relative strategy, an equity-market-neutral book of paired long/short positions in liquid large-cap US equities, targeting low correlation to equity indices across market regimes."
    },
    monthly: {
      2019: {
        JAN: 0.0899,
        FEB: 0.0073,
        MAR: -0.0027,
        APR: 0.0107,
        MAY: -0.033,
        JUN: 0.0533,
        JUL: 0.008,
        AUG: -0.005,
        SEP: 0.0059,
        OCT: 0.009,
        NOV: -0.0013,
        DEC: 0.0015,
        YTD: 0.1476
      },
      2020: {
        JAN: -0.0005,
        FEB: 0.0343,
        MAR: 0.0026,
        APR: 0.0346,
        MAY: 0.0257,
        JUN: 0.0159,
        JUL: 0.0026,
        AUG: -0.0094,
        SEP: 0.0344,
        OCT: -0.0054,
        NOV: 0.0442,
        DEC: 0.0008,
        YTD: 0.1931
      },
      2021: {
        JAN: 0.0028,
        FEB: 0.0002,
        MAR: 0.0182,
        APR: 0.0014,
        MAY: 0.0122,
        JUN: 0.0091,
        JUL: -0.0081,
        AUG: 0.0028,
        SEP: 0.0087,
        OCT: 0.0068,
        NOV: -0.019,
        DEC: 0.01,
        YTD: 0.0455
      },
      2022: {
        JAN: -0.0348,
        FEB: 0.0009,
        MAR: 0.0016,
        APR: -0.0661,
        MAY: 0.0215,
        JUN: -0.0936,
        JUL: 0.0845,
        AUG: -0.0204,
        SEP: -0.0614,
        OCT: 0.0811,
        NOV: 0.0638,
        DEC: -0.0489,
        YTD: -0.0874
      },
      2023: {
        JAN: 0.067,
        FEB: 0.0058,
        MAR: 0.009,
        APR: 0.014,
        MAY: -0.0062,
        JUN: 0.018,
        JUL: -0.0048,
        AUG: 0.0133,
        SEP: -0.002,
        OCT: -0.0229,
        NOV: 0.0454,
        DEC: -0.0058,
        YTD: 0.1353
      },
      2024: {
        JAN: 0.0182,
        FEB: 0.006,
        MAR: 0.0068,
        APR: 0.0065,
        MAY: 0.0059,
        JUN: 0.0068,
        JUL: 0.0028,
        AUG: 0.0015,
        SEP: 0.0114,
        OCT: 0.0068,
        NOV: 0.0116,
        DEC: -0.0136,
        YTD: 0.0727
      },
      2025: {
        JAN: 0.0252,
        FEB: -0.0032,
        MAR: -0.0257,
        APR: -0.0262,
        MAY: 0.0243,
        JUN: 0.0139,
        JUL: 0.0032,
        AUG: 0.0116,
        SEP: -0.0077,
        OCT: -0.0028,
        NOV: -0.0034,
        DEC: -0.0033,
        YTD: 0.0044
      },
      2026: {
        JAN: -0.0188,
        FEB: 0.0021,
        MAR: 0.0042,
        APR: 0.0241,
        MAY: 0.0007,
        YTD: 0.0119
      }
    },
    cumulative: "monthly",
    startNav: 100,
    countries: [{
      name: "United States",
      weight: 0.8739
    }, {
      name: "Cayman Islands",
      weight: 0.0695
    }, {
      name: "Liberia",
      weight: 0.0309
    }, {
      name: "Canada",
      weight: 0.0257
    }],
    sectors: [{
      name: "Consumer Discretionary",
      weight: 0.3351
    }, {
      name: "Information Technology",
      weight: 0.221
    }, {
      name: "Communication Services",
      weight: 0.1352
    }, {
      name: "Financials",
      weight: 0.0966
    }, {
      name: "Industrials",
      weight: 0.0745
    }, {
      name: "Health Care",
      weight: 0.0616
    }, {
      name: "Consumer Staples",
      weight: 0.0608
    }, {
      name: "Real Estate",
      weight: 0.0152
    }],
    holdings: [{
      name: "Lam Research",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0357
    }, {
      name: "Alphabet Class A",
      sector: "Communication Services",
      ccy: "USD",
      weight: 0.0335
    }, {
      name: "Delta Air Lines",
      sector: "Industrials",
      ccy: "USD",
      weight: 0.0306
    }, {
      name: "Alibaba Group ADR",
      sector: "Consumer Discretionary",
      ccy: "USD",
      weight: 0.0296
    }, {
      name: "Applied Materials",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0288
    }, {
      name: "Wayfair Class A",
      sector: "Consumer Discretionary",
      ccy: "USD",
      weight: 0.0266
    }, {
      name: "Target",
      sector: "Consumer Staples",
      ccy: "USD",
      weight: 0.0262
    }, {
      name: "Adobe",
      sector: "Information Technology",
      ccy: "USD",
      weight: 0.0249
    }, {
      name: "Walt Disney",
      sector: "Communication Services",
      ccy: "USD",
      weight: 0.0245
    }, {
      name: "FedEx",
      sector: "Industrials",
      ccy: "USD",
      weight: 0.0244
    }],
    currency: [{
      name: "USD",
      weight: 1
    }],
    napr: true,
    defaultClass: "R_EUR",
    classData: {
      R_EUR: {
        meta: {
          shareClass: "R EUR"
        },
        startNav: 100,
        nutshell: {
          nav: "1’243.73",
          mtd: 0.0007,
          ytd: 0.0119,
          fundSize: "EUR 53.5M"
        },
        monthly: {
          2019: {
            JAN: 0.0899,
            FEB: 0.0073,
            MAR: -0.0027,
            APR: 0.0107,
            MAY: -0.033,
            JUN: 0.0533,
            JUL: 0.008,
            AUG: -0.005,
            SEP: 0.0059,
            OCT: 0.009,
            NOV: -0.0013,
            DEC: 0.0015,
            YTD: 0.1476
          },
          2020: {
            JAN: -0.0005,
            FEB: 0.0343,
            MAR: 0.0026,
            APR: 0.0346,
            MAY: 0.0257,
            JUN: 0.0159,
            JUL: 0.0026,
            AUG: -0.0094,
            SEP: 0.0344,
            OCT: -0.0054,
            NOV: 0.0442,
            DEC: 0.0008,
            YTD: 0.1931
          },
          2021: {
            JAN: 0.0028,
            FEB: 0.0002,
            MAR: 0.0182,
            APR: 0.0014,
            MAY: 0.0122,
            JUN: 0.0091,
            JUL: -0.0081,
            AUG: 0.0028,
            SEP: 0.0087,
            OCT: 0.0068,
            NOV: -0.019,
            DEC: 0.01,
            YTD: 0.0455
          },
          2022: {
            JAN: -0.0348,
            FEB: 0.0009,
            MAR: 0.0016,
            APR: -0.0661,
            MAY: 0.0215,
            JUN: -0.0936,
            JUL: 0.0845,
            AUG: -0.0204,
            SEP: -0.0614,
            OCT: 0.0811,
            NOV: 0.0638,
            DEC: -0.0489,
            YTD: -0.0874
          },
          2023: {
            JAN: 0.067,
            FEB: 0.0058,
            MAR: 0.009,
            APR: 0.014,
            MAY: -0.0062,
            JUN: 0.018,
            JUL: -0.0048,
            AUG: 0.0133,
            SEP: -0.002,
            OCT: -0.0229,
            NOV: 0.0454,
            DEC: -0.0058,
            YTD: 0.1353
          },
          2024: {
            JAN: 0.0182,
            FEB: 0.006,
            MAR: 0.0068,
            APR: 0.0065,
            MAY: 0.0059,
            JUN: 0.0068,
            JUL: 0.0028,
            AUG: 0.0015,
            SEP: 0.0114,
            OCT: 0.0068,
            NOV: 0.0116,
            DEC: -0.0136,
            YTD: 0.0727
          },
          2025: {
            JAN: 0.0252,
            FEB: -0.0032,
            MAR: -0.0257,
            APR: -0.0262,
            MAY: 0.0243,
            JUN: 0.0139,
            JUL: 0.0032,
            AUG: 0.0116,
            SEP: -0.0077,
            OCT: -0.0028,
            NOV: -0.0034,
            DEC: -0.0033,
            YTD: 0.0044
          },
          2026: {
            JAN: -0.0188,
            FEB: 0.0021,
            MAR: 0.0042,
            APR: 0.0241,
            MAY: 0.0007,
            YTD: 0.0119
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1216084993",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "EUR 53.5M"
        }, {
          label: "Currency",
          value: "EUR"
        }, {
          label: "Total Ret YTD",
          value: "1.19%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "4.30%"
        }, {
          label: "Management Fee",
          value: "1.50%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "3.00%"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      },
      R_USD: {
        meta: {
          shareClass: "R USD"
        },
        startNav: 100,
        nutshell: {
          nav: "142.79",
          mtd: 0.0019,
          ytd: 0.018,
          fundSize: "USD 62.1M"
        },
        monthly: {
          2020: {
            JAN: 0.0011,
            FEB: 0.036,
            MAR: 0.0059,
            APR: 0.0302,
            MAY: 0.0214,
            JUN: 0.0119,
            JUL: 0.001,
            AUG: -0.0087,
            SEP: 0.0319,
            OCT: -0.0069,
            NOV: 0.0406,
            DEC: 0.0013,
            YTD: 0.177
          },
          2021: {
            JAN: 0.0031,
            FEB: 0.0004,
            MAR: 0.0181,
            APR: 0.0016,
            MAY: 0.0123,
            JUN: 0.009,
            JUL: -0.0078,
            AUG: 0.003,
            SEP: 0.0088,
            OCT: 0.0069,
            NOV: -0.0195,
            DEC: 0.0112,
            YTD: 0.0476
          },
          2022: {
            JAN: -0.034,
            FEB: 0.0011,
            MAR: 0.0039,
            APR: -0.0651,
            MAY: 0.0231,
            JUN: -0.0903,
            JUL: 0.0862,
            AUG: -0.0186,
            SEP: -0.0579,
            OCT: 0.0843,
            NOV: 0.0674,
            DEC: -0.0456,
            YTD: -0.0629
          },
          2023: {
            JAN: 0.0693,
            FEB: 0.007,
            MAR: 0.0095,
            APR: 0.012,
            MAY: -0.0058,
            JUN: 0.0173,
            JUL: -0.0038,
            AUG: 0.014,
            SEP: -0.0009,
            OCT: -0.0216,
            NOV: 0.0461,
            DEC: -0.0053,
            YTD: 0.1432
          },
          2024: {
            JAN: 0.0187,
            FEB: 0.0067,
            MAR: 0.0076,
            APR: 0.0072,
            MAY: 0.0068,
            JUN: 0.0075,
            JUL: 0.0037,
            AUG: 0.0024,
            SEP: 0.0121,
            OCT: 0.0078,
            NOV: 0.012,
            DEC: -0.0112,
            YTD: 0.0841
          },
          2025: {
            JAN: 0.0257,
            FEB: -0.0022,
            MAR: -0.0244,
            APR: -0.024,
            MAY: 0.0254,
            JUN: 0.0153,
            JUL: 0.0052,
            AUG: 0.0136,
            SEP: -0.0061,
            OCT: -0.001,
            NOV: -0.0021,
            DEC: -0.0016,
            YTD: 0.0226
          },
          2026: {
            JAN: -0.0176,
            FEB: 0.0028,
            MAR: 0.0059,
            APR: 0.0254,
            MAY: 0.0019,
            YTD: 0.0181
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1532291983",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "USD 62.1M"
        }, {
          label: "Currency",
          value: "USD"
        }, {
          label: "Total Ret YTD",
          value: "1.80%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "5.66%"
        }, {
          label: "Management Fee",
          value: "1.50%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "3.00%"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      },
      I_USD: {
        meta: {
          shareClass: "I USD"
        },
        startNav: 100,
        nutshell: {
          nav: "123.92",
          mtd: 0.0024,
          ytd: 0.0197,
          fundSize: "USD 62.1M"
        },
        monthly: {
          2024: {
            JAN: 0.0191,
            FEB: 0.0072,
            MAR: 0.0081,
            APR: 0.0075,
            MAY: 0.0073,
            JUN: 0.0078,
            JUL: 0.0042,
            AUG: 0.0029,
            SEP: 0.0125,
            OCT: 0.0083,
            NOV: 0.0124,
            DEC: -0.0106,
            YTD: 0.0899
          },
          2025: {
            JAN: 0.026,
            FEB: -0.0017,
            MAR: -0.0239,
            APR: -0.0235,
            MAY: 0.026,
            JUN: 0.0159,
            JUL: 0.0057,
            AUG: 0.0141,
            SEP: -0.0055,
            OCT: -0.0006,
            NOV: -0.0021,
            DEC: -0.0011,
            YTD: 0.0282
          },
          2026: {
            JAN: -0.0171,
            FEB: 0.0033,
            MAR: 0.0065,
            APR: 0.0249,
            MAY: 0.0024,
            YTD: 0.0197
          }
        },
        generalInfo: [{
          label: "Name",
          value: "Zest N. America Pairs Relative"
        }, {
          label: "ISIN",
          value: "LU1532291801",
          mono: true
        }, {
          label: "Manager",
          value: "Pasquale Corvino"
        }, {
          label: "Category",
          value: "Equity Market Neutral"
        }, {
          label: "Fund Size",
          value: "USD 62.1M"
        }, {
          label: "Currency",
          value: "USD"
        }, {
          label: "Total Ret YTD",
          value: "1.97%"
        }, {
          label: "Ret Annlzd 3 Yr",
          value: "n/a"
        }, {
          label: "Management Fee",
          value: "0.90%"
        }, {
          label: "Performance Fee",
          value: "20.00%"
        }, {
          label: "Max Front Load",
          value: "n/a"
        }, {
          label: "Domicile",
          value: "Luxembourg"
        }]
      }
    }
  },
  'zest-butterfly': {
    family: 'zest',
    layout: 'zest-balanced',
    cover: false,
    balanced: true,
    meta: {
      fundName: 'Zest Butterfly II',
      subtitle: 'Balanced UCITS — Equity & Fixed Income',
      shareClass: 'I Acc',
      asOf: '30.04.2026',
      category: 'Balanced UCITS',
      navFreq: 'Daily'
    },
    logos: [{
      src: 'zest-am-sicav.png',
      role: 'Investment Manager',
      h: 30
    }],
    nutshell: {
      nav: '120.65',
      mtd: 0.0333,
      ytd: 0.0156,
      since: 0.2065,
      fundSize: 'EUR 15.6M'
    },
    shareClasses: [{
      isin: 'LU2516090001',
      name: 'I Acc',
      ccy: 'EUR',
      aum: 11800000,
      nav: 120.65,
      mtd: .0333,
      ytd: .0156
    }, {
      isin: 'LU2516090183',
      name: 'R Acc',
      ccy: 'EUR',
      aum: 3800000,
      nav: 116.22,
      mtd: .0325,
      ytd: .0118
    }],
    mission: 'The Fund is designed to provide a balanced UCITS strategy combining equity alpha generation with fixed income carry, stability and diversification. The portfolio blends a quantamental equity process with a disciplined bond allocation, seeking resilient participation across market cycles.',
    objective: ['Equity — quantamental stock selection across global large and mid-cap companies', 'Fixed Income — diversified credit managed by issuer quality, duration and yield-to-maturity', 'Portfolio construction — dynamic allocation between growth, income and risk control'],
    generalInfo: [{
      label: 'Name',
      value: 'Zest Butterfly II'
    }, {
      label: 'Legal form',
      value: 'Sub-fund of Zest AM SICAV'
    }, {
      label: 'Regulatory status',
      value: 'UCITS'
    }, {
      label: 'Domicile',
      value: 'Luxembourg'
    }, {
      label: 'Investment Manager',
      value: 'LFG+Zest SA'
    }, {
      label: 'ManCo, Admin & Depo',
      value: 'Pictet Group'
    }, {
      label: 'Fund Currency',
      value: 'EUR'
    }, {
      label: 'Benchmark',
      value: '40% Eq / 60% FI'
    }],
    metrics: [{
      label: 'Equity / Fixed Income',
      value: '40.3% / 58.1%'
    }, {
      label: 'Yield to Maturity',
      value: '4.60%'
    }, {
      label: 'Duration',
      value: '2.73'
    }, {
      label: 'IG / HY — Issuer',
      value: '72% / 28%'
    }, {
      label: 'IG / HY — Issue',
      value: '33% / 67%'
    }],
    risk: 3,
    sfdr: 'Art 8',
    monthly: {
      2022: {
        DEC: -.0223,
        YTD: -.0223
      },
      2023: {
        JAN: .0167,
        FEB: -.009,
        MAR: .0057,
        APR: .003,
        MAY: .007,
        JUN: .0154,
        JUL: .0144,
        AUG: -.0053,
        SEP: -.0121,
        OCT: -.0112,
        NOV: .0432,
        DEC: .0305,
        YTD: .1013
      },
      2024: {
        JAN: .0018,
        FEB: .0095,
        MAR: .0125,
        APR: -.0167,
        MAY: .0159,
        JUN: .0073,
        JUL: .0078,
        AUG: .0124,
        SEP: .0064,
        OCT: -.0049,
        NOV: .0158,
        DEC: -.0127,
        YTD: .0558
      },
      2025: {
        JAN: .0169,
        FEB: -.0036,
        MAR: -.0322,
        APR: .0033,
        MAY: .0298,
        JUN: .0125,
        JUL: .0064,
        AUG: .001,
        SEP: .0131,
        OCT: -.0016,
        NOV: .0008,
        DEC: -.001,
        YTD: .045
      },
      2026: {
        JAN: .0153,
        FEB: .0103,
        MAR: -.0419,
        APR: .0333,
        YTD: .0156
      }
    },
    cumulative: 'monthly',
    startNav: 100,
    allocation: [{
      name: 'Fixed Income',
      weight: .581
    }, {
      name: 'Equity',
      weight: .403
    }, {
      name: 'Other / Cash',
      weight: .016
    }],
    currency: [{
      name: 'EUR',
      weight: .55
    }, {
      name: 'USD',
      weight: .345
    }, {
      name: 'R.O.W.',
      weight: .088
    }, {
      name: 'Other',
      weight: .017
    }],
    holdings: [{
      name: 'JPMorgan Chase & Co',
      weight: .0089
    }, {
      name: 'Roper Technologies',
      weight: .0087
    }, {
      name: 'Salesforce Inc',
      weight: .0087
    }, {
      name: 'Oracle Corp',
      weight: .0086
    }, {
      name: 'Microsoft Corp',
      weight: .0085
    }, {
      name: 'HCA Healthcare',
      weight: .0081
    }, {
      name: 'Alphabet Inc-A',
      weight: .008
    }, {
      name: 'AP Moller-Maersk-B',
      weight: .0078
    }, {
      name: 'Ubiquiti Inc',
      weight: .0077
    }, {
      name: 'Arista Networks',
      weight: .0076
    }],
    equityNote: {
      mtd: '8.15%',
      contribution: '3.28%'
    },
    // ---- Equity sleeve (40.3% of NAV) ----
    equitySleeve: {
      weight: .403,
      perfMtd: .0815,
      contribution: .0328,
      names: 62,
      sectors: [{
        name: 'Information Technology',
        weight: .118
      }, {
        name: 'Financials',
        weight: .071
      }, {
        name: 'Health Care',
        weight: .058
      }, {
        name: 'Industrials',
        weight: .054
      }, {
        name: 'Communication Services',
        weight: .041
      }, {
        name: 'Consumer Disc.',
        weight: .036
      }, {
        name: 'Other',
        weight: .025
      }]
    },
    // ---- Fixed income sleeve (58.1% of NAV) ----
    fiSleeve: {
      weight: .581,
      ytm: .046,
      duration: 2.73,
      issuers: 94,
      igHyIssuer: '72% / 28%',
      igHyIssue: '33% / 67%',
      ratings: [{
        name: 'AAA',
        weight: .064
      }, {
        name: 'AA',
        weight: .071
      }, {
        name: 'A',
        weight: .118
      }, {
        name: 'BBB',
        weight: .203
      }, {
        name: 'BB',
        weight: .083
      }, {
        name: 'B',
        weight: .031
      }, {
        name: 'NR / Cash',
        weight: .011
      }]
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/data.js", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/echarts-kit.js
try { (() => {
/* echarts-kit.js — the shared ECharts render layer for the Factsheet Builder.
   Mirrors the repo's contract (docs/chart-studio-integration.md §2–4):
     • THEME  = themes/<family>.json → {fonts, palette, doc.chart}
     • MODEL  = { type, series:[{name,value,color?}], meta:{title,numFmt,…} }
     • buildOption(model, theme) → an ECharts 5.x option (single source of truth
       for BOTH the factsheet charts and the Chart Studio editor).
   No build step, no dependencies beyond global `echarts`. */
(function () {
  // Embedded themes (kept in sync with /themes/*.json). Hydrated from those JSON
  // files at load when served over http; embedded copy keeps file:// working.
  const THEMES = {
    vg: {
      id: 'vg-aqa',
      fonts: {
        display: "'Inter', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#1f2933',
        grid: '#eef3f8',
        axis: '#5a6470',
        categorical: ['#2b5d8c', '#1f4e79', '#7fa8d0', '#c08a3e', '#3f7d6e', '#8c5a7c'],
        positive: '#2f7d5b',
        negative: '#b1503f'
      },
      chart: {
        line: '#2b5d8c',
        lineDeep: '#1f4e79',
        lineSoft: '#7fa8d0',
        axisLabel: '#5a6470',
        axisLabelInk: '#3a4250',
        axisLine: '#d8dee6',
        splitLine: '#eef3f8',
        labelLine: '#c9d2dc',
        gradientFrom: 'rgba(43,93,140,.18)',
        gradientTo: 'rgba(43,93,140,0)',
        positive: '#2f7d5b',
        negative: '#b1503f'
      }
    },
    hive: {
      id: 'hive-lfgzest',
      fonts: {
        display: "'Cormorant Garamond', Georgia, serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#2a2326',
        grid: '#efe6e8',
        axis: '#6a6065',
        categorical: ['#6d1f2e', '#8a3340', '#a85a4f', '#b08d3c', '#c7a55a', '#5a6b5e', '#7c8a6e', '#9a4a5a', '#bb7a4a', '#4f141f', '#cf9b6a', '#7a5a6e'],
        positive: '#2f7d5b',
        negative: '#b1503f'
      },
      chart: {
        line: '#6d1f2e',
        lineDeep: '#4f141f',
        lineSoft: '#a85a4f',
        axisLabel: '#6a6065',
        axisLabelInk: '#3a3338',
        axisLine: '#d8ccce',
        splitLine: '#efe6e8',
        labelLine: '#c9bdc0',
        gradientFrom: 'rgba(176,141,60,.18)',
        gradientTo: 'rgba(176,141,60,0)',
        positive: '#2f7d5b',
        negative: '#b1503f'
      }
    },
    zest: {
      id: 'zest-am',
      fonts: {
        display: "'Jost', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
        mono: "'JetBrains Mono', ui-monospace, monospace"
      },
      palette: {
        ink: '#14153e',
        grid: '#e8edf3',
        axis: '#7a8499',
        categorical: ['#14153e', '#2e5f9e', '#0f4c7d', '#5b8cc4', '#8aa9d2', '#b8c6d8'],
        positive: '#1b7a1b',
        negative: '#c00000'
      },
      chart: {
        line: '#14153e',
        lineDeep: '#0f2447',
        lineSoft: '#2e5f9e',
        axisLabel: '#7a8499',
        axisLabelInk: '#3a4356',
        axisLine: '#d0d7e2',
        splitLine: '#e8edf3',
        labelLine: '#c2c9d4',
        gradientFrom: 'rgba(46,95,158,.18)',
        gradientTo: 'rgba(46,95,158,0)',
        positive: '#1b7a1b',
        negative: '#c00000'
      }
    }
  };
  const FAMILY_BY_ID = {
    'vg-aqa': 'vg',
    'hive-lfgzest': 'hive',
    'zest-am': 'zest'
  };

  // Optional async hydrate from the canonical JSON (keeps embedded + JSON aligned)
  (function hydrate() {
    if (location.protocol === 'file:') return;
    const map = {
      vg: '../../themes/vg-aqa.json',
      hive: '../../themes/hive-lfgzest.json',
      zest: '../../themes/zest-am.json'
    };
    Object.entries(map).forEach(([fam, url]) => {
      fetch(url).then(r => r.ok ? r.json() : null).then(j => {
        if (!j) return;
        THEMES[fam] = {
          id: j.id,
          fonts: j.fonts || THEMES[fam].fonts,
          palette: j.palette || THEMES[fam].palette,
          chart: j.doc && j.doc.chart || THEMES[fam].chart
        };
      }).catch(() => {});
    });
  })();
  function resolveTheme(family) {
    return THEMES[FAMILY_BY_ID[family] || family] || THEMES.vg;
  }

  // ---- Catalog of chart types the Studio offers (≈ the studio's 25 renderers) ----
  const CHART_CATALOG = [{
    id: 'line',
    label: 'Line',
    group: 'Trend'
  }, {
    id: 'smooth',
    label: 'Smooth line',
    group: 'Trend'
  }, {
    id: 'step',
    label: 'Step line',
    group: 'Trend'
  }, {
    id: 'area',
    label: 'Area',
    group: 'Trend'
  }, {
    id: 'area-smooth',
    label: 'Smooth area',
    group: 'Trend'
  }, {
    id: 'column',
    label: 'Columns',
    group: 'Bar'
  }, {
    id: 'bar',
    label: 'Bars (horizontal)',
    group: 'Bar'
  }, {
    id: 'stacked',
    label: '100% stacked',
    group: 'Bar'
  }, {
    id: 'lollipop',
    label: 'Lollipop',
    group: 'Bar'
  }, {
    id: 'lollipop-h',
    label: 'Lollipop (horizontal)',
    group: 'Bar'
  }, {
    id: 'polar',
    label: 'Polar bars',
    group: 'Bar'
  }, {
    id: 'waterfall',
    label: 'Waterfall',
    group: 'Bar'
  }, {
    id: 'donut',
    label: 'Donut',
    group: 'Part-to-whole'
  }, {
    id: 'pie',
    label: 'Pie',
    group: 'Part-to-whole'
  }, {
    id: 'rose',
    label: 'Rose',
    group: 'Part-to-whole'
  }, {
    id: 'funnel',
    label: 'Funnel',
    group: 'Part-to-whole'
  }, {
    id: 'treemap',
    label: 'Treemap',
    group: 'Part-to-whole'
  }, {
    id: 'radar',
    label: 'Radar',
    group: 'Advanced'
  }, {
    id: 'scatter',
    label: 'Scatter',
    group: 'Advanced'
  }, {
    id: 'heatmap',
    label: 'Heat strip',
    group: 'Advanced'
  }, {
    id: 'gauge',
    label: 'Gauge',
    group: 'Advanced'
  }];
  const ALIAS = {
    bars: 'bar',
    'h-bar': 'bar'
  };
  function buildOption(model, theme) {
    const t = theme || THEMES.vg;
    const C = t.chart,
      P = t.palette;
    const type = ALIAS[model.type] || model.type || 'line';
    const series = (model.series || []).filter(s => s && s.value !== '' && s.value != null);
    const meta = model.meta || {};
    const names = series.map(s => String(s.name));
    const vals = series.map(s => +s.value || 0);
    const cat = P.categorical;
    const colorAt = i => series[i].color || cat[i % cat.length];
    const fmt = v => meta.numFmt === 'pct' ? (+v).toFixed(2) + '%' : meta.numFmt === 'num0' ? Math.round(v).toString() : (+v).toFixed(meta.numFmt === 'num' ? 2 : 1);
    const fS = {
      fontFamily: t.fonts.body
    };
    const axL = {
      color: C.axisLabel,
      fontFamily: t.fonts.mono,
      fontSize: meta.compact ? 9 : 10
    };
    const grad = (a, b) => ({
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [{
        offset: 0,
        color: a
      }, {
        offset: 1,
        color: b
      }]
    });
    const base = {
      textStyle: fS,
      animationDuration: 420,
      grid: {
        left: meta.compact ? 2 : 8,
        right: meta.compact ? 8 : 14,
        top: meta.compact ? 12 : 16,
        bottom: 4,
        containLabel: true
      },
      tooltip: {
        trigger: ['donut', 'pie', 'rose', 'funnel', 'treemap'].includes(type) ? 'item' : 'axis',
        valueFormatter: fmt,
        textStyle: {
          fontFamily: t.fonts.body,
          fontSize: 11
        }
      }
    };
    const catAxis = extra => Object.assign({
      type: 'category',
      data: names,
      axisLabel: Object.assign({}, axL),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: C.axisLine
        }
      }
    }, extra || {});
    const valAxis = extra => Object.assign({
      type: 'value',
      axisLabel: Object.assign({
        formatter: fmt
      }, axL),
      splitLine: {
        lineStyle: {
          color: C.splitLine
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    }, extra || {});
    const lblPct = {
      fontSize: meta.compact ? 8 : 10,
      fontFamily: t.fonts.mono,
      color: C.axisLabelInk
    };
    switch (type) {
      case 'line':
      case 'smooth':
      case 'step':
      case 'area':
      case 'area-smooth':
        {
          const interval = Math.max(0, Math.ceil(names.length / (meta.compact ? 8 : 12)) - 1);
          const isArea = type.startsWith('area');
          return Object.assign(base, {
            xAxis: catAxis({
              boundaryGap: false,
              axisLabel: Object.assign({
                interval,
                hideOverlap: true
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'line',
              data: vals,
              smooth: type === 'smooth' || type === 'area-smooth',
              step: type === 'step' ? 'middle' : false,
              symbol: meta.compact ? 'none' : 'circle',
              symbolSize: 5,
              showSymbol: !meta.compact,
              lineStyle: {
                color: model.color || C.line,
                width: 2
              },
              itemStyle: {
                color: model.color || C.line
              },
              areaStyle: isArea ? {
                color: grad(C.gradientFrom || (model.color || C.line) + '2e', C.gradientTo || 'rgba(0,0,0,0)')
              } : null,
              endLabel: meta.compact ? {
                show: false
              } : undefined
            }]
          });
        }
      case 'column':
        {
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 12) - 1),
                hideOverlap: true
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'bar',
              barWidth: '62%',
              barMaxWidth: 26,
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: meta.signed ? v >= 0 ? C.positive : C.negative : model.color || colorAt(i),
                  borderRadius: v >= 0 ? [2, 2, 0, 0] : [0, 0, 2, 2]
                }
              })),
              label: meta.showVals ? {
                show: true,
                position: 'top',
                formatter: p => fmt(p.value),
                ...lblPct
              } : undefined
            }]
          });
        }
      case 'bar':
        {
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 34,
              top: 6,
              bottom: 2,
              containLabel: true
            },
            xAxis: valAxis({
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            }),
            yAxis: catAxis({
              inverse: true,
              axisLabel: Object.assign({
                width: meta.compact ? 76 : 120,
                overflow: 'truncate',
                fontFamily: t.fonts.body
              }, {
                color: C.axisLabelInk,
                fontSize: meta.compact ? 8.5 : 11
              }),
              axisLine: {
                show: false
              }
            }),
            series: [{
              type: 'bar',
              barWidth: meta.compact ? '58%' : '62%',
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: model.color || colorAt(i),
                  borderRadius: [0, 2, 2, 0]
                }
              })),
              label: {
                show: true,
                position: 'right',
                formatter: p => fmt(p.value),
                ...lblPct
              }
            }]
          });
        }
      case 'stacked':
        {
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 8,
              top: 6,
              bottom: 18,
              containLabel: true
            },
            xAxis: valAxis({
              max: vals.reduce((a, b) => a + b, 0),
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              }
            }),
            yAxis: {
              type: 'category',
              data: [''],
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            legend: {
              bottom: 0,
              itemWidth: 9,
              itemHeight: 9,
              textStyle: {
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              type: 'scroll'
            },
            series: series.map((s, i) => ({
              name: s.name,
              type: 'bar',
              stack: 'total',
              barWidth: 26,
              data: [vals[i]],
              itemStyle: {
                color: colorAt(i)
              }
            }))
          });
        }
      case 'lollipop':
      case 'lollipop-h':
        {
          const horiz = type === 'lollipop-h';
          const stickCol = C.axisLine,
            dotCol = model.color || C.line;
          const stick = {
            type: 'bar',
            barWidth: 2,
            data: vals.map((v, i) => ({
              value: v,
              itemStyle: {
                color: stickCol
              }
            })),
            z: 1,
            silent: true
          };
          const dots = {
            type: 'scatter',
            data: vals,
            symbolSize: meta.compact ? 8 : 11,
            itemStyle: {
              color: dotCol
            },
            z: 2,
            label: {
              show: !meta.compact,
              position: horiz ? 'right' : 'top',
              formatter: p => fmt(p.value),
              ...lblPct
            }
          };
          return Object.assign(base, horiz ? {
            grid: {
              left: 2,
              right: 30,
              top: 6,
              bottom: 2,
              containLabel: true
            },
            xAxis: valAxis(),
            yAxis: catAxis({
              inverse: true,
              axisLabel: Object.assign({
                width: 80,
                overflow: 'truncate'
              }, {
                color: C.axisLabelInk,
                fontSize: 9,
                fontFamily: t.fonts.body
              }),
              axisLine: {
                show: false
              }
            }),
            series: [stick, dots]
          } : {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 12) - 1)
              }, axL)
            }),
            yAxis: valAxis(),
            series: [stick, dots]
          });
        }
      case 'polar':
        {
          return Object.assign(base, {
            polar: {
              radius: ['18%', '78%']
            },
            angleAxis: {
              type: 'category',
              data: names,
              axisLabel: {
                color: C.axisLabel,
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              axisLine: {
                lineStyle: {
                  color: C.axisLine
                }
              }
            },
            radiusAxis: {
              axisLabel: {
                color: C.axisLabel,
                fontSize: 8,
                fontFamily: t.fonts.mono
              },
              splitLine: {
                lineStyle: {
                  color: C.splitLine
                }
              }
            },
            series: [{
              type: 'bar',
              coordinateSystem: 'polar',
              data: vals.map((v, i) => ({
                value: v,
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'waterfall':
        {
          const help = [];
          let acc = 0;
          vals.forEach(v => {
            help.push(Math.min(acc, acc + v));
            acc += v;
          });
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: 0,
                rotate: names.length > 6 ? 30 : 0
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'bar',
              stack: 'wf',
              itemStyle: {
                color: 'transparent'
              },
              emphasis: {
                itemStyle: {
                  color: 'transparent'
                }
              },
              data: help,
              silent: true
            }, {
              type: 'bar',
              stack: 'wf',
              barWidth: '52%',
              data: vals.map(v => ({
                value: Math.abs(v),
                itemStyle: {
                  color: v >= 0 ? C.positive : C.negative,
                  borderRadius: 2
                }
              })),
              label: {
                show: !meta.compact,
                position: 'top',
                formatter: p => fmt(vals[p.dataIndex]),
                ...lblPct
              }
            }]
          });
        }
      case 'donut':
      case 'pie':
      case 'rose':
        {
          const radius = type === 'donut' ? meta.radius || ['52%', '80%'] : type === 'rose' ? ['12%', '82%'] : ['0%', '78%'];
          return Object.assign(base, {
            series: [{
              type: 'pie',
              radius,
              roseType: type === 'rose' ? 'radius' : false,
              center: meta.noLabel ? ['50%', '50%'] : ['38%', '52%'],
              avoidLabelOverlap: true,
              minShowLabelAngle: 6,
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1.5
              },
              label: meta.noLabel ? {
                show: false
              } : {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: P.ink,
                formatter: p => `${p.name}  ${fmt(p.value)}`
              },
              labelLine: meta.noLabel ? {
                show: false
              } : {
                length: 8,
                length2: 8,
                lineStyle: {
                  color: C.labelLine
                }
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'funnel':
        {
          return Object.assign(base, {
            series: [{
              type: 'funnel',
              left: '6%',
              right: '6%',
              top: 6,
              bottom: 6,
              minSize: '14%',
              gap: 2,
              sort: 'descending',
              label: {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: '#fff',
                formatter: p => `${p.name}`
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'treemap':
        {
          return Object.assign(base, {
            series: [{
              type: 'treemap',
              roam: false,
              nodeClick: false,
              breadcrumb: {
                show: false
              },
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              label: {
                fontSize: meta.compact ? 9 : 11,
                fontFamily: t.fonts.body,
                color: '#fff',
                formatter: p => `${p.name}\n${fmt(p.value)}`
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 2,
                gapWidth: 2
              },
              data: series.map((s, i) => ({
                name: s.name,
                value: vals[i],
                itemStyle: {
                  color: colorAt(i)
                }
              }))
            }]
          });
        }
      case 'radar':
        {
          const max = Math.max(...vals, 0.01) * 1.15;
          return Object.assign(base, {
            radar: {
              indicator: names.map(n => ({
                name: n,
                max
              })),
              radius: '64%',
              axisName: {
                color: C.axisLabelInk,
                fontSize: 9,
                fontFamily: t.fonts.body
              },
              splitLine: {
                lineStyle: {
                  color: C.splitLine
                }
              },
              splitArea: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: C.axisLine
                }
              }
            },
            series: [{
              type: 'radar',
              data: [{
                value: vals
              }],
              areaStyle: {
                color: grad(C.gradientFrom || (model.color || C.line) + '2e', C.gradientTo || 'rgba(0,0,0,0)')
              },
              lineStyle: {
                color: model.color || C.line,
                width: 2
              },
              itemStyle: {
                color: model.color || C.line
              },
              symbolSize: 4
            }]
          });
        }
      case 'scatter':
        {
          return Object.assign(base, {
            xAxis: catAxis({
              axisLabel: Object.assign({
                interval: Math.max(0, Math.ceil(names.length / 10) - 1)
              }, axL)
            }),
            yAxis: valAxis(),
            series: [{
              type: 'scatter',
              symbolSize: meta.compact ? 9 : 13,
              data: vals.map((v, i) => [i, v]),
              itemStyle: {
                color: model.color || C.line,
                opacity: .82
              }
            }]
          });
        }
      case 'heatmap':
        {
          const mx = Math.max(...vals),
            mn = Math.min(...vals);
          return Object.assign(base, {
            grid: {
              left: 2,
              right: 8,
              top: 6,
              bottom: 28,
              containLabel: true
            },
            xAxis: catAxis({
              splitArea: {
                show: true
              },
              axisLabel: Object.assign({
                interval: 0,
                fontSize: 8
              }, axL)
            }),
            yAxis: {
              type: 'category',
              data: [''],
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              }
            },
            visualMap: {
              min: mn,
              max: mx,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              bottom: 0,
              itemHeight: 60,
              itemWidth: 10,
              textStyle: {
                fontSize: 8,
                fontFamily: t.fonts.mono,
                color: C.axisLabel
              },
              inRange: {
                color: [C.lineSoft || '#cdd', C.line]
              }
            },
            series: [{
              type: 'heatmap',
              data: vals.map((v, i) => [i, 0, +v.toFixed(2)]),
              label: {
                show: !meta.compact,
                fontSize: 8,
                formatter: p => fmt(p.value[2])
              }
            }]
          });
        }
      case 'gauge':
        {
          const v = vals[0] || 0,
            mx = Math.max(Math.abs(v) * 1.4, 10);
          return Object.assign(base, {
            series: [{
              type: 'gauge',
              min: 0,
              max: mx,
              radius: '92%',
              progress: {
                show: true,
                width: 10,
                itemStyle: {
                  color: model.color || C.line
                }
              },
              axisLine: {
                lineStyle: {
                  width: 10,
                  color: [[1, C.splitLine]]
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                show: false
              },
              pointer: {
                width: 4,
                itemStyle: {
                  color: C.lineDeep || C.line
                }
              },
              anchor: {
                show: false
              },
              title: {
                offsetCenter: [0, '64%'],
                fontSize: 10,
                color: C.axisLabel,
                fontFamily: t.fonts.body
              },
              detail: {
                valueAnimation: true,
                formatter: fmt,
                fontSize: 18,
                fontFamily: t.fonts.mono,
                color: P.ink,
                offsetCenter: [0, '34%']
              },
              data: [{
                value: v,
                name: names[0] || ''
              }]
            }]
          });
        }
      default:
        return buildOption(Object.assign({}, model, {
          type: 'line'
        }), t);
    }
  }
  window.FactsheetECharts = {
    THEMES,
    resolveTheme,
    buildOption,
    CHART_CATALOG
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/echarts-kit.js", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/excel.js
try { (() => {
/* Excel ↔ Factsheet bridge for the builder.
   Canonical template format (one workbook per fund) that maps 1:1 to the
   FUND_DATA schema in data.js. Uses the global SheetJS (XLSX) loaded in index.html.

   Sheets
   ──────
   Meta          key | value     fund identity, costs, classification
   Text          key | value     marketing prose (Mission / Strategy / Objective_n / Process)
   Monthly       Year | Jan…Dec  monthly returns in PERCENT (e.g. 2.27 = +2.27%)
   Holdings      Name | Weight%   top holdings
   Breakdown     Section | Item | Weight%   donut/bar tables (see SECTION_MAP)
   GeneralInfo   Label | Value    overrides the right-hand info table
   ShareClasses  Class | ISIN | Currency | AuM | NAV | MTD% | YTD%

   The parser is tolerant: header lookup is case-insensitive, blank rows are
   skipped, and any sheet that's missing simply leaves the family default intact.
   Real-world masters (Bloomberg / VG multi-sheet / Morningstar export) are
   converted to THIS canonical workbook by the repo-side parsers — see
   parsers/*.md in github.com/andreamidolo/factsheetbuilder. */
(function () {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MUP = MONTHS.map(m => m.toUpperCase());

  // Breakdown "Section" label → field on the fund object.
  const SECTION_MAP = {
    'asset allocation': 'allocation',
    'currency': 'currency',
    'currency allocation': 'currency',
    'equity sectors': 'sectors',
    'sectors': 'sectors',
    'exposure by country': 'countries',
    'country': 'countries',
    'strategy': 'strategy',
    'strategy breakdown': 'strategy',
    'rating breakdown': 'fiSleeve.ratings',
    'equity sleeve sectors': 'equitySleeve.sectors'
  };
  const pct = v => v === '' || v == null || isNaN(+v) ? null : +v / 100;
  const num = v => v === '' || v == null || isNaN(+v) ? null : +v;

  /* ---------- BUILD: fund object → SheetJS workbook ---------- */
  function buildWorkbook(d) {
    const wb = XLSX.utils.book_new();
    const aoa = rows => XLSX.utils.aoa_to_sheet(rows);

    // Meta
    const meta = d.meta || {};
    const fee = label => (d.generalInfo.find(r => r.label.toLowerCase().includes(label)) || {}).value || '';
    const metaRows = [['key', 'value'], ['Family', d.family], ['Layout', d.layout || ''], ['Fund_name', meta.fundName || ''], ['Subtitle', meta.subtitle || ''], ['Share_class', meta.shareClass || ''], ['Category', meta.category || ''], ['As_of', meta.asOf || ''], ['Currency', (d.generalInfo.find(r => /currency/i.test(r.label)) || {}).value || ''], ['NAV', d.nutshell.nav || ''], ['Fund_size', d.nutshell.fundSize || ''], ['Risk_indicator', d.risk || ''], ['SFDR', d.sfdr || ''], ['Morningstar_rating', meta.rating || ''], ['Start_NAV', d.startNav || ''], ['Balanced', d.balanced ? 'Yes' : 'No']];
    XLSX.utils.book_append_sheet(wb, aoa(metaRows), 'Meta');

    // Text
    const textRows = [['key', 'value'], ['Mission', d.mission || '']];
    if (d.strategyText) textRows.push(['Strategy', d.strategyText]);
    if (d.process) textRows.push(['Process', d.process]);
    (d.objective || []).forEach((o, i) => textRows.push([`Objective_${i + 1}`, o]));
    XLSX.utils.book_append_sheet(wb, aoa(textRows), 'Text');

    // Monthly (percent)
    const mRows = [['Year', ...MONTHS]];
    Object.keys(d.monthly).sort().forEach(y => {
      mRows.push([y, ...MUP.map(m => {
        const v = d.monthly[y][m];
        return v === undefined || v === null ? '' : +(v * 100).toFixed(4);
      })]);
    });
    XLSX.utils.book_append_sheet(wb, aoa(mRows), 'Monthly');

    // GeneralInfo
    XLSX.utils.book_append_sheet(wb, aoa([['Label', 'Value'], ...d.generalInfo.map(r => [r.label, r.value])]), 'GeneralInfo');

    // Holdings
    if (d.holdings) XLSX.utils.book_append_sheet(wb, aoa([['Name', 'Weight%'], ...d.holdings.map(h => [h.name, +(h.weight * 100).toFixed(2)])]), 'Holdings');

    // Breakdown
    const brk = [['Section', 'Item', 'Weight%']];
    const push = (section, arr, key = 'name') => (arr || []).forEach(r => brk.push([section, r[key] || r.sector, +(r.weight * 100).toFixed(2)]));
    push('Asset Allocation', d.allocation);
    push('Currency', d.currency);
    push('Strategy', d.strategy);
    if (d.family === 'zest' && !d.balanced) {
      push('Equity Sectors', d.sectors);
      push('Exposure by Country', d.countries);
    }
    if (d.equitySleeve) push('Equity Sleeve Sectors', d.equitySleeve.sectors);
    if (d.fiSleeve) push('Rating Breakdown', d.fiSleeve.ratings);
    if (brk.length > 1) XLSX.utils.book_append_sheet(wb, aoa(brk), 'Breakdown');

    // ShareClasses
    if (d.shareClasses) XLSX.utils.book_append_sheet(wb, aoa([['Class', 'ISIN', 'Currency', 'AuM', 'NAV', 'MTD%', 'YTD%'], ...d.shareClasses.map(s => [s.name, s.isin, s.ccy, s.aum, s.nav, +(s.mtd * 100).toFixed(2), +(s.ytd * 100).toFixed(2)])]), 'ShareClasses');
    return wb;
  }
  function downloadTemplate(d) {
    const wb = buildWorkbook(d);
    const safe = (d.meta.fundName || 'factsheet').replace(/[^\w]+/g, '_');
    XLSX.writeFile(wb, `${safe}__template.xlsx`);
  }

  /* ---------- PARSE: workbook → fund object (merged on a base default) ---------- */
  function sheetRows(wb, name) {
    const ws = wb.Sheets[Object.keys(wb.Sheets).find(s => s.toLowerCase() === name.toLowerCase())];
    return ws ? XLSX.utils.sheet_to_json(ws, {
      header: 1,
      blankrows: false,
      defval: ''
    }) : null;
  }
  function kv(rows) {
    const o = {};
    (rows || []).slice(1).forEach(r => {
      if (r[0] !== '' && r[0] != null) o[String(r[0]).trim().toLowerCase()] = r[1];
    });
    return o;
  }
  function setDeep(obj, path, val) {
    const ks = path.split('.');
    let t = obj;
    while (ks.length > 1) {
      const k = ks.shift();
      t[k] = t[k] || {};
      t = t[k];
    }
    t[ks[0]] = val;
  }
  function parseWorkbook(wb, baseByFamily) {
    const meta = kv(sheetRows(wb, 'Meta'));
    const family = (meta['family'] || 'vg').toString().trim().toLowerCase();
    // clone a same-family default so untouched fields keep rendering
    const baseKey = baseByFamily[family] || Object.keys(window.FUND_DATA).find(k => window.FUND_DATA[k].family === family);
    const d = JSON.parse(JSON.stringify(window.FUND_DATA[baseKey]));
    if (meta['layout']) d.layout = meta['layout'];
    d.balanced = /^y/i.test(String(meta['balanced'] || (d.balanced ? 'yes' : 'no')));
    d.meta.fundName = meta['fund_name'] || d.meta.fundName;
    if (meta['subtitle'] !== undefined && meta['subtitle'] !== '') d.meta.subtitle = meta['subtitle'];
    d.meta.shareClass = meta['share_class'] || d.meta.shareClass;
    d.meta.category = meta['category'] || d.meta.category;
    d.meta.asOf = meta['as_of'] || d.meta.asOf;
    if (meta['morningstar_rating']) d.meta.rating = +meta['morningstar_rating'] || d.meta.rating;
    if (meta['nav']) d.nutshell.nav = String(meta['nav']);
    if (meta['fund_size']) d.nutshell.fundSize = meta['fund_size'];
    if (meta['risk_indicator']) d.risk = +meta['risk_indicator'];
    if (meta['sfdr']) d.sfdr = meta['sfdr'];
    if (meta['start_nav']) d.startNav = +meta['start_nav'];

    // Text
    const text = kv(sheetRows(wb, 'Text'));
    if (text['mission']) d.mission = text['mission'];
    if (text['strategy']) d.strategyText = text['strategy'];
    if (text['process']) d.process = text['process'];
    const objs = Object.keys(text).filter(k => /^objective_\d+/.test(k)).sort().map(k => text[k]).filter(Boolean);
    if (objs.length) d.objective = objs;

    // Monthly → decimals + recompute YTD by compounding (repo behaviour)
    const mr = sheetRows(wb, 'Monthly');
    if (mr && mr.length > 1) {
      const hdr = mr[0].map(h => String(h).trim().toLowerCase());
      const mi = MONTHS.map(m => hdr.indexOf(m.toLowerCase()));
      const yi = hdr.indexOf('year');
      const monthly = {};
      mr.slice(1).forEach(row => {
        const y = String(row[yi]).trim();
        if (!y) return;
        const rec = {};
        let ytd = 1,
          any = false;
        MUP.forEach((M, k) => {
          const v = pct(row[mi[k]]);
          if (v !== null) {
            rec[M] = v;
            ytd *= 1 + v;
            any = true;
          }
        });
        if (any) rec.YTD = +(ytd - 1).toFixed(6);
        monthly[y] = rec;
      });
      if (Object.keys(monthly).length) {
        d.monthly = monthly;
        const years = Object.keys(monthly).sort();
        const last = monthly[years[years.length - 1]];
        if (last && last.YTD != null) d.nutshell.ytd = last.YTD;
        const lastMonth = MUP.filter(M => last[M] != null).pop();
        if (lastMonth) d.nutshell.mtd = last[lastMonth];
      }
    }

    // GeneralInfo
    const gi = sheetRows(wb, 'GeneralInfo');
    if (gi && gi.length > 1) {
      const rows = gi.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        label: String(r[0]),
        value: String(r[1]),
        mono: /isin/i.test(String(r[0]))
      }));
      if (rows.length) d.generalInfo = rows;
    }

    // Holdings
    const hr = sheetRows(wb, 'Holdings');
    if (hr && hr.length > 1) {
      const rows = hr.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        name: String(r[0]),
        weight: pct(r[1]) || 0
      }));
      if (rows.length) d.holdings = rows;
    }

    // Breakdown
    const br = sheetRows(wb, 'Breakdown');
    if (br && br.length > 1) {
      const buckets = {};
      br.slice(1).forEach(r => {
        const sec = String(r[0] || '').trim().toLowerCase();
        const item = r[1];
        const w = pct(r[2]);
        if (!sec || item === '' || w == null) return;
        const field = SECTION_MAP[sec];
        if (!field) return;
        (buckets[field] = buckets[field] || []).push({
          name: String(item),
          sector: String(item),
          weight: w
        });
      });
      Object.entries(buckets).forEach(([field, arr]) => setDeep(d, field, arr));
    }

    // ShareClasses
    const sc = sheetRows(wb, 'ShareClasses');
    if (sc && sc.length > 1) {
      const rows = sc.slice(1).filter(r => r[0] !== '' && r[0] != null).map(r => ({
        name: String(r[0]),
        isin: String(r[1] || ''),
        ccy: String(r[2] || ''),
        aum: num(r[3]) || 0,
        nav: num(r[4]) || 0,
        mtd: pct(r[5]) || 0,
        ytd: pct(r[6]) || 0
      }));
      if (rows.length) d.shareClasses = rows;
    }
    return {
      fund: d,
      family,
      fundName: d.meta.fundName
    };
  }
  window.FactsheetExcel = {
    buildWorkbook,
    downloadTemplate,
    parseWorkbook,
    SECTION_MAP
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/excel.js", error: String((e && e.message) || e) }); }

// ui_kits/factsheet/layout-kit.jsx
try { (() => {
/* layout-kit.jsx — module/block layout + editable tables + freeform canvas.
   Per-document override store (parallel to Charts.jsx window.__chartOv):
     • module overrides → `<doc>::mod::<id>`     { width, orderDelta, hidden, grow, view }
     • table overrides  → `<doc>::tbl::<id>`      rows[]
     • canvas blocks    → `<doc>::blocks::<page>` block[]
   Controls show only in edit mode (window.__chartEditMode); reverted with chart edits.
   Exposes window.KitLayout = { ModuleGrid, Module, EditableTable, ModuleCanvas }. */

const {
  useState: useLState
} = React;
const LZ = window.__layoutOv = window.__layoutOv || {};
const lkey = (id, kind) => (window.__activeDoc || 'doc') + '::' + kind + '::' + id;
const rerender = () => window.__sheetRerender && window.__sheetRerender();
window.__getModOv = id => LZ[lkey(id, 'mod')];
window.__setModOv = (id, patch) => {
  LZ[lkey(id, 'mod')] = Object.assign({}, LZ[lkey(id, 'mod')], patch);
  rerender();
};
window.__getTableOv = id => LZ[lkey(id, 'tbl')];
window.__setTableOv = (id, rows) => {
  LZ[lkey(id, 'tbl')] = rows;
  rerender();
};
window.__getBlocks = (page, seed) => LZ[lkey(page, 'blocks')] || seed || [];
window.__setBlocks = (page, blocks) => {
  LZ[lkey(page, 'blocks')] = blocks;
  rerender();
};
window.__getPages = (docKey, seed) => LZ[lkey(docKey, 'pages')] || seed || [];
window.__setPages = (docKey, pages) => {
  LZ[lkey(docKey, 'pages')] = pages;
  rerender();
};
/* total sheet count for a family doc = fixed pages before the canvas + canvas pages */
window.__pageTotal = (docKey, seed, fixedBefore) => (fixedBefore || 1) + window.__getPages(docKey, seed).length;
window.__clearLayoutOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  Object.keys(LZ).forEach(k => {
    if (k.indexOf(p) === 0) delete LZ[k];
  });
  rerender();
};
window.__hasLayoutOv = doc => {
  const p = (doc || window.__activeDoc || 'doc') + '::';
  return Object.keys(LZ).some(k => k.indexOf(p) === 0);
};
const editing = () => !!window.__chartEditMode;

/* cross-factsheet component clipboard (same-family paste) */
window.__copyBlock = (family, block) => {
  window.__clip = {
    family,
    block: JSON.parse(JSON.stringify(block))
  };
  rerender();
};
window.__getClip = () => window.__clip || null;
/* clone every override (layout + per-chart) from one doc key to another — used by "Duplicate factsheet" */
window.__cloneDocOv = (from, to) => {
  [window.__layoutOv, window.__chartOv].forEach(store => {
    if (!store) return;
    Object.keys(store).forEach(k => {
      if (k.indexOf(from + '::') === 0) store[to + k.slice(from.length)] = JSON.parse(JSON.stringify(store[k]));
    });
  });
};
const WIDTHS = ['full', 'two-thirds', 'half', 'third'];
const basisOf = w => w === 'full' ? '100%' : w === 'two-thirds' ? 'calc(66.666% - var(--mod-gap) / 3)' : w === 'half' ? 'calc(50% - var(--mod-gap) / 2)' : 'calc(33.333% - var(--mod-gap) * 2 / 3)';
const wGlyph = w => w === 'full' ? '▭' : w === 'two-thirds' ? '▥' : w === 'half' ? '◧' : '◰';

/* ---------- ModuleGrid: vertical stack (page-1 perf zone) ---------- */
function ModuleGrid({
  children,
  gap = 8,
  fill = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mod-grid",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: gap + 'px',
      ['--mod-gap']: gap + 'px',
      ...(fill ? {
        flex: 1,
        minHeight: 0
      } : {}),
      ...style
    }
  }, children);
}

/* ---------- Module: resize / reorder / hide / grow / swap ---------- */
function Module({
  id,
  title,
  order = 0,
  width = 'full',
  grow = false,
  swap,
  children,
  style
}) {
  const ov = id && window.__getModOv(id) || {};
  const ed = editing();
  if (ov.hidden) {
    if (!ed) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "mod mod-hidden",
      style: {
        width: basisOf(ov.width || width),
        alignSelf: 'flex-start',
        order: order * 10 + (ov.orderDelta || 0)
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "mod-restore",
      onClick: () => window.__setModOv(id, {
        hidden: false
      })
    }, "\uFF0B ", title || 'module', " (hidden) \u2014 restore"));
  }
  const w = ov.width || width;
  const g = ov.grow != null ? ov.grow : grow;
  const eff = order * 10 + (ov.orderDelta || 0);
  const cycleW = () => {
    const i = WIDTHS.indexOf(w);
    window.__setModOv(id, {
      width: WIDTHS[(i + 1) % WIDTHS.length]
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: 'mod' + (ov.width || ov.orderDelta || ov.grow != null ? ' mod-touched' : ''),
    style: {
      width: basisOf(w),
      alignSelf: 'flex-start',
      order: eff,
      flexGrow: g ? 1 : 0,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      minHeight: 0,
      position: 'relative',
      ...style
    }
  }, ed && id && /*#__PURE__*/React.createElement("div", {
    className: "mod-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-name"
  }, title || id), /*#__PURE__*/React.createElement("span", {
    className: "mod-tools"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: cycleW,
    title: "Cycle width"
  }, wGlyph(w), " ", w), swap && /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      view: (ov.view || swap[0]) === swap[0] ? swap[1] : swap[0]
    }),
    title: "Swap chart / table"
  }, "\u21C4 ", (ov.view || swap[0]) === swap[0] ? swap[1] : swap[0]), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      orderDelta: (ov.orderDelta || 0) - 15
    }),
    title: "Move up"
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      orderDelta: (ov.orderDelta || 0) + 15
    }),
    title: "Move down"
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      grow: !g
    }),
    title: "Fill remaining height",
    className: g ? 'on' : ''
  }, "\u2922"), /*#__PURE__*/React.createElement("button", {
    onClick: () => window.__setModOv(id, {
      hidden: true
    }),
    title: "Hide"
  }, "\u2715"))), /*#__PURE__*/React.createElement("div", {
    className: "mod-body",
    style: {
      flex: g ? 1 : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: g ? 'center' : 'flex-start'
    }
  }, typeof children === 'function' ? children(ov.view || swap && swap[0]) : children));
}

/* ---------- EditableTable: +/− rows & columns, inline cell edit; store OR controlled ---------- */
function EditableTable({
  id,
  columns,
  rows,
  value,
  onChange,
  onColumnsChange,
  accentHeader = false,
  zebra = false,
  footRow,
  dense = true,
  noHead = false
}) {
  const controlled = typeof onChange === 'function';
  const dynCols = typeof onColumnsChange === 'function';
  const ov = !controlled && id && window.__getTableOv(id);
  const data = (controlled ? value || [] : ov || rows).map(r => ({
    ...r
  }));
  const ed = editing();
  const fz = dense ? 10 : 11;
  const fmt = (v, c) => {
    if (v === '' || v == null) return '';
    if (c.type === 'pct') return (+v).toFixed(c.dp != null ? c.dp : 2) + '%';
    if (c.type === 'num') return (+v).toLocaleString(undefined, {
      maximumFractionDigits: c.dp != null ? c.dp : 2
    });
    return v;
  };
  const commit = next => controlled ? onChange(next) : window.__setTableOv(id, next);
  const setCell = (ri, key, val) => commit(data.map((r, i) => i === ri ? {
    ...r,
    [key]: val
  } : r));
  const addRow = () => {
    const blank = {};
    columns.forEach(c => blank[c.key] = c.type === 'pct' || c.type === 'num' ? 0 : '');
    commit([...data, blank]);
  };
  const delRow = ri => commit(data.filter((_, i) => i !== ri));
  const addCol = () => {
    const key = 'c' + Math.random().toString(36).slice(2, 6);
    onColumnsChange([...columns, {
      key,
      label: 'New',
      align: 'right'
    }]);
  };
  const delCol = key => onColumnsChange(columns.filter(c => c.key !== key));
  const renameCol = (key, label) => onColumnsChange(columns.map(c => c.key === key ? {
    ...c,
    label
  } : c));
  const thBase = {
    fontSize: dense ? 9 : 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    padding: '4px 6px'
  };
  const headStyle = accentHeader ? {
    background: 'var(--table-header-bg, var(--accent))',
    color: 'var(--table-header-ink,#fff)'
  } : {
    color: 'var(--ink-500)'
  };
  const cellBorder = '.75px solid var(--doc-line)';
  return /*#__PURE__*/React.createElement("div", {
    className: 'etable' + (ov ? ' etable-edited' : ''),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, !noHead && /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: headStyle
  }, ed && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      width: 16
    }
  }), columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    style: {
      ...thBase,
      textAlign: c.align || (c.type ? 'right' : 'left'),
      width: c.width,
      ...(accentHeader ? {} : {
        borderBottom: '1px solid var(--accent)'
      })
    }
  }, ed && dynCols && !c.compute ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: c.label || '',
    onChange: e => renameCol(c.key, e.target.value),
    style: {
      width: '100%',
      minWidth: 30,
      border: '1px solid ' + (accentHeader ? 'rgba(255,255,255,.4)' : 'var(--line)'),
      borderRadius: 3,
      padding: '1px 3px',
      font: 'inherit',
      fontSize: dense ? 9 : 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      textAlign: c.align || 'left',
      background: accentHeader ? 'transparent' : '#fff',
      color: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => delCol(c.key),
    title: "Remove column",
    style: {
      border: 0,
      background: 'none',
      color: 'inherit',
      opacity: .7,
      cursor: 'pointer',
      fontSize: 11,
      lineHeight: 1,
      padding: 0
    }
  }, "\xD7")) : c.label)), ed && dynCols && /*#__PURE__*/React.createElement("th", {
    style: {
      ...thBase,
      width: 22,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: addCol,
    title: "Add column",
    style: {
      border: 0,
      background: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: 13,
      lineHeight: 1,
      padding: 0
    }
  }, "\uFF0B")))), /*#__PURE__*/React.createElement("tbody", null, data.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      fontSize: fz,
      background: zebra && ri % 2 ? 'var(--table-zebra, transparent)' : 'transparent'
    }
  }, ed && /*#__PURE__*/React.createElement("td", {
    style: {
      borderBottom: cellBorder,
      textAlign: 'center',
      width: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-del",
    onClick: () => delRow(ri),
    title: "Remove row"
  }, "\u2212")), columns.map(c => {
    const val = c.compute ? c.compute(r) : r[c.key];
    const align = c.align || (c.type ? 'right' : 'left');
    const mono = c.type === 'pct' || c.type === 'num' || c.mono;
    return /*#__PURE__*/React.createElement("td", {
      key: c.key,
      style: {
        padding: '3px 6px',
        borderBottom: cellBorder,
        textAlign: align,
        color: c.color ? c.color(r) : 'var(--doc-ink)',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        fontWeight: c.bold ? 700 : 400,
        fontSize: mono ? fz - 1 : fz
      }
    }, ed && !c.compute ? /*#__PURE__*/React.createElement("input", {
      value: r[c.key] ?? '',
      onChange: e => setCell(ri, c.key, e.target.value),
      style: {
        width: c.type ? 56 : '100%',
        border: '1px solid var(--line)',
        borderRadius: 3,
        padding: '2px 4px',
        fontFamily: 'inherit',
        fontSize: fz - 1,
        textAlign: align,
        background: '#fff'
      }
    }) : c.compute ? val : c.type ? fmt(val, c) : val);
  }), ed && dynCols && /*#__PURE__*/React.createElement("td", {
    style: {
      borderBottom: cellBorder
    }
  }))), footRow && !ed && /*#__PURE__*/React.createElement("tr", {
    style: {
      fontSize: fz,
      fontWeight: 700
    }
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    style: {
      padding: '4px 6px',
      borderTop: '1px solid var(--accent)',
      textAlign: c.align || (c.type ? 'right' : 'left'),
      fontFamily: c.type ? 'var(--font-mono)' : 'inherit'
    }
  }, footRow[c.key] != null ? c.type ? fmt(footRow[c.key], c) : footRow[c.key] : ''))))), ed && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "row-add",
    onClick: addRow
  }, "\uFF0B Add row"), dynCols && /*#__PURE__*/React.createElement("button", {
    className: "row-add",
    onClick: addCol
  }, "\uFF0B Add column")));
}

/* ============================================================
   ModuleCanvas — freeform interior: create / duplicate / move / resize
   blocks (text, table, chart) plus fixed "preset" blocks for seeded content.
   ============================================================ */

function SectionTitleLocal({
  children,
  variant = 'underline'
}) {
  const DS = window.FundFactsheetDesignSystem_2d23bc;
  return /*#__PURE__*/React.createElement(DS.SectionTitle, {
    variant: variant
  }, children);
}

/* Editable section title — SectionTitle in view mode, inline input in edit mode.
   Keeps created blocks' titles aligned with the rest of the document. */
function BlockTitle({
  value,
  onChange,
  placeholder,
  variant = 'underline'
}) {
  if (!editing()) return value ? /*#__PURE__*/React.createElement(SectionTitleLocal, {
    variant: variant
  }, value) : null;
  const bar = variant === 'bar';
  return /*#__PURE__*/React.createElement("input", {
    value: value || '',
    placeholder: placeholder || 'Section title…',
    onChange: e => onChange(e.target.value),
    style: bar ? {
      width: '100%',
      background: 'var(--section-bar-bg, var(--accent))',
      border: 'none',
      color: 'var(--section-bar-ink,#fff)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '11px',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      textAlign: 'center',
      padding: '7px 12px',
      marginBottom: '2px',
      outline: 'none',
      boxSizing: 'border-box'
    } : {
      width: '100%',
      background: 'transparent',
      border: 'none',
      borderBottom: '1.5px solid var(--accent)',
      color: 'var(--accent)',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '11px',
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      padding: '0 0 4px',
      marginBottom: '2px',
      outline: 'none'
    }
  });
}

/* Auto-growing textarea so a text block enlarges as you add copy. */
function AutoText({
  value,
  onChange,
  fine
}) {
  const ref = React.useRef(null);
  const fit = el => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.max(44, el.scrollHeight) + 'px';
  };
  React.useEffect(() => {
    fit(ref.current);
  });
  return /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    value: value,
    onInput: e => fit(e.target),
    onChange: e => onChange(e.target.value),
    style: {
      width: '100%',
      border: '1px solid var(--line)',
      borderRadius: 4,
      padding: '6px 8px',
      font: 'inherit',
      fontSize: fine ? '8.5px' : '11px',
      lineHeight: 1.5,
      color: 'var(--ink-700)',
      resize: 'vertical',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  });
}
function CanvasBlock({
  block,
  idx,
  count,
  pageId,
  presets,
  family,
  onUpdate,
  onMove,
  onDup,
  onDel,
  onCopy
}) {
  const ed = editing();
  const _Cat = window.KitCharts.CatChart;
  const titleVariant = family === 'hive' ? 'bar' : 'underline';
  const w = block.w || 'full';
  const cycleW = () => {
    const i = WIDTHS.indexOf(w);
    onUpdate({
      w: WIDTHS[(i + 1) % WIDTHS.length]
    });
  };
  const isPreset = block.kind === 'preset';
  let body = null;
  if (isPreset && presets && presets[block.preset]) {
    body = presets[block.preset](block);
  } else if (block.kind === 'text') {
    body = ed ? /*#__PURE__*/React.createElement(AutoText, {
      value: block.text,
      onChange: text => onUpdate({
        text
      }),
      fine: block.size === 'fine'
    }) : /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: block.size === 'fine' ? '8.5px' : '11px',
        lineHeight: 1.5,
        color: 'var(--ink-700)',
        margin: 0,
        whiteSpace: 'pre-wrap',
        textWrap: 'pretty',
        columnCount: block.size === 'fine' ? 2 : 1,
        columnGap: '7mm'
      }
    }, block.text);
  } else if (block.kind === 'table') {
    body = /*#__PURE__*/React.createElement(EditableTable, {
      id: pageId + ':' + block.key,
      columns: block.columns,
      value: block.rows,
      onChange: rows => onUpdate({
        rows
      }),
      onColumnsChange: block.noHead ? undefined : cols => onUpdate({
        columns: cols
      }),
      dense: true,
      noHead: block.noHead,
      accentHeader: block.accentHeader,
      zebra: block.zebra
    });
  } else if (block.kind === 'chart') {
    const data = (block.series || []).map(s => ({
      name: s.name,
      weight: (+s.value || 0) / 100,
      color: s.color
    }));
    body = /*#__PURE__*/React.createElement(_Cat, {
      data: data,
      type: block.chartType || 'bar',
      id: pageId + ':' + block.key,
      title: block.title || 'Chart',
      compact: false
    });
  } else if (block.kind === 'banner') {
    const bg = block.accent === false ? 'var(--accent-2)' : 'var(--accent)';
    const tw = {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      outline: 'none',
      fontFamily: 'var(--font-body)'
    };
    body = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        background: bg,
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px'
      }
    }, ed ? /*#__PURE__*/React.createElement("input", {
      value: block.title || '',
      onChange: e => onUpdate({
        title: e.target.value
      }),
      style: {
        ...tw,
        flex: 1,
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: '11px',
        letterSpacing: '.1em',
        textTransform: 'uppercase'
      }
    }, block.title), ed ? /*#__PURE__*/React.createElement("input", {
      value: block.value || '',
      onChange: e => onUpdate({
        value: e.target.value
      }),
      style: {
        ...tw,
        width: '120px',
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '13px'
      }
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '13px',
        whiteSpace: 'nowrap'
      }
    }, block.value)), (block.sub || ed) && (ed ? /*#__PURE__*/React.createElement("input", {
      value: block.sub || '',
      placeholder: "subtitle (KPIs)\u2026",
      onChange: e => onUpdate({
        sub: e.target.value
      }),
      style: {
        width: '100%',
        marginTop: '5px',
        border: '1px solid var(--line)',
        borderRadius: 4,
        padding: '4px 8px',
        font: 'inherit',
        fontSize: '9px',
        color: 'var(--ink-600)',
        outline: 'none',
        boxSizing: 'border-box'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '5px',
        padding: '5px 10px',
        background: 'var(--doc-mist)',
        borderRadius: '4px',
        fontSize: '9.5px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ink-600)'
      }
    }, block.sub)));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mod mc-block",
    style: {
      width: basisOf(w),
      alignSelf: 'flex-start',
      flexGrow: 0,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      position: 'relative'
    }
  }, ed && /*#__PURE__*/React.createElement("div", {
    className: "mod-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mod-name"
  }, block.kind, " \xB7 ", block.title || block.key), /*#__PURE__*/React.createElement("span", {
    className: "mod-tools"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: cycleW,
    title: "Cycle width"
  }, wGlyph(w), " ", w), /*#__PURE__*/React.createElement("button", {
    onClick: () => onMove(-1),
    disabled: idx === 0,
    title: "Move earlier"
  }, "\u2191"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onMove(1),
    disabled: idx === count - 1,
    title: "Move later"
  }, "\u2193"), /*#__PURE__*/React.createElement("button", {
    onClick: onDup,
    title: "Duplicate"
  }, "\u29C9"), !isPreset && /*#__PURE__*/React.createElement("button", {
    onClick: onCopy,
    title: "Copy component (paste into another factsheet of this family)"
  }, "\u29C9\u2192"), /*#__PURE__*/React.createElement("button", {
    onClick: onDel,
    title: "Delete"
  }, "\u2715"))), !isPreset && block.kind !== 'banner' && /*#__PURE__*/React.createElement(BlockTitle, {
    value: block.title,
    onChange: title => onUpdate({
      title
    }),
    placeholder: block.kind + ' title…',
    variant: titleVariant
  }), /*#__PURE__*/React.createElement("div", {
    className: "mod-body",
    style: {
      marginTop: !isPreset && block.kind !== 'banner' && (editing() || block.title) ? 6 : 0
    }
  }, body));
}
function ModuleCanvas({
  pageId,
  seed,
  presets,
  family,
  gap = 10
}) {
  const ed = editing();
  const blocks = window.__getBlocks(pageId, seed);
  const set = b => window.__setBlocks(pageId, b);
  const update = (i, patch) => set(blocks.map((b, k) => k === i ? {
    ...b,
    ...patch
  } : b));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= blocks.length) return;
    const c = blocks.slice();
    const t = c[i];
    c[i] = c[j];
    c[j] = t;
    set(c);
  };
  const dup = i => {
    const copy = JSON.parse(JSON.stringify(blocks[i]));
    copy.key = (copy.kind || 'b') + '-' + Date.now().toString(36);
    set([...blocks.slice(0, i + 1), copy, ...blocks.slice(i + 1)]);
  };
  const del = i => set(blocks.filter((_, k) => k !== i));
  const copyBlock = i => window.__copyBlock(family, blocks[i]);
  const pasteBlock = () => {
    const c = window.__getClip();
    if (!c) return;
    const nb = JSON.parse(JSON.stringify(c.block));
    nb.key = (nb.kind || 'b') + '-' + Date.now().toString(36);
    set([...blocks, nb]);
  };
  const add = kind => {
    const key = kind + '-' + Date.now().toString(36);
    const nb = kind === 'text' ? {
      key,
      kind: 'text',
      w: 'full',
      title: 'New section',
      text: 'New text block — click to edit.'
    } : kind === 'table' ? {
      key,
      kind: 'table',
      w: 'half',
      title: 'New table',
      columns: [{
        key: 'c0',
        label: 'Item'
      }, {
        key: 'c1',
        label: 'Value',
        type: 'num'
      }],
      rows: [{
        c0: 'Row 1',
        c1: 0
      }, {
        c0: 'Row 2',
        c1: 0
      }]
    } : {
      key,
      kind: 'chart',
      w: 'half',
      title: 'New chart',
      chartType: 'bar',
      series: [{
        name: 'A',
        value: 40
      }, {
        name: 'B',
        value: 35
      }, {
        name: 'C',
        value: 25
      }]
    };
    set([...blocks, nb]);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "mcanvas",
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
      gap: gap + 'px',
      ['--mod-gap']: gap + 'px',
      flex: 1,
      minHeight: 0
    }
  }, blocks.map((b, i) => /*#__PURE__*/React.createElement(CanvasBlock, {
    key: b.key,
    block: b,
    idx: i,
    count: blocks.length,
    pageId: pageId,
    presets: presets,
    family: family,
    onUpdate: patch => update(i, patch),
    onMove: dir => move(i, dir),
    onDup: () => dup(i),
    onDel: () => del(i),
    onCopy: () => copyBlock(i)
  })), ed && /*#__PURE__*/React.createElement("div", {
    className: "mc-addbar",
    style: {
      width: '100%',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      padding: '8px 10px',
      border: '1px dashed var(--line-strong)',
      borderRadius: 6,
      background: 'repeating-linear-gradient(45deg,transparent,transparent 7px,rgba(20,25,31,.03) 7px,rgba(20,25,31,.03) 14px)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--ink-400)'
    }
  }, "Add component"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('text')
  }, "\uFF0B Text"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('table')
  }, "\uFF0B Table"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => add('chart')
  }, "\uFF0B Chart"), window.__getClip() && window.__getClip().family === family && /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    style: {
      marginLeft: 'auto',
      borderColor: 'var(--accent)',
      color: 'var(--accent)'
    },
    onClick: pasteBlock,
    title: 'Paste copied ' + window.__getClip().block.kind
  }, "\u29C9\u2192 Paste \u201C", window.__getClip().block.title || window.__getClip().block.kind, "\u201D")));
}

/* ============================================================
   CanvasPages — N duplicatable canvas pages (header + canvas + footer).
   Lets the user build multi-page factsheets: add a blank page or duplicate
   an existing one. Page chrome (A4, MiniHeader, PageFoot) comes from
   window.Factsheets so families share one implementation.
   ============================================================ */
function CanvasPages({
  docKey,
  family,
  d,
  logo,
  serif,
  footerLeft,
  presets,
  pagesSeed,
  blockSeeds = {},
  fixedBefore = 1
}) {
  const F = window.Factsheets;
  const ed = editing();
  const pages = window.__getPages(docKey, pagesSeed || [{
    id: docKey + '-p2'
  }]);
  const total = fixedBefore + pages.length;
  const newId = () => docKey + '-pg-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  const addPage = () => window.__setPages(docKey, [...pages, {
    id: newId()
  }]);
  const dupPage = i => {
    const src = pages[i],
      id = newId();
    const srcBlocks = window.__getBlocks(src.id, blockSeeds[src.id] || []);
    const copy = JSON.parse(JSON.stringify(srcBlocks)).map(b => ({
      ...b,
      key: (b.kind || 'b') + '-' + Math.random().toString(36).slice(2, 6)
    }));
    window.__setBlocks(id, copy);
    const next = pages.slice();
    next.splice(i + 1, 0, {
      id
    });
    window.__setPages(docKey, next);
  };
  const delPage = i => window.__setPages(docKey, pages.filter((_, k) => k !== i));
  return /*#__PURE__*/React.createElement(React.Fragment, null, pages.map((p, i) => /*#__PURE__*/React.createElement(F.A4, {
    family: family,
    key: p.id
  }, /*#__PURE__*/React.createElement(F.MiniHeader, {
    d: d,
    logo: logo,
    serif: serif
  }), ed && /*#__PURE__*/React.createElement("div", {
    className: "page-ctrl",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: '0 0 8px',
      padding: '5px 9px',
      background: 'var(--doc-mist)',
      borderRadius: 5,
      fontSize: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--ink-600)'
    }
  }, "Page ", fixedBefore + i + 1, " of ", total), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => dupPage(i),
    title: "Duplicate this page"
  }, "\u29C9 Duplicate page"), /*#__PURE__*/React.createElement("button", {
    className: "mc-add",
    onClick: () => delPage(i),
    disabled: pages.length <= 1,
    title: "Delete this page"
  }, "\u2715 Delete page")), /*#__PURE__*/React.createElement(ModuleCanvas, {
    pageId: p.id,
    seed: blockSeeds[p.id],
    presets: presets,
    family: family
  }), /*#__PURE__*/React.createElement(F.PageFoot, {
    left: footerLeft,
    page: fixedBefore + i + 1,
    total: total
  }))), ed && /*#__PURE__*/React.createElement("button", {
    className: "add-page",
    onClick: addPage,
    style: {
      width: '210mm',
      maxWidth: '100%',
      padding: '14px',
      border: '2px dashed var(--line-strong)',
      borderRadius: 8,
      background: 'rgba(255,255,255,.6)',
      color: 'var(--ink-500)',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "\uFF0B Add page"));
}
window.KitLayout = {
  ModuleGrid,
  Module,
  EditableTable,
  ModuleCanvas,
  CanvasPages
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/factsheet/layout-kit.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.KpiStat = __ds_scope.KpiStat;

__ds_ns.PerfValue = __ds_scope.PerfValue;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.BrandHeader = __ds_scope.BrandHeader;

__ds_ns.Disclaimer = __ds_scope.Disclaimer;

__ds_ns.FundManagerBio = __ds_scope.FundManagerBio;

__ds_ns.RiskScale = __ds_scope.RiskScale;

__ds_ns.SfdrBadge = __ds_scope.SfdrBadge;

__ds_ns.HoldingsTable = __ds_scope.HoldingsTable;

__ds_ns.InfoTable = __ds_scope.InfoTable;

__ds_ns.MonthlyReturnsTable = __ds_scope.MonthlyReturnsTable;

__ds_ns.ShareClassTable = __ds_scope.ShareClassTable;

})();
