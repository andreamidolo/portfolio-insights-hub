import React from 'react';
import { Button } from '../core/Button.jsx';

/**
 * LFA NavBar — the sticky white top nav from lfa.ch: links flanking a
 * centered logo lockup, with an outlined rose "GET STARTED" pill at the right.
 */
export function NavBar({
  logoSrc = '../../assets/logo-lfa-full.png',
  leftLinks = ['About Us', 'What We Do', 'Who We Serve'],
  rightLinks = ['Why LFA', 'Resources'],
  cta = 'Get Started',
  active,
  onNavigate,
  onCta,
}) {
  const link = (label) => (
    <a
      key={label}
      href="#"
      onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(label); }}
      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lfa-rose)')}
      onMouseLeave={(e) => (e.currentTarget.style.color = active === label ? 'var(--lfa-rose)' : 'var(--lfa-navy)')}
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        fontWeight: 600,
        color: active === label ? 'var(--lfa-rose)' : 'var(--lfa-navy)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        transition: 'color var(--dur-base) var(--ease-out)',
      }}
    >
      {label}
    </a>
  );

  return (
    <nav
      style={{
        height: 'var(--nav-h)',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '32px',
        padding: '0 40px',
        background: 'var(--lfa-white)',
        borderBottom: '1px solid var(--lfa-line)',
      }}
    >
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        {leftLinks.map(link)}
      </div>
      <img src={logoSrc} alt="LFA" style={{ height: '58px', display: 'block', cursor: onNavigate ? 'pointer' : 'default' }} onClick={() => onNavigate && onNavigate('Home')} />
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'flex-end' }}>
        {rightLinks.map(link)}
        <Button variant="outline" size="sm" onClick={onCta}>{cta}</Button>
      </div>
    </nav>
  );
}
