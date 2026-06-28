import React from 'react';
import { Eyebrow } from '../core/Eyebrow.jsx';

/**
 * LFA SectionHeading — eyebrow + italic-serif headline + optional lead.
 * The recurring section opener on lfa.ch (often centered).
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'navy',
  italic = true,
}) {
  const onDark = tone === 'white';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        textAlign: align,
        alignItems: align === 'center' ? 'center' : 'flex-start',
        maxWidth: align === 'center' ? '760px' : '640px',
        marginInline: align === 'center' ? 'auto' : 0,
      }}
    >
      {eyebrow && <Eyebrow tone={onDark ? 'white' : 'rose'}>{eyebrow}</Eyebrow>}
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-serif)',
          fontStyle: italic ? 'italic' : 'normal',
          fontWeight: 500,
          fontSize: 'clamp(28px, 4vw, 40px)',
          lineHeight: 1.18,
          letterSpacing: '-0.01em',
          color: onDark ? 'var(--lfa-white)' : 'var(--lfa-navy)',
          textWrap: 'balance',
        }}
      >
        {title}
      </h2>
      {lead && (
        <p
          style={{
            margin: 0,
            font: 'var(--fw-regular) 18px/1.6 var(--font-sans)',
            color: onDark ? 'rgba(255,255,255,0.86)' : 'var(--lfa-navy-500)',
            maxWidth: '60ch',
          }}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
