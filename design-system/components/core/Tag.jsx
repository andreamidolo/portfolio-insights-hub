import React from 'react';

/**
 * LFA Tag — small pill used for mandate exposures, currencies, risk levels
 * (e.g. "USD", "GLOBAL", "MODERATE"). Quiet by default; rose/navy when active.
 */
export function Tag({ children, tone = 'neutral', ...rest }) {
  const tones = {
    neutral: { background: 'var(--lfa-mist)', color: 'var(--lfa-navy)', border: '1px solid var(--lfa-line)' },
    navy:    { background: 'var(--lfa-navy)', color: 'var(--lfa-white)', border: '1px solid var(--lfa-navy)' },
    rose:    { background: 'var(--lfa-rose)', color: 'var(--lfa-white)', border: '1px solid var(--lfa-rose)' },
    outline: { background: 'transparent', color: 'var(--lfa-navy)', border: '1px solid var(--lfa-line-strong)' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '6px 12px',
        borderRadius: 'var(--radius-pill)',
        ...(tones[tone] || tones.neutral),
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
