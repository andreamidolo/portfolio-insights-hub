/* @ds-bundle: {"format":3,"namespace":"LFGZESTDesignSystem_24bd7d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Rule","sourcePath":"components/core/Rule.jsx"},{"name":"PersonCard","sourcePath":"components/patterns/PersonCard.jsx"},{"name":"SectionTab","sourcePath":"components/patterns/SectionTab.jsx"},{"name":"StatCard","sourcePath":"components/patterns/StatCard.jsx"},{"name":"StepItem","sourcePath":"components/patterns/StepItem.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"91bae800d399","components/core/Button.jsx":"fa4c889d0a39","components/core/Card.jsx":"5bf960b80acb","components/core/Eyebrow.jsx":"a8d7a768db70","components/core/Input.jsx":"26d71254f9e5","components/core/Rule.jsx":"61df1700be12","components/patterns/PersonCard.jsx":"199acd14c2b7","components/patterns/SectionTab.jsx":"a8c5c2a9eb5c","components/patterns/StatCard.jsx":"5715b544abb4","components/patterns/StepItem.jsx":"0568193acb2b","ui_kits/list-template/app.jsx":"13e4d37f4490","ui_kits/list-template/data.js":"c865030498c1","uploads/LFA Design System/brochure/ds-base.js":"c6db80d89673","uploads/LFA Design System/investment-process/ds-base.js":"c6db80d89673","uploads/LFA Design System/one-pager/ds-base.js":"20ae0857bffb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LFGZESTDesignSystem_24bd7d = window.LFGZESTDesignSystem_24bd7d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Badge — compact status / category label. Used for pension
 * pillars, fund lines, risk profiles, "active segment" flags.
 */
function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '3px 9px',
      fontSize: '10px'
    },
    md: {
      padding: '5px 12px',
      fontSize: '11px'
    }
  };
  const variants = {
    neutral: {
      background: 'var(--lfgz-cream)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-card)'
    },
    brand: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-brand)',
      border: '1px solid var(--color-primary)'
    },
    emphasis: {
      background: 'var(--surface-emphasis)',
      color: 'var(--text-on-brand)',
      border: '1px solid var(--surface-emphasis)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)'
    },
    sand: {
      background: 'var(--lfgz-sand-200)',
      color: 'var(--lfgz-taupe)',
      border: '1px solid var(--lfgz-sand)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-medium)',
      fontSize: sizes[size].fontSize,
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      padding: sizes[size].padding,
      borderRadius: 'var(--radius-pill)',
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Button — institutional, restrained. Uppercase tracked label,
 * burgundy fill for primary, hairline-outline for secondary, quiet text ghost.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  uppercase = true,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: '11px',
      gap: '8px'
    },
    md: {
      padding: '12px 24px',
      fontSize: '12.5px',
      gap: '10px'
    },
    lg: {
      padding: '16px 34px',
      fontSize: '13.5px',
      gap: '12px'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizes[size].gap,
    fontFamily: 'var(--font-sans)',
    fontWeight: 'var(--fw-semibold)',
    fontSize: sizes[size].fontSize,
    letterSpacing: uppercase ? 'var(--ls-wide)' : '0.01em',
    textTransform: uppercase ? 'uppercase' : 'none',
    padding: sizes[size].padding,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)',
    whiteSpace: 'nowrap',
    lineHeight: 1
  };
  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-brand)',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
      borderColor: 'transparent'
    },
    onDark: {
      background: 'transparent',
      color: 'var(--text-on-brand)',
      borderColor: 'rgba(255,255,255,0.55)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--color-primary-hover)',
      borderColor: 'var(--color-primary-hover)'
    },
    secondary: {
      background: 'var(--color-primary)',
      color: 'var(--text-on-brand)'
    },
    ghost: {
      color: 'var(--color-primary)'
    },
    onDark: {
      background: 'rgba(255,255,255,0.12)',
      borderColor: '#fff'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Card — the workhorse surface. White by default with a hairline
 * border and a barely-there shadow; `emphasis` flips to the deep-maroon
 * filled card used to mark the selected option in the Boutique decks.
 */
function Card({
  children,
  variant = 'default',
  rule = false,
  padding = 'var(--space-6)',
  style = {},
  ...rest
}) {
  const variants = {
    default: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-card)',
      boxShadow: 'var(--shadow-card)'
    },
    flat: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-card)',
      boxShadow: 'none'
    },
    cream: {
      background: 'var(--surface-card-cream)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-hairline)',
      boxShadow: 'none'
    },
    emphasis: {
      background: 'var(--surface-emphasis)',
      color: 'var(--text-on-brand)',
      border: '1px solid var(--surface-emphasis)',
      boxShadow: 'var(--shadow-brand)'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      padding,
      ...variants[variant],
      ...style
    }
  }, rest), rule && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: '44px',
      height: 'var(--bw-rule)',
      background: variant === 'emphasis' ? 'rgba(255,255,255,0.6)' : 'var(--rule-brand)',
      marginBottom: 'var(--space-4)'
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Eyebrow — the small tracked uppercase label that sits above
 * titles and section headers. Burgundy by default; pass tone="onDark"
 * for burgundy / photo grounds.
 */
function Eyebrow({
  children,
  tone = 'brand',
  style = {},
  ...rest
}) {
  const tones = {
    brand: 'var(--color-primary)',
    muted: 'var(--text-muted)',
    onDark: 'var(--text-on-brand-muted)',
    ink: 'var(--text-strong)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-medium)',
      fontSize: 'var(--fs-eyebrow)',
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase',
      color: tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Input — quiet form field. Hairline underline-forward styling
 * with a burgundy focus. Pairs with a tracked uppercase label.
 */
function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  defaultValue,
  onChange,
  disabled = false,
  required = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-primary)'
    }
  }, " *")), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    required: required,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)',
      background: disabled ? 'var(--lfgz-cream)' : 'var(--surface-card)',
      border: '1px solid var(--border-card)',
      borderBottomColor: focus ? 'var(--color-primary)' : 'var(--border-card)',
      borderBottomWidth: focus ? '2px' : '1px',
      borderRadius: 'var(--radius-sm)',
      padding: focus ? '11px 13px 10px' : '11px 13px',
      outline: 'none',
      transition: 'border-color var(--dur-base) var(--ease-standard)',
      boxShadow: focus ? '0 0 0 3px rgba(131,2,26,0.08)' : 'none'
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST Rule — the signature short horizontal brand rule used to anchor
 * titles, separate sections, and underline person names. Defaults to the
 * short burgundy mark; set full for a hairline divider across the column.
 */
function Rule({
  full = false,
  tone = 'brand',
  width = 44,
  thickness,
  style = {},
  ...rest
}) {
  const tones = {
    brand: 'var(--rule-brand)',
    accent: 'var(--rule-accent)',
    hair: 'var(--border-hairline)',
    onDark: 'rgba(255,255,255,0.6)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "separator",
    style: {
      display: 'block',
      width: full ? '100%' : `${width}px`,
      height: `${thickness ?? (full ? 1 : 2)}px`,
      background: full && tone === 'brand' ? 'var(--border-hairline)' : tones[tone],
      border: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rule.jsx", error: String((e && e.message) || e) }); }

// components/patterns/PersonCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST PersonCard — team member tile. Square portrait, then name and
 * role separated from the photo by the signature burgundy rule. Mirrors
 * the "Wealth Management Team" grids.
 */
function PersonCard({
  name,
  role,
  photo,
  layout = 'row',
  style = {},
  ...rest
}) {
  const isRow = layout === 'row';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: isRow ? 'row' : 'column',
      alignItems: isRow ? 'center' : 'flex-start',
      gap: isRow ? 'var(--space-4)' : 'var(--space-3)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: isRow ? '64px' : '100%',
      aspectRatio: isRow ? '1 / 1' : '4 / 3',
      flex: '0 0 auto',
      background: photo ? `url(${photo}) center / cover no-repeat` : 'var(--lfgz-mist)',
      borderRadius: 'var(--radius-sm)'
    },
    "aria-hidden": !photo
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: '30px',
      height: '2px',
      background: 'var(--rule-brand)',
      marginBottom: '8px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      lineHeight: 1.2
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '4px',
      fontSize: '10.5px',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, role)));
}
Object.assign(__ds_scope, { PersonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/PersonCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/SectionTab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST SectionTab — the vertical taupe tab anchored to the top-right
 * edge of brochure pages, naming the active chapter. Decorative wayfinding.
 */
function SectionTab({
  children,
  tone = 'taupe',
  side = 'right',
  style = {},
  ...rest
}) {
  const tones = {
    taupe: {
      background: 'var(--lfgz-taupe)',
      color: '#fff'
    },
    burgundy: {
      background: 'var(--color-primary)',
      color: '#fff'
    },
    sand: {
      background: 'var(--lfgz-sand)',
      color: 'var(--lfgz-ink)'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: 'absolute',
      top: 0,
      [side]: 0,
      width: '46px',
      minHeight: '118px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '18px 0',
      fontFamily: 'var(--font-sans)',
      ...tones[tone],
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      writingMode: 'vertical-rl',
      transform: side === 'right' ? 'rotate(180deg)' : 'none',
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      lineHeight: 1.35,
      textAlign: 'center'
    }
  }, children));
}
Object.assign(__ds_scope, { SectionTab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/SectionTab.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST StatCard — the headline figure block (e.g. "2.5 bn CHF in
 * management", "700+ clients"). Oversized light figure, tracked label.
 */
function StatCard({
  value,
  unit,
  label,
  caption,
  tone = 'light',
  align = 'left',
  style = {},
  ...rest
}) {
  const onDark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      fontFamily: 'var(--font-sans)',
      color: onDark ? 'var(--text-on-brand)' : 'var(--text-strong)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
      fontWeight: 'var(--fw-light)',
      lineHeight: 1,
      letterSpacing: 'var(--ls-tight)'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.1rem',
      fontWeight: 'var(--fw-light)',
      color: onDark ? 'var(--text-on-brand-muted)' : 'var(--color-primary)'
    }
  }, unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Rule, {
    tone: onDark ? 'onDark' : 'brand',
    width: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '12px',
      fontSize: 'var(--fs-eyebrow)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--ls-wider)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--text-on-brand-muted)' : 'var(--text-muted)'
    }
  }, label), caption && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.55,
      color: onDark ? 'rgba(255,255,255,0.78)' : 'var(--text-secondary)',
      maxWidth: '34ch'
    }
  }, caption));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/patterns/StepItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LFG+ZEST StepItem — a numbered process step. Oversized thin silver
 * numeral beside an uppercase title and body. The core motif of the
 * investment-process and "clients" layouts.
 */
function StepItem({
  number,
  title,
  children,
  tone = 'light',
  rule = true,
  style = {},
  ...rest
}) {
  const onDark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'clamp(2.6rem, 4vw, 3.6rem)',
      fontWeight: 'var(--fw-thin)',
      lineHeight: 0.9,
      color: onDark ? 'rgba(255,255,255,0.45)' : 'var(--lfgz-silver)',
      flex: '0 0 auto',
      fontVariantNumeric: 'lining-nums'
    }
  }, number), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: '6px'
    }
  }, rule && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: '36px',
      height: '2px',
      background: onDark ? 'rgba(255,255,255,0.6)' : 'var(--rule-brand)',
      marginBottom: '10px'
    }
  }), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontSize: 'var(--fs-h4)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--text-on-brand)' : 'var(--text-strong)'
    }
  }, title), children && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 'var(--fs-sm)',
      lineHeight: 1.65,
      color: onDark ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
      maxWidth: '40ch'
    }
  }, children)));
}
Object.assign(__ds_scope, { StepItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/patterns/StepItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/list-template/app.jsx
try { (() => {
/* LFG+ZEST List Template — app shell. Renders any asset class from window.LZ_DATA,
   with an Admin (editable) vs Cliente (read-only) view toggle. */
const {
  useState,
  useMemo,
  useRef
} = React;

/* ---------------- icons (Lucide paths) ---------------- */
const P = {
  search: 'M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  pencil: 'M12 20h9|M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z',
  trash: 'M3 6h18|M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  plus: 'M5 12h14|M12 5v14',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M17 8l-5-5-5 5|M12 3v12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4|M7 10l5 5 5-5|M12 15V3',
  printer: 'M6 9V2h12v7|M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2|M6 14h12v8H6z',
  link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5|M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
  chevron: 'M6 9l6 6 6-6',
  up: 'M12 19V5|M5 12l7-7 7 7',
  down: 'M12 5v14|M19 12l-7 7-7-7',
  updown: 'M8 9l4-4 4 4|M16 15l-4 4-4-4',
  x: 'M18 6L6 18|M6 6l12 12',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z|M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5',
  dot: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0'
};
function Icon({
  n,
  s = 16,
  fill = false,
  stroke = 2,
  style
}) {
  const d = (P[n] || '').split('|');
  return /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: fill ? 'currentColor' : 'none',
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: '0 0 auto',
      ...style
    }
  }, d.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })));
}

/* ---------------- helpers ---------------- */
const RATING = {
  AAA: ['#2F6E54', 'IG'],
  AA: ['#3E7C72', 'IG'],
  A: ['#4F7A4A', 'IG'],
  BBB: ['#B0852F', 'IG'],
  BB: ['#A65A3A', 'HY'],
  B: ['#9E2A36', 'HY'],
  CCC: ['#7A0F1A', 'HY']
};
const RISK = {
  'Basso': '#3F7A5A',
  'Medio': '#B0852F',
  'Alto': '#9E2A36'
};
function Change({
  v
}) {
  if (v == null) return /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--lz-muted)'
    }
  }, "\u2013");
  const pos = v >= 0;
  const c = pos ? 'var(--lz-pos)' : 'var(--lz-neg)';
  return /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      color: c,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: pos ? 'up' : 'down',
    s: 11,
    stroke: 2.6
  }), pos ? '+' : '', v.toFixed(1), "%");
}
function RatingPill({
  v
}) {
  const [c, tag] = RATING[v] || ['#5A626B', ''];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontWeight: 700,
      color: c,
      letterSpacing: '.02em'
    }
  }, v), tag && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      letterSpacing: '.1em',
      color: 'var(--lz-muted)',
      border: '1px solid var(--lz-line)',
      borderRadius: 3,
      padding: '1px 4px'
    }
  }, tag));
}
function RiskPill({
  v
}) {
  const c = RISK[v] || '#5A626B';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 9,
      background: c
    }
  }), v);
}
function Stars({
  v
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 1,
      color: 'var(--lz-burgundy)'
    }
  }, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    n: "star",
    s: 13,
    fill: i <= v,
    stroke: i <= v ? 0 : 1.5,
    style: {
      color: i <= v ? 'var(--lz-burgundy)' : 'var(--lz-line)'
    }
  })));
}
function Badge({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      fontWeight: 600,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--lz-burgundy)',
      background: 'var(--lz-sand2)',
      border: '1px solid #E3D6BE',
      borderRadius: 3,
      padding: '2px 6px',
      whiteSpace: 'nowrap'
    }
  }, children);
}
const TINT = {
  burgundy: {
    bg: 'rgba(131,2,26,0.045)',
    fg: 'var(--lz-burgundy)'
  },
  teal: {
    bg: 'rgba(62,110,102,0.07)',
    fg: 'var(--lz-teal)'
  },
  gold: {
    bg: 'rgba(176,133,47,0.08)',
    fg: '#8A6520'
  },
  slate: {
    bg: 'rgba(90,98,107,0.06)',
    fg: 'var(--lz-slate)'
  }
};

/* ---------------- cell ---------------- */
function Cell({
  col,
  row,
  editing,
  onEdit
}) {
  const tint = col.group && col.groupTints ? null : null;
  const val = row[col.key];
  if (col.kind === 'identity') {
    return /*#__PURE__*/React.createElement("td", {
      style: {
        ...cellBase('left'),
        minWidth: 210
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        color: 'var(--lz-ink)',
        fontSize: 13.5,
        lineHeight: 1.25
      }
    }, row.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "num",
      style: {
        fontFamily: "'IBM Plex Mono',monospace",
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--lz-burgundy)'
      }
    }, row.ticker), (row.badges || []).slice(0, 2).map((b, i) => /*#__PURE__*/React.createElement(Badge, {
      key: i
    }, b))));
  }
  if (col.kind === 'sub') {
    return /*#__PURE__*/React.createElement("td", {
      style: {
        ...cellBase('left'),
        color: 'var(--lz-slate)',
        fontSize: 13
      }
    }, val, row.region && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--lz-muted)',
        marginTop: 2
      }
    }, row.region));
  }
  let inner;
  if (col.kind === 'change') inner = /*#__PURE__*/React.createElement(Change, {
    v: val
  });else if (col.kind === 'rating') inner = /*#__PURE__*/React.createElement(RatingPill, {
    v: val
  });else if (col.kind === 'risk') inner = /*#__PURE__*/React.createElement(RiskPill, {
    v: val
  });else if (col.kind === 'stars') inner = /*#__PURE__*/React.createElement(Stars, {
    v: val
  });else if (editing && typeof val === 'number') {
    return /*#__PURE__*/React.createElement("td", {
      style: cellBase(col.align)
    }, /*#__PURE__*/React.createElement("input", {
      defaultValue: val,
      onChange: e => onEdit(col.key, parseFloat(e.target.value)),
      className: "num",
      style: {
        width: 64,
        textAlign: col.align,
        font: 'inherit',
        fontWeight: 600,
        border: '1px solid var(--lz-burgundy)',
        borderRadius: 4,
        padding: '3px 6px',
        background: '#fff',
        color: 'var(--lz-ink)'
      }
    }));
  } else inner = /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontWeight: col.kind === 'numStrong' ? 700 : 500,
      color: col.kind === 'numStrong' ? 'var(--lz-burgundy)' : 'var(--lz-ink)'
    }
  }, col.fmt ? col.fmt(val) : val);
  return /*#__PURE__*/React.createElement("td", {
    style: cellBase(col.align)
  }, inner);
}
function cellBase(align) {
  return {
    padding: '0 18px',
    height: 'var(--lz-row-h)',
    textAlign: align || 'left',
    fontSize: 13,
    verticalAlign: 'middle',
    whiteSpace: 'nowrap'
  };
}

/* ---------------- table ---------------- */
function Table({
  cfg,
  rows,
  sort,
  onSort,
  onSelect,
  view,
  editingId,
  onEditCell
}) {
  // group spans
  const groups = [];
  cfg.columns.forEach(c => {
    const g = c.group || '';
    const last = groups[groups.length - 1];
    if (last && last.label === g) last.span++;else groups.push({
      label: g,
      span: 1,
      tint: (cfg.groupTints || {})[g]
    });
  });
  const admin = view === 'admin';
  const colCount = cfg.columns.length + (admin ? 1 : 0);
  const rowGroups = cfg.groupBy ? (cfg.groupOrder || []).map(k => ({
    key: k,
    label: (cfg.groupLabels || {})[k] || k,
    note: (cfg.groupNote || {})[k] || '',
    rows: rows.filter(r => r[cfg.groupBy] === k)
  })).filter(g => g.rows.length) : null;
  const renderRow = row => /*#__PURE__*/React.createElement("tr", {
    key: row.id,
    className: "lz-row",
    onClick: () => !admin && onSelect(row),
    style: {
      borderBottom: '1px solid var(--lz-line)',
      background: editingId === row.id ? 'rgba(131,2,26,.03)' : 'transparent',
      cursor: admin ? 'default' : 'pointer'
    }
  }, cfg.columns.map(c => /*#__PURE__*/React.createElement(Cell, {
    key: c.key,
    col: c,
    row: row,
    editing: admin && editingId === row.id,
    onEdit: (k, v) => onEditCell(row.id, k, v)
  })), admin && /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellBase('center')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "lz-ico",
    title: "Modifica",
    onClick: () => onSelect(row, true)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "pencil",
    s: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "lz-ico",
    title: "Dettaglio",
    onClick: () => onSelect(row, false)
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "eye",
    s: 15
  })), /*#__PURE__*/React.createElement("button", {
    className: "lz-ico lz-ico-danger",
    title: "Elimina"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "trash",
    s: 15
  })))));
  return /*#__PURE__*/React.createElement("div", {
    className: "lz-tablecard",
    style: {
      overflowX: 'auto',
      background: '#fff',
      border: '1px solid var(--lz-line)',
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(35,31,32,.05), 0 10px 28px rgba(35,31,32,.05)'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: 980
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, groups.map((g, i) => {
    const t = g.tint ? TINT[g.tint] : null;
    return /*#__PURE__*/React.createElement("th", {
      key: i,
      colSpan: g.span,
      style: {
        textAlign: 'left',
        padding: '11px 18px 9px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: t ? t.fg : 'var(--lz-muted)',
        background: t ? t.bg : 'transparent',
        borderTop: '2px solid var(--lz-burgundy)',
        borderLeft: i > 0 ? '1px solid var(--lz-grid)' : 'none'
      }
    }, g.label || '\u00A0');
  }), admin && /*#__PURE__*/React.createElement("th", {
    style: {
      borderTop: '2px solid var(--lz-burgundy)'
    }
  })), /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--lz-line)'
    }
  }, cfg.columns.map((c, i) => {
    const t = (cfg.groupTints || {})[c.group];
    const tt = t ? TINT[t] : null;
    const active = sort.key === c.key;
    const sortable = c.kind !== 'identity';
    return /*#__PURE__*/React.createElement("th", {
      key: c.key,
      onClick: () => sortable && onSort(c.key),
      className: sortable ? 'lz-sortable' : '',
      style: {
        padding: '9px 18px',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
        color: active ? 'var(--lz-burgundy)' : 'var(--lz-slate)',
        textAlign: c.align || 'left',
        background: tt ? tt.bg : 'transparent',
        cursor: sortable ? 'pointer' : 'default',
        borderLeft: i > 0 && (cfg.groupTints || {})[c.group] !== (cfg.groupTints || {})[cfg.columns[i - 1].group] ? '1px solid var(--lz-grid)' : 'none',
        userSelect: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        justifyContent: c.align === 'right' ? 'flex-end' : 'flex-start'
      }
    }, c.label, sortable && /*#__PURE__*/React.createElement(Icon, {
      n: active ? sort.dir === 'asc' ? 'up' : 'down' : 'updown',
      s: 11,
      stroke: 2,
      style: {
        opacity: active ? 1 : .4
      }
    })));
  }), admin && /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '9px 14px',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--lz-slate)',
      textAlign: 'center'
    }
  }, "Azioni"))), /*#__PURE__*/React.createElement("tbody", null, rowGroups ? rowGroups.map((g, gi) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: g.key
  }, /*#__PURE__*/React.createElement("tr", {
    className: 'lz-grouprow' + (gi === 0 ? ' first' : '')
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: colCount,
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-groupband"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-groupband-l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lz-groupband-rule"
  }), g.label), /*#__PURE__*/React.createElement("span", {
    className: "lz-groupband-n"
  }, g.note ? g.note + ' · ' : '', g.rows.length, " ", g.rows.length === 1 ? 'posizione' : 'posizioni')))), g.rows.map(renderRow))) : rows.map(renderRow), rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: colCount,
    style: {
      textAlign: 'center',
      padding: 48,
      color: 'var(--lz-muted)'
    }
  }, "Nessun risultato con i criteri selezionati.")))));
}

/* ---------------- drawer ---------------- */
function Drawer({
  row,
  cfg,
  view,
  onClose
}) {
  if (!row) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(40,12,18,.34)',
      zIndex: 40,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 440,
      maxWidth: '92vw',
      height: '100%',
      background: '#fff',
      boxShadow: '-20px 0 50px rgba(35,31,32,.18)',
      padding: '28px 30px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono',monospace",
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--lz-burgundy)'
    }
  }, row.ticker), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '4px 0 0',
      fontSize: 22,
      fontWeight: 300,
      letterSpacing: '.01em',
      color: 'var(--lz-ink)'
    }
  }, row.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--lz-slate)',
      marginTop: 4
    }
  }, row.securityName || row.sector, row.region ? ' · ' + row.region : '')), /*#__PURE__*/React.createElement("button", {
    className: "lz-ico",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "x",
    s: 18
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 40,
      height: 2,
      background: 'var(--lz-burgundy)',
      margin: '18px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px 22px'
    }
  }, cfg.columns.filter(c => c.kind !== 'identity' && c.kind !== 'sub').map(c => /*#__PURE__*/React.createElement("div", {
    key: c.key
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'var(--lz-muted)',
      marginBottom: 4
    }
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15
    }
  }, c.kind === 'change' ? /*#__PURE__*/React.createElement(Change, {
    v: row[c.key]
  }) : c.kind === 'rating' ? /*#__PURE__*/React.createElement(RatingPill, {
    v: row[c.key]
  }) : c.kind === 'risk' ? /*#__PURE__*/React.createElement(RiskPill, {
    v: row[c.key]
  }) : c.kind === 'stars' ? /*#__PURE__*/React.createElement(Stars, {
    v: row[c.key]
  }) : /*#__PURE__*/React.createElement("span", {
    className: "num",
    style: {
      fontWeight: 600,
      color: 'var(--lz-ink)'
    }
  }, c.fmt ? c.fmt(row[c.key]) : row[c.key]))))), row.badges && row.badges.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 22
    }
  }, row.badges.map((b, i) => /*#__PURE__*/React.createElement(Badge, {
    key: i
  }, b))), view === 'admin' ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      paddingTop: 20,
      borderTop: '1px solid var(--lz-line)',
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "check",
    s: 15
  }), " Salva modifiche"), /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-ghost"
  }, "Annulla")) : /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      paddingTop: 18,
      borderTop: '1px solid var(--lz-line)',
      fontSize: 11.5,
      color: 'var(--lz-muted)',
      lineHeight: 1.6
    }
  }, "Dati a solo scopo informativo. Le performance passate non sono indicative dei risultati futuri.")));
}

/* ---------------- header ---------------- */
function Header({
  cfg,
  asset,
  setAsset,
  view,
  setView,
  count,
  onPrint
}) {
  const admin = view === 'admin';
  return /*#__PURE__*/React.createElement("header", {
    className: "print-hide",
    style: {
      background: '#fff',
      borderBottom: '1px solid var(--lz-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--lz-ink)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-wrap",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px 0',
      minHeight: 38
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      letterSpacing: '.18em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.7)'
    }
  }, "LFGZEST.COM \xB7 Security Lists"), /*#__PURE__*/React.createElement("div", {
    className: "lz-seg",
    style: {
      display: 'flex',
      gap: 2,
      background: 'rgba(255,255,255,.12)',
      borderRadius: 999,
      padding: 3
    }
  }, [['admin', 'Admin'], ['client', 'Cliente']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setView(k),
    "data-active": view === k,
    style: {
      border: 'none',
      borderRadius: 999,
      padding: '4px 16px',
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: '.04em',
      background: view === k ? '#fff' : 'transparent',
      color: view === k ? 'var(--lz-ink)' : 'rgba(255,255,255,.85)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    className: "lz-wrap",
    style: {
      padding: '24px 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-red.png",
    alt: "LFG+ZEST",
    style: {
      width: 46,
      height: 46
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--lz-burgundy)',
      fontWeight: 600
    }
  }, "LFG+ZEST \xB7 Research"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--lz-muted)',
      marginTop: 2
    }
  }, "Aggiornato al 16.06.2026"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, admin ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "upload",
    s: 15
  }), " Aggiorna lista"), /*#__PURE__*/React.createElement("button", {
    onClick: onPrint,
    className: "lz-btn lz-btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "download",
    s: 15
  }), " Esporta PDF"), /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "check",
    s: 15
  }), " Pubblica")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--lz-slate)',
      border: '1px solid var(--lz-line)',
      borderRadius: 999,
      padding: '6px 12px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "lock",
    s: 13
  }), " Vista cliente \xB7 sola lettura"), /*#__PURE__*/React.createElement("button", {
    onClick: onPrint,
    className: "lz-btn lz-btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "printer",
    s: 15
  }), " Stampa"), /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-ghost"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "link",
    s: 15
  }), " Condividi")))), admin && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 22
    }
  }, window.LZ_ASSET_ORDER.map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    onClick: () => setAsset(a),
    "data-active": asset === a,
    className: "lz-tab",
    style: {
      border: '1px solid',
      borderColor: asset === a ? 'var(--lz-burgundy)' : 'var(--lz-line)',
      background: asset === a ? 'var(--lz-burgundy)' : '#fff',
      color: asset === a ? '#fff' : 'var(--lz-slate)',
      borderRadius: 999,
      padding: '7px 18px',
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '.02em'
    }
  }, window.LZ_DATA[a].title.replace(' Selection', '')))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 24,
      margin: '22px 0 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '60ch'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 38,
      fontWeight: 300,
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--lz-burgundy)',
      lineHeight: 1.05
    }
  }, cfg.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--lz-slate)'
    }
  }, cfg.desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      fontWeight: 200,
      color: 'var(--lz-burgundy)',
      lineHeight: 1
    },
    className: "num"
  }, count), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--lz-muted)',
      marginTop: 4
    }
  }, "Posizioni in lista")))), admin && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--lz-sand2)',
      borderTop: '1px solid #E3D6BE',
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-wrap",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '9px 0',
      fontSize: 12.5,
      color: '#7A5A20'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "dot",
    s: 13,
    fill: true,
    stroke: 0,
    style: {
      color: 'var(--lz-gold)'
    }
  }), " Bozza \xB7 modifiche non ancora pubblicate ai clienti"), /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-primary",
    style: {
      padding: '5px 14px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "check",
    s: 14
  }), " Pubblica lista"))));
}

/* ---------------- toolbar ---------------- */
function Toolbar({
  cfg,
  q,
  setQ,
  filters,
  setFilter,
  activeChips,
  toggleChip,
  density,
  setDensity,
  view
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "print-hide",
    style: {
      background: 'rgba(249,244,238,.7)',
      borderBottom: '1px solid var(--lz-line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-wrap",
    style: {
      padding: '16px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: '1 1 280px',
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--lz-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "search",
    s: 16
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: cfg.searchPh,
    style: {
      width: '100%',
      padding: '10px 12px 10px 36px',
      border: '1px solid var(--lz-line)',
      borderRadius: 8,
      font: 'inherit',
      fontSize: 13.5,
      background: '#fff',
      color: 'var(--lz-ink)'
    }
  })), cfg.filters.map(f => /*#__PURE__*/React.createElement("select", {
    key: f.key,
    value: filters[f.key] || f.options[0],
    onChange: e => setFilter(f.key, e.target.value),
    style: {
      padding: '10px 12px',
      border: '1px solid var(--lz-line)',
      borderRadius: 8,
      font: 'inherit',
      fontSize: 13.5,
      background: '#fff',
      color: 'var(--lz-ink)',
      minWidth: 160
    }
  }, f.options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o)))), /*#__PURE__*/React.createElement("div", {
    className: "lz-seg",
    style: {
      display: 'flex',
      gap: 2,
      background: '#fff',
      border: '1px solid var(--lz-line)',
      borderRadius: 8,
      padding: 3,
      marginLeft: 'auto'
    }
  }, [['comfortable', 'Comoda'], ['compact', 'Compatta']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setDensity(k),
    style: {
      border: 'none',
      borderRadius: 6,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 600,
      background: density === k ? 'var(--lz-burgundy)' : 'transparent',
      color: density === k ? '#fff' : 'var(--lz-slate)'
    }
  }, l))), view === 'admin' && /*#__PURE__*/React.createElement("button", {
    className: "lz-btn lz-btn-outline"
  }, /*#__PURE__*/React.createElement(Icon, {
    n: "plus",
    s: 15
  }), " Aggiungi")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'var(--lz-muted)',
      fontWeight: 600,
      marginRight: 2
    }
  }, "Filtri"), cfg.chips.map(c => {
    const on = activeChips.includes(c);
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => toggleChip(c),
      style: {
        border: '1px solid',
        borderColor: on ? 'var(--lz-burgundy)' : 'var(--lz-line)',
        background: on ? 'rgba(131,2,26,.06)' : '#fff',
        color: on ? 'var(--lz-burgundy)' : 'var(--lz-slate)',
        borderRadius: 999,
        padding: '5px 13px',
        fontSize: 12,
        fontWeight: 500
      }
    }, c);
  }))));
}
const DEFAULT_DISCLAIMER = `LFG+ZEST SA è un gestore di patrimoni collettivi e individuali con sede a Lugano, regolamentato dall'Autorità federale di vigilanza sui mercati finanziari (FINMA), presso la quale detiene tutte le autorizzazioni richieste.

Il presente documento è privato e confidenziale e ha carattere puramente informativo: non costituisce offerta, sollecitazione, raccomandazione, consulenza o invito all'acquisto o alla vendita di strumenti finanziari, né consulenza legale, fiscale o di altra natura. I dati e le opinioni qui contenuti possono variare senza preavviso e si basano su informazioni ritenute attendibili, senza garanzia di completezza o accuratezza.

Le performance passate non sono indicative dei risultati futuri. Ogni investimento comporta rischi, inclusa la possibile perdita del capitale investito. L'eventuale investimento deve essere valutato in modo indipendente sulla base della documentazione ufficiale dello strumento finanziario e dell'idoneità rispetto al profilo del singolo investitore.

Ogni riproduzione, anche parziale, del presente materiale è consentita unicamente previo consenso scritto di LFG+ZEST SA. Foro competente esclusivo: Lugano (Svizzera). © LFG+ZEST SA.`;

/* ---------------- app ---------------- */
function App() {
  const [asset, setAsset] = useState('equity');
  const [view, setView] = useState('admin');
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({});
  const [chips, setChips] = useState([]);
  const [sort, setSort] = useState({
    key: 'ytd',
    dir: 'desc'
  });
  const [density, setDensity] = useState('comfortable');
  const [selected, setSelected] = useState(null);
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const cfg = window.LZ_DATA[asset];
  React.useEffect(() => {
    setFilters({});
    setChips([]);
    setQ('');
    setSort({
      key: cfg.columns[2].key,
      dir: 'desc'
    });
  }, [asset]);
  const rows = useMemo(() => {
    let r = cfg.rows.slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter(x => (x.name + ' ' + x.ticker + ' ' + (x.sector || '') + ' ' + (x.securityName || '')).toLowerCase().includes(s));
    }
    cfg.filters.forEach(f => {
      const v = filters[f.key];
      if (v && v !== f.options[0]) r = r.filter(x => (x[f.key] || x.sector || x.region) === v || x[f.key] === v);
    });
    if (chips.length) r = r.filter(x => chips.every(c => (x.badges || []).includes(c)));
    if (sort.key) r = r.sort((a, b) => {
      const av = a[sort.key],
        bv = b[sort.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      const d = typeof av === 'number' ? av - bv : ('' + av).localeCompare('' + bv);
      return sort.dir === 'asc' ? d : -d;
    });
    return r;
  }, [cfg, q, filters, chips, sort]);
  const onSort = k => setSort(s => s.key === k ? {
    key: k,
    dir: s.dir === 'asc' ? 'desc' : 'asc'
  } : {
    key: k,
    dir: 'desc'
  });
  const onPrint = () => window.print();
  return /*#__PURE__*/React.createElement("div", {
    "data-density": density
  }, /*#__PURE__*/React.createElement("style", null, CSS), /*#__PURE__*/React.createElement("div", {
    className: "print-only lz-printcover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-mtn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-row"
  }, /*#__PURE__*/React.createElement("span", null, "LFGZEST.COM"), /*#__PURE__*/React.createElement("span", null, "Private & Confidential")), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-logo"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup-white.png",
    alt: "LFG+ZEST"
  })), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-kicker"
  }, "LFG+ZEST \xB7 Research"), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-title"
  }, cfg.title), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-sub"
  }, cfg.desc), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-date"
  }, "Aggiornato al 16.06.2026 \xB7 ", cfg.rows.length, " posizioni")), /*#__PURE__*/React.createElement("div", {
    className: "lz-cv-row"
  }, /*#__PURE__*/React.createElement("span", null, "L U G A N O\xA0\xA0\xB7\xA0\xA0Z U R I C H\xA0\xA0\xB7\xA0\xA0S W I T Z E R L A N D"), /*#__PURE__*/React.createElement("span", null, "Not intended for distribution"))), /*#__PURE__*/React.createElement("div", {
    className: "lz-printbody"
  }, /*#__PURE__*/React.createElement("div", {
    className: "print-only lz-printmast"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-left"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-red.png",
    alt: "LFG+ZEST"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-kicker"
  }, "LFG+ZEST \xB7 Research"), /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-title"
  }, cfg.title))), /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-date"
  }, "Aggiornato al 16.06.2026"), /*#__PURE__*/React.createElement("div", {
    className: "lz-pm-count"
  }, /*#__PURE__*/React.createElement("b", null, rows.length), " posizioni"))), /*#__PURE__*/React.createElement(Header, {
    cfg: cfg,
    asset: asset,
    setAsset: setAsset,
    view: view,
    setView: setView,
    count: cfg.rows.length,
    onPrint: onPrint
  }), /*#__PURE__*/React.createElement(Toolbar, {
    cfg: cfg,
    q: q,
    setQ: setQ,
    filters: filters,
    setFilter: (k, v) => setFilters(f => ({
      ...f,
      [k]: v
    })),
    activeChips: chips,
    toggleChip: c => setChips(cs => cs.includes(c) ? cs.filter(x => x !== c) : [...cs, c]),
    density: density,
    setDensity: setDensity,
    view: view
  }), /*#__PURE__*/React.createElement("main", {
    className: "lz-wrap",
    style: {
      padding: '22px 0 16px'
    }
  }, /*#__PURE__*/React.createElement(Table, {
    cfg: cfg,
    rows: rows,
    sort: sort,
    onSort: onSort,
    view: view,
    onSelect: row => setSelected(row)
  })), view === 'admin' && /*#__PURE__*/React.createElement("section", {
    className: "lz-wrap print-hide",
    style: {
      paddingTop: 6,
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--lz-line)',
      borderRadius: 12,
      background: '#fff',
      padding: '16px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10.5,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--lz-burgundy)',
      fontWeight: 600
    }
  }, "Disclaimer del PDF"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--lz-muted)'
    }
  }, "\u2014 modificabile, compare nella pagina finale del documento")), /*#__PURE__*/React.createElement("textarea", {
    value: disclaimer,
    onChange: e => setDisclaimer(e.target.value),
    rows: 5,
    style: {
      width: '100%',
      font: 'inherit',
      fontSize: 12.5,
      lineHeight: 1.6,
      color: 'var(--lz-ink)',
      border: '1px solid var(--lz-line)',
      borderRadius: 8,
      padding: '10px 12px',
      resize: 'vertical',
      boxSizing: 'border-box'
    }
  }))), /*#__PURE__*/React.createElement("footer", {
    className: "print-hide",
    style: {
      borderTop: '1px solid var(--lz-line)',
      background: view === 'client' ? '#fff' : 'transparent',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-wrap",
    style: {
      padding: '26px 0 40px',
      textAlign: 'center'
    }
  }, view === 'client' && /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-red.png",
    alt: "LFG+ZEST",
    style: {
      width: 38,
      height: 38,
      margin: '0 auto 12px',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--lz-ink)',
      fontSize: 13.5,
      letterSpacing: '.02em'
    }
  }, "LFG+ZEST SA \xB7 Lugano \xB7 Zurich"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--lz-slate)',
      marginTop: 6,
      maxWidth: '70ch',
      marginInline: 'auto',
      lineHeight: 1.6
    }
  }, "Documento privato e confidenziale. I dati sono a solo scopo informativo e non costituiscono offerta o sollecitazione all'investimento. Le performance passate non sono indicative dei risultati futuri."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--lz-muted)',
      marginTop: 10,
      letterSpacing: '.04em'
    }
  }, "Fonte: Bloomberg, Morningstar, LFG+ZEST Research"))), /*#__PURE__*/React.createElement("div", {
    className: "print-only lz-printfoot"
  }, /*#__PURE__*/React.createElement("span", null, "LFG+ZEST SA \xB7 Lugano \xB7 Zurich"), /*#__PURE__*/React.createElement("span", null, "Documento privato e confidenziale \xB7 Le performance passate non sono indicative dei risultati futuri"), /*#__PURE__*/React.createElement("span", null, "Fonte: Bloomberg, Morningstar \xB7 LFGZEST.COM"))), /*#__PURE__*/React.createElement("div", {
    className: "print-only lz-printdisc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-disc-head"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-red.png",
    alt: "LFG+ZEST"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lz-disc-title"
  }, "Disclaimer")), /*#__PURE__*/React.createElement("div", {
    className: "lz-disc-body"
  }, disclaimer), /*#__PURE__*/React.createElement("div", {
    className: "lz-disc-foot"
  }, "LFG+ZEST SA \xB7 Lugano \xB7 Zurich \xB7 Switzerland \xB7 LFGZEST.COM")), /*#__PURE__*/React.createElement("div", {
    className: "print-only lz-printend"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-end-mtn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lz-end-row"
  }, /*#__PURE__*/React.createElement("span", null, "LFGZEST.COM"), /*#__PURE__*/React.createElement("span", null, "Private & Confidential")), /*#__PURE__*/React.createElement("div", {
    className: "lz-end-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup-white.png",
    alt: "LFG+ZEST"
  }), /*#__PURE__*/React.createElement("div", {
    className: "lz-end-title"
  }, "Get in touch with us")), /*#__PURE__*/React.createElement("div", {
    className: "lz-end-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lz-end-contacts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("b", null, "Lugano"), "Via F. Pelli 3", /*#__PURE__*/React.createElement("br", null), "6900 Lugano \xB7 CH", /*#__PURE__*/React.createElement("br", null), "+41 91 912 49 61"), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("b", null, "Zurich"), "Talstrasse 65", /*#__PURE__*/React.createElement("br", null), "8001 Zurich \xB7 CH", /*#__PURE__*/React.createElement("br", null), "+41 43 497 31 39"), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("b", null, "Contatti"), "info@lfgzest.com", /*#__PURE__*/React.createElement("br", null), "lfgzest.com")), /*#__PURE__*/React.createElement("div", {
    className: "lz-end-row"
  }, /*#__PURE__*/React.createElement("span", null, "L U G A N O\xA0\xA0\xB7\xA0\xA0Z U R I C H\xA0\xA0\xB7\xA0\xA0S W I T Z E R L A N D"), /*#__PURE__*/React.createElement("span", null, "Not intended for distribution")))), /*#__PURE__*/React.createElement(Drawer, {
    row: selected,
    cfg: cfg,
    view: view,
    onClose: () => setSelected(null)
  }));
}
const CSS = `
.lz-wrap{max-width:1240px;margin:0 auto;padding-left:28px;padding-right:28px;}
.lz-row:hover{background:var(--lz-cream)!important;}
.lz-sortable:hover{background:rgba(131,2,26,.05)!important;}
.lz-ico{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;background:transparent;color:var(--lz-slate);border-radius:6px;transition:.15s;}
.lz-ico:hover{background:rgba(131,2,26,.08);color:var(--lz-burgundy);}
.lz-ico-danger:hover{background:rgba(158,42,54,.1);color:var(--lz-neg);}
.lz-btn{display:inline-flex;align-items:center;gap:7px;border-radius:7px;padding:8px 14px;font-size:12.5px;font-weight:600;letter-spacing:.02em;border:1px solid transparent;transition:.15s;white-space:nowrap;}
.lz-btn-primary{background:var(--lz-burgundy);color:#fff;border-color:var(--lz-burgundy);}
.lz-btn-primary:hover{background:var(--lz-maroon);border-color:var(--lz-maroon);}
.lz-btn-outline{background:#fff;color:var(--lz-burgundy);border-color:var(--lz-burgundy);}
.lz-btn-outline:hover{background:var(--lz-burgundy);color:#fff;}
.lz-btn-ghost{background:#fff;color:var(--lz-slate);border-color:var(--lz-line);}
.lz-btn-ghost:hover{border-color:var(--lz-burgundy);color:var(--lz-burgundy);}
.lz-tab{transition:.15s;}
.lz-tab:hover{border-color:var(--lz-burgundy)!important;color:var(--lz-burgundy);}
.lz-tab[data-active="true"]:hover{color:#fff;}
select:focus,input:focus{outline:none;border-color:var(--lz-burgundy)!important;box-shadow:0 0 0 3px rgba(131,2,26,.08);}
.print-only{display:none;}
.lz-groupband{ display:flex; align-items:center; justify-content:space-between; padding:9px 18px; background:linear-gradient(90deg, rgba(131,2,26,.07), rgba(131,2,26,.015)); border-top:1px solid var(--lz-burgundy); border-bottom:1px solid var(--lz-line); }
.lz-groupband-l{ display:flex; align-items:center; gap:10px; font-size:12px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--lz-burgundy); }
.lz-groupband-rule{ width:18px; height:2px; background:var(--lz-burgundy); display:inline-block; }
.lz-groupband-n{ font-size:10.5px; letter-spacing:.04em; color:var(--lz-muted); text-transform:uppercase; }
@media print{
  @page{ size:A4 landscape; margin:12mm 13mm 13mm; }
  @page lzcover{ margin:0; }
  html,body{ background:#fff!important; }
  .print-hide{ display:none!important; }
  .print-only{ display:flex!important; }
  *{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .lz-wrap{ max-width:none!important; padding:0!important; }
  main{ padding:0!important; }
  .lz-printbody{ padding:0; }
  .lz-printcover{ page:lzcover; position:relative; height:210mm; width:100%; overflow:hidden; color:#fff; box-sizing:border-box; padding:15mm 18mm; background:radial-gradient(120% 140% at 75% 12%, #8B0A1F 0%, #83021A 42%, #45000B 100%); display:flex; flex-direction:column; justify-content:space-between; break-after:page; page-break-after:always; }
  .lz-cv-mtn{ position:absolute; left:0; right:0; bottom:0; height:60%; background:url('../../assets/mountain-watermark.png') center bottom / cover no-repeat; mix-blend-mode:soft-light; opacity:.8; }
  .lz-cv-row{ display:flex; justify-content:space-between; position:relative; z-index:2; font-size:8pt; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.78); }
  .lz-cv-center{ position:relative; z-index:2; text-align:center; }
  .lz-cv-logo{ margin:0 auto 8mm; }
  .lz-cv-logo img{ width:38mm; height:38mm; display:block; margin:0 auto; }
  .lz-cv-kicker{ font-size:9pt; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.7); }
  .lz-cv-title{ font-size:30pt; font-weight:300; letter-spacing:.06em; text-transform:uppercase; margin-top:3mm; }
  .lz-cv-rule{ width:16mm; height:2px; background:rgba(255,255,255,.8); margin:6mm auto; }
  .lz-cv-sub{ font-size:11pt; font-weight:300; line-height:1.5; color:rgba(255,255,255,.9); max-width:150mm; margin:0 auto; }
  .lz-cv-date{ font-size:9pt; color:rgba(255,255,255,.72); margin-top:7mm; letter-spacing:.04em; }
  .lz-printend{ page:lzcover; break-before:page; page-break-before:always; position:relative; height:206mm; width:100%; overflow:hidden; color:#fff; box-sizing:border-box; padding:15mm 18mm; background:radial-gradient(120% 140% at 75% 12%, #8B0A1F 0%, #83021A 42%, #45000B 100%); display:flex; flex-direction:column; justify-content:space-between; }
  .lz-end-mtn{ position:absolute; left:0; right:0; bottom:0; height:52%; background:url('../../assets/mountain-watermark.png') center bottom / cover no-repeat; mix-blend-mode:soft-light; opacity:.55; }
  .lz-end-row{ display:flex; justify-content:space-between; position:relative; z-index:2; font-size:8pt; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.7); }
  .lz-end-center{ position:relative; z-index:2; text-align:center; }
  .lz-end-center img{ width:38mm; height:38mm; display:block; margin:0 auto 7mm; }
  .lz-end-title{ font-size:24pt; font-weight:300; letter-spacing:.06em; text-transform:uppercase; }
  .lz-end-bottom{ position:relative; z-index:2; }
  .lz-end-contacts{ display:flex; justify-content:center; gap:20mm; margin-bottom:8mm; }
  .lz-end-contacts .col{ font-size:9pt; line-height:1.7; color:rgba(255,255,255,.9); text-align:center; }
  .lz-end-contacts b{ font-weight:600; letter-spacing:.1em; text-transform:uppercase; display:block; margin-bottom:2mm; font-size:8.5pt; color:#fff; }
  .lz-printdisc{ display:block!important; break-before:page; page-break-before:always; background:#fff; color:var(--lz-ink); padding:4mm 2mm; }
  .lz-disc-head{ display:flex; align-items:center; gap:10px; border-bottom:2px solid var(--lz-burgundy); padding-bottom:7px; margin-bottom:11px; }
  .lz-disc-head img{ width:30px; height:30px; }
  .lz-disc-title{ font-size:15pt; font-weight:300; letter-spacing:.08em; text-transform:uppercase; color:var(--lz-burgundy); }
  .lz-disc-body{ font-size:8pt; line-height:1.7; color:#4A4A4C; column-count:2; column-gap:12mm; text-align:justify; white-space:pre-wrap; }
  .lz-disc-foot{ margin-top:9mm; padding-top:5px; border-top:1px solid var(--lz-line); font-size:7.5pt; letter-spacing:.08em; text-transform:uppercase; color:var(--lz-muted); text-align:center; }
  .lz-grouprow{ break-before:page; page-break-before:always; }
  .lz-grouprow.first{ break-before:auto; page-break-before:auto; }
  .lz-tablecard{ box-shadow:none!important; border:none!important; border-radius:0!important; overflow:visible!important; }
  table{ min-width:0!important; width:100%!important; font-size:8.6pt!important; }
  thead{ display:table-header-group; }
  thead tr:first-child th{ border-top:none!important; }
  tr{ break-inside:avoid; page-break-inside:avoid; }
  td{ height:auto!important; padding-top:7px!important; padding-bottom:7px!important; }
  .lz-printmast{ justify-content:space-between; align-items:flex-end; border-bottom:2px solid var(--lz-burgundy); padding-bottom:8px; margin-bottom:12px; }
  .lz-pm-left{ display:flex; gap:12px; align-items:center; }
  .lz-printmast img{ width:34px; height:34px; }
  .lz-pm-kicker{ font-size:8pt; letter-spacing:.16em; text-transform:uppercase; color:var(--lz-burgundy); font-weight:600; }
  .lz-pm-title{ font-size:18pt; font-weight:300; letter-spacing:.04em; text-transform:uppercase; color:var(--lz-burgundy); line-height:1.1; }
  .lz-pm-right{ text-align:right; }
  .lz-pm-date{ font-size:8pt; color:var(--lz-muted); }
  .lz-pm-count{ font-size:9pt; color:var(--lz-ink); margin-top:3px; }
  .lz-pm-count b{ font-size:15pt; font-weight:300; color:var(--lz-burgundy); }
  .lz-printfoot{ justify-content:space-between; gap:14px; font-size:7.5pt; letter-spacing:.02em; color:var(--lz-muted); border-top:1px solid var(--lz-line); padding-top:6px; margin-top:16px; break-inside:avoid; }
}
`;
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/list-template/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/list-template/data.js
try { (() => {
/* LFG+ZEST List Template — column configs + sample data.
   One generic table; each asset class is just a different column set + rows.
   Claude Code can replace `rows` with live data and keep the `columns` config. */
(function () {
  const change = v => ({
    kind: 'change',
    v
  });

  // ---------- column descriptors ----------
  // kind: identity | num | change | rating | stars | risk | badge
  const EQUITY = {
    id: 'equity',
    title: 'Equity Selection',
    desc: 'La nostra selezione di titoli azionari con posizionamento strategico e visione di medio periodo.',
    searchPh: 'Cerca titolo, ticker o settore…',
    filters: [{
      key: 'region',
      label: 'Regione',
      options: ['Tutte le regioni', 'Nord America', 'Europa', 'Svizzera']
    }, {
      key: 'sector',
      label: 'Settore',
      options: ['Tutti i settori', 'Technology', 'Healthcare', 'Financials', 'Consumer', 'Energy', 'Industrials']
    }],
    chips: ['Top Performer', 'High Dividend', 'Value Pick', 'High Growth'],
    columns: [{
      key: 'name',
      label: 'Titolo',
      group: 'Anagrafica',
      kind: 'identity',
      align: 'left'
    }, {
      key: 'sector',
      label: 'Settore',
      group: 'Anagrafica',
      kind: 'sub',
      align: 'left'
    }, {
      key: 'mktCap',
      label: 'Mkt Cap',
      group: 'Performance',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : '$' + v.toFixed(0) + 'B'
    }, {
      key: 'ytd',
      label: 'YTD',
      group: 'Performance',
      kind: 'change',
      align: 'right'
    }, {
      key: 'cagr',
      label: 'CAGR EPS',
      group: 'Crescita',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + '%'
    }, {
      key: 'estFY',
      label: 'Est. FY',
      group: 'Crescita',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + '%'
    }, {
      key: 'roe',
      label: 'ROE',
      group: 'Redditività',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + '%'
    }, {
      key: 'margin',
      label: 'P. Margin',
      group: 'Redditività',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + '%'
    }, {
      key: 'fpe',
      label: 'Fwd P/E',
      group: 'Valutazione',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + 'x'
    }, {
      key: 'dy',
      label: 'Div Yield',
      group: 'Valutazione',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2) + '%'
    }],
    groupTints: {
      Performance: 'burgundy',
      Crescita: 'teal',
      Redditività: 'gold',
      Valutazione: 'slate'
    },
    rows: [{
      id: 'NVDA',
      name: 'NVIDIA Corp',
      ticker: 'NVDA',
      sector: 'Technology',
      region: 'Nord America',
      mktCap: 3120,
      ytd: 27.4,
      cagr: 41.2,
      estFY: 38.0,
      roe: 91.5,
      margin: 55.0,
      fpe: 34.2,
      dy: 0.03,
      badges: ['Top Performer', 'High Growth']
    }, {
      id: 'NESN',
      name: 'Nestlé SA',
      ticker: 'NESN',
      sector: 'Consumer',
      region: 'Svizzera',
      mktCap: 248,
      ytd: -4.2,
      cagr: 5.1,
      estFY: 4.0,
      roe: 26.4,
      margin: 14.2,
      fpe: 18.6,
      dy: 3.30,
      badges: ['High Dividend']
    }, {
      id: 'ASML',
      name: 'ASML Holding',
      ticker: 'ASML',
      sector: 'Technology',
      region: 'Europa',
      mktCap: 312,
      ytd: 12.1,
      cagr: 24.0,
      estFY: 19.5,
      roe: 48.0,
      margin: 28.4,
      fpe: 29.1,
      dy: 0.95,
      badges: ['High Growth']
    }, {
      id: 'UNH',
      name: 'UnitedHealth Group',
      ticker: 'UNH',
      sector: 'Healthcare',
      region: 'Nord America',
      mktCap: 470,
      ytd: 6.1,
      cagr: 13.5,
      estFY: 11.0,
      roe: 24.8,
      margin: 6.1,
      fpe: 17.2,
      dy: 1.55,
      badges: ['Value Pick']
    }, {
      id: 'NOVN',
      name: 'Novartis AG',
      ticker: 'NOVN',
      sector: 'Healthcare',
      region: 'Svizzera',
      mktCap: 215,
      ytd: 8.9,
      cagr: 7.8,
      estFY: 6.5,
      roe: 22.1,
      margin: 24.0,
      fpe: 14.0,
      dy: 3.60,
      badges: ['High Dividend', 'Value Pick']
    }, {
      id: 'JPM',
      name: 'JPMorgan Chase',
      ticker: 'JPM',
      sector: 'Financials',
      region: 'Nord America',
      mktCap: 612,
      ytd: 15.7,
      cagr: 9.2,
      estFY: 7.0,
      roe: 17.0,
      margin: 32.5,
      fpe: 12.4,
      dy: 2.10,
      badges: ['Value Pick']
    }, {
      id: 'TTE',
      name: 'TotalEnergies SE',
      ticker: 'TTE',
      sector: 'Energy',
      region: 'Europa',
      mktCap: 158,
      ytd: -2.8,
      cagr: 4.0,
      estFY: 2.0,
      roe: 15.6,
      margin: 9.8,
      fpe: 8.1,
      dy: 5.20,
      badges: ['High Dividend']
    }, {
      id: 'SIE',
      name: 'Siemens AG',
      ticker: 'SIE',
      sector: 'Industrials',
      region: 'Europa',
      mktCap: 162,
      ytd: 9.4,
      cagr: 8.1,
      estFY: 6.8,
      roe: 16.9,
      margin: 11.2,
      fpe: 15.3,
      dy: 2.80,
      badges: []
    }, {
      id: 'AAPL',
      name: 'Apple Inc',
      ticker: 'AAPL',
      sector: 'Technology',
      region: 'Nord America',
      mktCap: 3380,
      ytd: 8.2,
      cagr: 9.4,
      estFY: 8.0,
      roe: 147.0,
      margin: 25.3,
      fpe: 30.5,
      dy: 0.45,
      badges: ['Top Performer']
    }, {
      id: 'MSFT',
      name: 'Microsoft Corp',
      ticker: 'MSFT',
      sector: 'Technology',
      region: 'Nord America',
      mktCap: 3260,
      ytd: 13.9,
      cagr: 15.1,
      estFY: 13.5,
      roe: 39.1,
      margin: 36.0,
      fpe: 31.8,
      dy: 0.72,
      badges: ['High Growth']
    }, {
      id: 'GOOGL',
      name: 'Alphabet Inc',
      ticker: 'GOOGL',
      sector: 'Technology',
      region: 'Nord America',
      mktCap: 2180,
      ytd: 16.4,
      cagr: 17.8,
      estFY: 14.0,
      roe: 30.2,
      margin: 27.7,
      fpe: 21.4,
      dy: 0.50,
      badges: ['Value Pick', 'High Growth']
    }, {
      id: 'AMZN',
      name: 'Amazon.com Inc',
      ticker: 'AMZN',
      sector: 'Consumer',
      region: 'Nord America',
      mktCap: 1980,
      ytd: 11.2,
      cagr: 22.0,
      estFY: 18.0,
      roe: 22.4,
      margin: 8.3,
      fpe: 38.0,
      dy: 0.00,
      badges: ['High Growth']
    }, {
      id: 'LVMH',
      name: 'LVMH Moët Hennessy',
      ticker: 'MC',
      sector: 'Consumer',
      region: 'Europa',
      mktCap: 372,
      ytd: -6.4,
      cagr: 11.2,
      estFY: 6.0,
      roe: 24.6,
      margin: 18.4,
      fpe: 22.0,
      dy: 1.95,
      badges: []
    }, {
      id: 'ROG',
      name: 'Roche Holding',
      ticker: 'ROG',
      sector: 'Healthcare',
      region: 'Svizzera',
      mktCap: 232,
      ytd: 5.6,
      cagr: 6.0,
      estFY: 4.5,
      roe: 39.0,
      margin: 21.0,
      fpe: 13.6,
      dy: 3.80,
      badges: ['High Dividend']
    }, {
      id: 'UBSG',
      name: 'UBS Group',
      ticker: 'UBSG',
      sector: 'Financials',
      region: 'Svizzera',
      mktCap: 98,
      ytd: 10.8,
      cagr: 7.4,
      estFY: 9.0,
      roe: 8.4,
      margin: 18.0,
      fpe: 11.0,
      dy: 2.40,
      badges: ['Value Pick']
    }, {
      id: 'V',
      name: 'Visa Inc',
      ticker: 'V',
      sector: 'Financials',
      region: 'Nord America',
      mktCap: 560,
      ytd: 9.1,
      cagr: 16.0,
      estFY: 12.5,
      roe: 49.0,
      margin: 53.0,
      fpe: 27.2,
      dy: 0.75,
      badges: ['High Growth']
    }, {
      id: 'MA',
      name: 'Mastercard Inc',
      ticker: 'MA',
      sector: 'Financials',
      region: 'Nord America',
      mktCap: 432,
      ytd: 7.8,
      cagr: 17.4,
      estFY: 13.0,
      roe: 168.0,
      margin: 45.6,
      fpe: 30.0,
      dy: 0.55,
      badges: ['High Growth']
    }, {
      id: 'XOM',
      name: 'Exxon Mobil Corp',
      ticker: 'XOM',
      sector: 'Energy',
      region: 'Nord America',
      mktCap: 478,
      ytd: -3.1,
      cagr: 5.0,
      estFY: 1.5,
      roe: 17.2,
      margin: 10.4,
      fpe: 12.6,
      dy: 3.30,
      badges: ['High Dividend']
    }, {
      id: 'SHEL',
      name: 'Shell plc',
      ticker: 'SHEL',
      sector: 'Energy',
      region: 'Europa',
      mktCap: 210,
      ytd: 2.4,
      cagr: 4.5,
      estFY: 2.0,
      roe: 12.0,
      margin: 8.0,
      fpe: 8.4,
      dy: 3.90,
      badges: ['High Dividend']
    }, {
      id: 'CAT',
      name: 'Caterpillar Inc',
      ticker: 'CAT',
      sector: 'Industrials',
      region: 'Nord America',
      mktCap: 168,
      ytd: 6.7,
      cagr: 9.8,
      estFY: 5.0,
      roe: 48.0,
      margin: 16.4,
      fpe: 16.0,
      dy: 1.55,
      badges: []
    }, {
      id: 'ABBV',
      name: 'AbbVie Inc',
      ticker: 'ABBV',
      sector: 'Healthcare',
      region: 'Nord America',
      mktCap: 312,
      ytd: 12.6,
      cagr: 8.0,
      estFY: 7.0,
      roe: 78.0,
      margin: 22.0,
      fpe: 15.8,
      dy: 3.20,
      badges: ['High Dividend']
    }, {
      id: 'SAP',
      name: 'SAP SE',
      ticker: 'SAP',
      sector: 'Technology',
      region: 'Europa',
      mktCap: 268,
      ytd: 18.0,
      cagr: 12.0,
      estFY: 11.0,
      roe: 14.0,
      margin: 17.5,
      fpe: 33.0,
      dy: 1.00,
      badges: ['High Growth']
    }, {
      id: 'SU',
      name: 'Schneider Electric',
      ticker: 'SU',
      sector: 'Industrials',
      region: 'Europa',
      mktCap: 142,
      ytd: 7.2,
      cagr: 10.0,
      estFY: 7.5,
      roe: 15.6,
      margin: 14.0,
      fpe: 24.0,
      dy: 1.80,
      badges: []
    }, {
      id: 'PEP',
      name: 'PepsiCo Inc',
      ticker: 'PEP',
      sector: 'Consumer',
      region: 'Nord America',
      mktCap: 232,
      ytd: -1.2,
      cagr: 6.5,
      estFY: 4.0,
      roe: 47.0,
      margin: 13.0,
      fpe: 19.0,
      dy: 3.10,
      badges: ['High Dividend']
    }, {
      id: 'NOVO',
      name: 'Novo Nordisk',
      ticker: 'NOVO',
      sector: 'Healthcare',
      region: 'Europa',
      mktCap: 410,
      ytd: 19.8,
      cagr: 26.0,
      estFY: 20.0,
      roe: 84.0,
      margin: 35.0,
      fpe: 28.0,
      dy: 1.10,
      badges: ['Top Performer', 'High Growth']
    }, {
      id: 'TSLA',
      name: 'Tesla Inc',
      ticker: 'TSLA',
      sector: 'Consumer',
      region: 'Nord America',
      mktCap: 720,
      ytd: -8.4,
      cagr: 30.0,
      estFY: 15.0,
      roe: 20.0,
      margin: 9.0,
      fpe: 62.0,
      dy: 0.00,
      badges: []
    }, {
      id: 'ABBN',
      name: 'ABB Ltd',
      ticker: 'ABBN',
      sector: 'Industrials',
      region: 'Svizzera',
      mktCap: 96,
      ytd: 8.0,
      cagr: 9.0,
      estFY: 6.0,
      roe: 22.0,
      margin: 13.5,
      fpe: 21.0,
      dy: 2.20,
      badges: []
    }, {
      id: 'JNJ',
      name: 'Johnson & Johnson',
      ticker: 'JNJ',
      sector: 'Healthcare',
      region: 'Nord America',
      mktCap: 360,
      ytd: 3.4,
      cagr: 5.5,
      estFY: 4.0,
      roe: 23.0,
      margin: 18.0,
      fpe: 15.0,
      dy: 3.05,
      badges: ['High Dividend', 'Value Pick']
    }, {
      id: 'ADBE',
      name: 'Adobe Inc',
      ticker: 'ADBE',
      sector: 'Technology',
      region: 'Nord America',
      mktCap: 246,
      ytd: -5.2,
      cagr: 14.0,
      estFY: 11.0,
      roe: 36.0,
      margin: 28.0,
      fpe: 24.0,
      dy: 0.00,
      badges: ['Value Pick']
    }, {
      id: 'ENEL',
      name: 'Enel SpA',
      ticker: 'ENEL',
      sector: 'Energy',
      region: 'Europa',
      mktCap: 78,
      ytd: 6.0,
      cagr: 4.0,
      estFY: 3.0,
      roe: 13.0,
      margin: 9.5,
      fpe: 10.5,
      dy: 6.10,
      badges: ['High Dividend']
    }, {
      id: 'COST',
      name: 'Costco Wholesale',
      ticker: 'COST',
      sector: 'Consumer',
      region: 'Nord America',
      mktCap: 398,
      ytd: 14.2,
      cagr: 12.0,
      estFY: 9.5,
      roe: 31.0,
      margin: 2.9,
      fpe: 48.0,
      dy: 0.50,
      badges: ['High Growth']
    }, {
      id: 'ZURN',
      name: 'Zurich Insurance',
      ticker: 'ZURN',
      sector: 'Financials',
      region: 'Svizzera',
      mktCap: 84,
      ytd: 7.4,
      cagr: 6.0,
      estFY: 5.0,
      roe: 22.0,
      margin: 9.0,
      fpe: 13.0,
      dy: 5.00,
      badges: ['High Dividend']
    }]
  };
  const BOND = {
    id: 'bond',
    title: 'Bond Selection',
    desc: 'Obbligazioni selezionate per qualità dell\u2019emittente, liquidità e rendimento corretto per il rischio.',
    searchPh: 'Cerca ISIN, emittente o valuta…',
    filters: [{
      key: 'rating',
      label: 'Rating',
      options: ['Tutti i rating', 'Investment Grade', 'High Yield']
    }, {
      key: 'currency',
      label: 'Valuta',
      options: ['Tutte le valute', 'USD', 'EUR', 'CHF']
    }],
    chips: ['Core', 'Investment Grade', 'High Yield', 'Short Duration'],
    columns: [{
      key: 'name',
      label: 'Emittente / ISIN',
      group: 'Anagrafica',
      kind: 'identity',
      align: 'left'
    }, {
      key: 'currency',
      label: 'Valuta',
      group: 'Anagrafica',
      kind: 'sub',
      align: 'left'
    }, {
      key: 'coupon',
      label: 'Cedola',
      group: 'Cedola & Scadenza',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2) + '%'
    }, {
      key: 'maturity',
      label: 'Scadenza',
      group: 'Cedola & Scadenza',
      kind: 'num',
      align: 'left',
      fmt: v => v || '–'
    }, {
      key: 'rating',
      label: 'Rating',
      group: 'Rating & Rischio',
      kind: 'rating',
      align: 'left'
    }, {
      key: 'risk',
      label: 'Rischio',
      group: 'Rating & Rischio',
      kind: 'risk',
      align: 'left'
    }, {
      key: 'price',
      label: 'Prezzo',
      group: 'Rendimento',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2)
    }, {
      key: 'ytm',
      label: 'YTM',
      group: 'Rendimento',
      kind: 'numStrong',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2) + '%'
    }, {
      key: 'duration',
      label: 'Duration',
      group: 'Rendimento',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(1) + 'y'
    }],
    groupTints: {
      'Cedola & Scadenza': 'gold',
      'Rating & Rischio': 'slate',
      Rendimento: 'burgundy'
    },
    rows: [{
      id: 'b1',
      name: 'US Treasury',
      ticker: 'US91282CJL',
      securityName: 'UST 4.25% 2034',
      currency: 'USD',
      coupon: 4.25,
      maturity: '15.05.2034',
      rating: 'AAA',
      risk: 'Basso',
      price: 99.2,
      ytm: 4.36,
      duration: 8.1,
      badges: ['Core', 'Investment Grade']
    }, {
      id: 'b2',
      name: 'Nestlé Finance',
      ticker: 'XS2638',
      securityName: 'NESN 3.50% 2031',
      currency: 'EUR',
      coupon: 3.50,
      maturity: '12.09.2031',
      rating: 'AA',
      risk: 'Basso',
      price: 101.4,
      ytm: 3.28,
      duration: 6.2,
      badges: ['Investment Grade']
    }, {
      id: 'b3',
      name: 'Roche Holding',
      ticker: 'CH1198',
      securityName: 'ROG 1.95% 2029',
      currency: 'CHF',
      coupon: 1.95,
      maturity: '03.02.2029',
      rating: 'AA',
      risk: 'Basso',
      price: 98.0,
      ytm: 2.40,
      duration: 4.4,
      badges: ['Core']
    }, {
      id: 'b4',
      name: 'AT&T Inc',
      ticker: 'US00206R',
      securityName: 'T 5.40% 2034',
      currency: 'USD',
      coupon: 5.40,
      maturity: '15.02.2034',
      rating: 'BBB',
      risk: 'Medio',
      price: 100.6,
      ytm: 5.31,
      duration: 7.6,
      badges: ['Investment Grade']
    }, {
      id: 'b5',
      name: 'Telecom Italia',
      ticker: 'XS2284',
      securityName: 'TITIM 6.875% 2030',
      currency: 'EUR',
      coupon: 6.875,
      maturity: '15.07.2030',
      rating: 'BB',
      risk: 'Alto',
      price: 103.1,
      ytm: 6.10,
      duration: 4.0,
      badges: ['High Yield']
    }, {
      id: 'b6',
      name: 'Ford Motor Credit',
      ticker: 'US34539',
      securityName: 'F 6.95% 2028',
      currency: 'USD',
      coupon: 6.95,
      maturity: '06.03.2028',
      rating: 'BB',
      risk: 'Alto',
      price: 104.0,
      ytm: 5.85,
      duration: 3.1,
      badges: ['High Yield', 'Short Duration']
    }, {
      id: 'b7',
      name: 'Germany Bund',
      ticker: 'DE000BU',
      securityName: 'DBR 2.60% 2033',
      currency: 'EUR',
      coupon: 2.60,
      maturity: '15.08.2033',
      rating: 'AAA',
      risk: 'Basso',
      price: 100.1,
      ytm: 2.58,
      duration: 7.9,
      badges: ['Core', 'Investment Grade']
    }, {
      id: 'b8',
      name: 'Swiss Confederation',
      ticker: 'CH0224',
      securityName: 'SWISS 1.25% 2030',
      currency: 'CHF',
      coupon: 1.25,
      maturity: '28.06.2030',
      rating: 'AAA',
      risk: 'Basso',
      price: 99.0,
      ytm: 1.42,
      duration: 5.1,
      badges: ['Core']
    }, {
      id: 'b9',
      name: 'Apple Inc',
      ticker: 'US037833',
      securityName: 'AAPL 4.00% 2032',
      currency: 'USD',
      coupon: 4.00,
      maturity: '10.05.2032',
      rating: 'AA',
      risk: 'Basso',
      price: 98.6,
      ytm: 4.21,
      duration: 6.7,
      badges: ['Investment Grade']
    }, {
      id: 'b10',
      name: 'Enel Finance',
      ticker: 'XS2492',
      securityName: 'ENELIM 4.25% 2033',
      currency: 'EUR',
      coupon: 4.25,
      maturity: '14.06.2033',
      rating: 'BBB',
      risk: 'Medio',
      price: 99.4,
      ytm: 4.33,
      duration: 7.0,
      badges: ['Investment Grade']
    }, {
      id: 'b11',
      name: 'Deutsche Bank',
      ticker: 'DE000DB',
      securityName: 'DB 5.625% 2031',
      currency: 'EUR',
      coupon: 5.625,
      maturity: '16.05.2031',
      rating: 'BBB',
      risk: 'Medio',
      price: 102.2,
      ytm: 5.10,
      duration: 5.4,
      badges: ['Investment Grade']
    }, {
      id: 'b12',
      name: 'Petrobras',
      ticker: 'US71647N',
      securityName: 'PETBRA 6.50% 2033',
      currency: 'USD',
      coupon: 6.50,
      maturity: '07.07.2033',
      rating: 'BB',
      risk: 'Alto',
      price: 101.8,
      ytm: 6.24,
      duration: 6.6,
      badges: ['High Yield']
    }, {
      id: 'b13',
      name: 'Crédit Agricole',
      ticker: 'FR0014',
      securityName: 'ACAFP 3.75% 2029',
      currency: 'EUR',
      coupon: 3.75,
      maturity: '21.04.2029',
      rating: 'A',
      risk: 'Basso',
      price: 100.9,
      ytm: 3.55,
      duration: 4.3,
      badges: ['Investment Grade']
    }, {
      id: 'b14',
      name: 'AT&T (long)',
      ticker: 'US00206L',
      securityName: 'T 4.85% 2039',
      currency: 'USD',
      coupon: 4.85,
      maturity: '01.03.2039',
      rating: 'BBB',
      risk: 'Medio',
      price: 96.4,
      ytm: 5.20,
      duration: 11.2,
      badges: []
    }]
  };
  const FUNDS = {
    id: 'funds',
    title: 'Funds Selection',
    desc: 'Fondi ed ETF selezionati tramite analisi quantitativa e due diligence qualitativa.',
    searchPh: 'Cerca fondo, ISIN o categoria…',
    filters: [{
      key: 'category',
      label: 'Categoria',
      options: ['Tutte le categorie', 'Equity', 'Fixed Income', 'Multi-Asset', 'Alternative']
    }, {
      key: 'currency',
      label: 'Valuta',
      options: ['Tutte le valute', 'USD', 'EUR', 'CHF']
    }],
    chips: ['UCITS', 'Gold rated', 'Low TER', 'Core holding'],
    columns: [{
      key: 'name',
      label: 'Fondo / ISIN',
      group: 'Anagrafica',
      kind: 'identity',
      align: 'left'
    }, {
      key: 'sector',
      label: 'Categoria',
      group: 'Anagrafica',
      kind: 'sub',
      align: 'left'
    }, {
      key: 'nav',
      label: 'NAV',
      group: 'Performance',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2)
    }, {
      key: 'ytd',
      label: 'YTD',
      group: 'Performance',
      kind: 'change',
      align: 'right'
    }, {
      key: 'y3',
      label: '3Y p.a.',
      group: 'Performance',
      kind: 'change',
      align: 'right'
    }, {
      key: 'ter',
      label: 'TER',
      group: 'Costi & Dimensione',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : v.toFixed(2) + '%'
    }, {
      key: 'aum',
      label: 'AUM',
      group: 'Costi & Dimensione',
      kind: 'num',
      align: 'right',
      fmt: v => v == null ? '–' : '€' + v.toFixed(0) + 'M'
    }, {
      key: 'stars',
      label: 'Rating',
      group: 'Rating',
      kind: 'stars',
      align: 'left'
    }],
    groupTints: {
      Performance: 'burgundy',
      'Costi & Dimensione': 'gold',
      Rating: 'slate'
    },
    rows: [{
      id: 'f1',
      name: 'Zest Global Quality Equity',
      ticker: 'LU2071',
      sector: 'Equity',
      region: 'Global',
      nav: 184.21,
      ytd: 14.6,
      y3: 11.2,
      ter: 0.85,
      aum: 412,
      stars: 5,
      badges: ['UCITS', 'Gold rated', 'Core holding']
    }, {
      id: 'f2',
      name: 'Zest Euro Corporate Bond',
      ticker: 'LU2189',
      sector: 'Fixed Income',
      region: 'Europe',
      nav: 102.84,
      ytd: 4.1,
      y3: 1.8,
      ter: 0.55,
      aum: 268,
      stars: 4,
      badges: ['UCITS', 'Low TER']
    }, {
      id: 'f3',
      name: 'iShares Core MSCI World',
      ticker: 'IE00B4',
      sector: 'Equity',
      region: 'Global',
      nav: 96.40,
      ytd: 12.0,
      y3: 10.4,
      ter: 0.20,
      aum: 1820,
      stars: 5,
      badges: ['Low TER', 'Core holding']
    }, {
      id: 'f4',
      name: 'Zest Multi-Asset Balanced',
      ticker: 'LU2330',
      sector: 'Multi-Asset',
      region: 'Global',
      nav: 121.07,
      ytd: 6.8,
      y3: 5.1,
      ter: 0.95,
      aum: 156,
      stars: 4,
      badges: ['UCITS']
    }, {
      id: 'f5',
      name: 'Pictet Global Megatrend',
      ticker: 'LU0386',
      sector: 'Equity',
      region: 'Global',
      nav: 312.55,
      ytd: 9.4,
      y3: 7.6,
      ter: 1.10,
      aum: 540,
      stars: 3,
      badges: ['UCITS']
    }, {
      id: 'f6',
      name: 'Zest Absolute Return',
      ticker: 'LU2512',
      sector: 'Alternative',
      region: 'Global',
      nav: 108.92,
      ytd: 3.2,
      y3: 2.9,
      ter: 1.25,
      aum: 88,
      stars: 3,
      badges: ['UCITS']
    }, {
      id: 'f7',
      name: 'Vanguard S&P 500 ETF',
      ticker: 'IE00B3',
      sector: 'Equity',
      region: 'Nord America',
      nav: 102.30,
      ytd: 13.1,
      y3: 12.0,
      ter: 0.07,
      aum: 3850,
      stars: 5,
      badges: ['Low TER', 'Core holding']
    }, {
      id: 'f8',
      name: 'Zest Emerging Markets Eq',
      ticker: 'LU2604',
      sector: 'Equity',
      region: 'Emerging',
      nav: 88.74,
      ytd: 7.8,
      y3: 3.4,
      ter: 1.05,
      aum: 134,
      stars: 3,
      badges: ['UCITS']
    }, {
      id: 'f9',
      name: 'PIMCO Global Bond',
      ticker: 'IE00B8',
      sector: 'Fixed Income',
      region: 'Global',
      nav: 14.62,
      ytd: 3.6,
      y3: 0.9,
      ter: 0.50,
      aum: 920,
      stars: 4,
      badges: ['Low TER']
    }, {
      id: 'f10',
      name: 'Zest Technology Leaders',
      ticker: 'LU2711',
      sector: 'Equity',
      region: 'Global',
      nav: 248.10,
      ytd: 22.4,
      y3: 16.8,
      ter: 1.15,
      aum: 305,
      stars: 5,
      badges: ['UCITS', 'Gold rated']
    }, {
      id: 'f11',
      name: 'Amundi Euro Govt Bond',
      ticker: 'LU1287',
      sector: 'Fixed Income',
      region: 'Europe',
      nav: 110.45,
      ytd: 2.4,
      y3: -0.6,
      ter: 0.16,
      aum: 1240,
      stars: 3,
      badges: ['Low TER']
    }, {
      id: 'f12',
      name: 'Zest Sustainable Multi-Asset',
      ticker: 'LU2840',
      sector: 'Multi-Asset',
      region: 'Global',
      nav: 115.33,
      ytd: 7.1,
      y3: 4.6,
      ter: 0.90,
      aum: 178,
      stars: 4,
      badges: ['UCITS', 'Core holding']
    }, {
      id: 'f13',
      name: 'BlackRock World Healthscience',
      ticker: 'LU0122',
      sector: 'Equity',
      region: 'Global',
      nav: 38.90,
      ytd: 6.2,
      y3: 7.2,
      ter: 1.20,
      aum: 410,
      stars: 4,
      badges: ['UCITS']
    }, {
      id: 'f14',
      name: 'Zest Gold & Precious Metals',
      ticker: 'LU2933',
      sector: 'Alternative',
      region: 'Global',
      nav: 162.77,
      ytd: 17.0,
      y3: 9.4,
      ter: 1.30,
      aum: 96,
      stars: 3,
      badges: ['UCITS']
    }]
  };

  // ---- geography grouping for the equity recommendation list ----
  const REG2GEO = {
    'Nord America': 'US',
    'Europa': 'EU',
    'Svizzera': 'Switzerland'
  };
  EQUITY.rows.forEach(r => {
    r.geo = REG2GEO[r.region] || 'EU';
  });
  // a few names sit in "Preferred" — not yet recommended but on the watchlist
  ['ASML', 'SAP', 'NOVO', 'ADBE', 'ABBN'].forEach(id => {
    const r = EQUITY.rows.find(x => x.id === id);
    if (r) r.geo = 'Preferred';
  });
  EQUITY.groupBy = 'geo';
  EQUITY.groupOrder = ['US', 'EU', 'Switzerland', 'Preferred'];
  EQUITY.groupLabels = {
    US: 'United States',
    EU: 'Europe',
    Switzerland: 'Switzerland',
    Preferred: 'Preferred · Watchlist'
  };
  EQUITY.groupNote = {
    Preferred: 'Titoli non ancora consigliati ma sotto stretta osservazione.'
  };
  window.LZ_DATA = {
    equity: EQUITY,
    bond: BOND,
    funds: FUNDS
  };
  window.LZ_ASSET_ORDER = ['equity', 'bond', 'funds'];
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/list-template/data.js", error: String((e && e.message) || e) }); }

// uploads/LFA Design System/brochure/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "uploads/LFA Design System/brochure/ds-base.js", error: String((e && e.message) || e) }); }

// uploads/LFA Design System/investment-process/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["tokens/fonts.css", "tokens/colors.css", "tokens/typography.css", "tokens/spacing.css", "tokens/base.css", "styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "uploads/LFA Design System/investment-process/ds-base.js", error: String((e && e.message) || e) }); }

// uploads/LFA Design System/one-pager/ds-base.js
try { (() => {
// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
(() => {
  const base = '../..';
  for (const p of ["styles.css"]) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = base + '/' + p;
    document.head.appendChild(l);
  }
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — if this is a consuming project, point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page (e.g. _ds/<folder> at the project root, ../_ds/<folder> one level down); in a fresh design system this can just mean the bundle is not compiled yet');
  document.head.appendChild(s);
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "uploads/LFA Design System/one-pager/ds-base.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.PersonCard = __ds_scope.PersonCard;

__ds_ns.SectionTab = __ds_scope.SectionTab;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StepItem = __ds_scope.StepItem;

})();
