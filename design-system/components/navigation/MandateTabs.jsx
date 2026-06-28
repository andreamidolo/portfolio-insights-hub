import React from 'react';

/**
 * LFA MandateTabs — the vertical left-rail selector from the Services page.
 * Active item = solid navy fill + white text; the next = pale steel; the
 * rest = faint grey. Controlled or uncontrolled.
 */
export function MandateTabs({ items, value, defaultValue, onChange }) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]);
  const active = value ?? internal;

  const select = (item) => {
    if (value === undefined) setInternal(item);
    onChange && onChange(item);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '260px' }}>
      {items.map((item, i) => {
        const isActive = item === active;
        const activeIndex = items.indexOf(active);
        const isNext = i === activeIndex + 1;
        const bg = isActive ? 'var(--lfa-navy)' : isNext ? 'var(--lfa-tint-blue)' : 'var(--lfa-paper)';
        const color = isActive ? 'var(--lfa-white)' : isNext ? 'var(--lfa-navy-500)' : 'var(--lfa-navy-500)';
        return (
          <button
            key={item}
            onClick={() => select(item)}
            style={{
              textAlign: 'center',
              padding: '18px 16px',
              border: '1px solid ' + (isActive ? 'var(--lfa-navy)' : 'var(--lfa-line)'),
              borderRadius: 'var(--radius-sm)',
              background: bg,
              color,
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
            }}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
