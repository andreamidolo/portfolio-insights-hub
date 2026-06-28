// LFA website — navy footer with the three Swiss offices.
function Footer() {
  const offices = [
    { city: 'ZURICH', lines: ['Talstrasse 65', '8001 Zurich, Switzerland', 'T. +41 43 497 22 83'] },
    { city: 'LUGANO', lines: ['Via F. Pelli 3', '6900 Lugano, Switzerland', 'T. +41 91 921 37 52'] },
    { city: 'SION', lines: ['25 Rue de Lausanne', '1950 Sion, Switzerland', 'T. +41 79 208 0284'] },
  ];
  return (
    <footer style={{ background: 'var(--lfa-navy-deep)', color: 'rgba(255,255,255,0.82)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '64px 40px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '34px', color: '#fff', lineHeight: 1 }}>LFA</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: '10px', color: 'rgba(255,255,255,0.6)' }}>
              Swiss Wealth Management<br />for US Clients
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '20px', maxWidth: '30ch', color: 'rgba(255,255,255,0.6)' }}>
              SEC-registered investment adviser · FINMA-licensed portfolio manager. Part of LFG Holding.
            </p>
          </div>
          {offices.map((o) => (
            <div key={o.city}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.14em', color: '#fff', marginBottom: '14px' }}>{o.city}</div>
              {o.lines.map((l, i) => (
                <div key={i} style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.14)', marginTop: '48px', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
          <span>© 2026 LFA — Lugano Financial Advisors SA. Private &amp; confidential.</span>
          <span>info@lfa.ch · www.lfa.ch</span>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;
