import React from 'react';

/**
 * LFA Eyebrow — the letterspaced ALL-CAPS label above headings and on
 * feature titles (e.g. "WHAT WE DO", "SEC REGISTERED").
 */
export function Eyebrow({ children, tone = 'rose', as = 'div', ...rest }) {
  const color =
    tone === 'navy' ? 'var(--lfa-navy)' :
    tone === 'muted' ? 'var(--lfa-navy-300)' :
    tone === 'white' ? 'var(--lfa-white)' :
    'var(--lfa-rose)';
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: 'var(--fs-label)',
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        color,
        margin: 0,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
