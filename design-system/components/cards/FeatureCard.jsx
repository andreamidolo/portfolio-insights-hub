import React from 'react';

/**
 * LFA FeatureCard — the caps-title + one-sentence block used across
 * "What Makes LFA Different" and "Why LFA" (optionally with a line icon).
 * Quiet by default: no heavy borders, lots of air.
 */
export function FeatureCard({ icon, title, children, align = 'left', boxed = false }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        gap: '12px',
        padding: boxed ? '28px' : 0,
        background: boxed ? 'var(--lfa-white)' : 'transparent',
        border: boxed ? '1px solid var(--lfa-line)' : 'none',
        borderRadius: boxed ? 'var(--radius-md)' : 0,
        boxShadow: boxed ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {icon && (
        <div
          style={{
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lfa-rose)',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--lfa-navy)',
          lineHeight: 1.4,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          font: 'var(--fw-regular) 15px/1.6 var(--font-sans)',
          color: 'var(--lfa-navy-500)',
          maxWidth: '34ch',
        }}
      >
        {children}
      </p>
    </div>
  );
}
