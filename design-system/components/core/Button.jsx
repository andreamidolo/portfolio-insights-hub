import React from 'react';

/**
 * LFA Button — the site's calm, restrained CTA.
 * Variants mirror lfa.ch: outlined rose pill ("GET STARTED"),
 * solid rose, solid navy, and a letterspaced underline link with arrow.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  iconRight,
  disabled = false,
  onClick,
  ...rest
}) {
  const pad = size === 'sm' ? '10px 20px' : size === 'lg' ? '17px 38px' : '14px 30px';
  const fs = size === 'sm' ? '12px' : '13px';

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    fontSize: fs,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), gap var(--dur-base) var(--ease-out)',
    textDecoration: 'none',
    opacity: disabled ? 0.45 : 1,
  };

  const variants = {
    primary: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--lfa-rose)',
      color: 'var(--lfa-white)',
    },
    outline: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'transparent',
      color: 'var(--lfa-rose)',
      borderColor: 'var(--lfa-rose)',
    },
    navy: {
      ...base,
      padding: pad,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--lfa-navy)',
      color: 'var(--lfa-white)',
    },
    link: {
      ...base,
      padding: '0 0 6px',
      borderRadius: 0,
      background: 'transparent',
      color: 'var(--lfa-rose)',
      borderBottom: '1px solid var(--lfa-rose)',
    },
  };

  const hover = (e, on) => {
    if (disabled) return;
    const s = e.currentTarget.style;
    if (variant === 'primary')      s.background = on ? 'var(--lfa-rose-deep)' : 'var(--lfa-rose)';
    else if (variant === 'navy')    s.background = on ? 'var(--lfa-navy-deep)' : 'var(--lfa-navy)';
    else if (variant === 'outline') { s.background = on ? 'var(--lfa-rose)' : 'transparent'; s.color = on ? 'var(--lfa-white)' : 'var(--lfa-rose)'; }
    else if (variant === 'link')    { s.color = on ? 'var(--lfa-rose-deep)' : 'var(--lfa-rose)'; s.gap = on ? '14px' : '10px'; }
  };

  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      onClick={disabled ? undefined : onClick}
      style={variants[variant] || variants.primary}
      onMouseEnter={(e) => hover(e, true)}
      onMouseLeave={(e) => hover(e, false)}
      {...rest}
    >
      {children}
      {iconRight && <span aria-hidden="true" style={{ fontSize: '1.1em', lineHeight: 0 }}>{iconRight}</span>}
    </Tag>
  );
}
