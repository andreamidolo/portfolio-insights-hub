// Shared helpers for the LFA website UI kit.

// Lucide line-icon component (matches LFA's thin single-weight icon style).
function Icon({ name, size = 24, color, strokeWidth = 1.6, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = '';
    const el = document.createElement('i');
    el.setAttribute('data-lucide', name);
    ref.current.appendChild(el);
    window.lucide.createIcons({
      attrs: { width: size, height: size, 'stroke-width': strokeWidth },
    });
  }, [name, size, strokeWidth]);
  return (
    <span
      ref={ref}
      aria-hidden="true"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: color || 'currentColor', ...style }}
    />
  );
}

// Constrained content container.
function Container({ children, style }) {
  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 40px', ...style }}>
      {children}
    </div>
  );
}

window.Icon = Icon;
window.Container = Container;
