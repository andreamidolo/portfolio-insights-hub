import React from 'react';

/**
 * LFA RoseSection — the full-bleed dusty-rose editorial band (the "What We Do"
 * section). White text on rose, generous vertical padding, faint oversized
 * brand stamp watermark optional.
 */
export function RoseSection({ children, watermark = true, padding = 'var(--section-y)' }) {
  return (
    <section
      style={{
        position: 'relative',
        background: 'var(--lfa-rose-section)',
        color: 'var(--lfa-white)',
        padding: padding + ' 0',
        overflow: 'hidden',
      }}
    >
      {watermark && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-2%',
            bottom: '-30%',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '420px',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          LFA
        </div>
      )}
      <div
        style={{
          position: 'relative',
          maxWidth: 'var(--container)',
          margin: '0 auto',
          padding: '0 var(--gutter)',
        }}
      >
        {children}
      </div>
    </section>
  );
}
