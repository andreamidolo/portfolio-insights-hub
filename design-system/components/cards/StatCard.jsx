import React from 'react';

/**
 * LFA StatCard — the serif "facts & figures" figure used in the brochure
 * (AUM, clients, year established). Big italic-serif value, caps label.
 */
export function StatCard({ value, label, suffix, tone = 'navy', align = 'left' }) {
  const color = tone === 'rose' ? 'var(--lfa-rose)' : tone === 'white' ? 'var(--lfa-white)' : 'var(--lfa-navy)';
  const labelColor = tone === 'white' ? 'rgba(255,255,255,0.72)' : 'var(--lfa-navy-500)';
  return (
    <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 600,
          fontSize: '52px',
          lineHeight: 1,
          letterSpacing: '-0.01em',
          color,
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
        }}
      >
        {value}
        {suffix && <span style={{ fontSize: '26px', fontStyle: 'italic' }}>{suffix}</span>}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: labelColor,
          maxWidth: '22ch',
          margin: align === 'center' ? '0 auto' : 0,
        }}
      >
        {label}
      </div>
    </div>
  );
}
