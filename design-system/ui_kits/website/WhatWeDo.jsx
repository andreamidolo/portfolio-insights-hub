// LFA — What We Do: rose intro band + services selector with detail panel.
function WhatWeDo({ go }) {
  const { RoseSection, SectionHeading, MandateTabs, Button } = window.LFADesignSystem_f7f6ac;
  const { Container } = window;
  const [tab, setTab] = React.useState('Investment Management');

  const services = {
    'Investment Management': [
      ['Portfolio Management Options', 'You choose how involved you want to be — hand off day-to-day decisions on a discretionary basis, or stay closely involved and approve every move.'],
      ['Personalized Investment Advice', 'Your portfolio is built around your situation — not a model — starting from a personalized investment policy statement.'],
      ['Sustainable Investment Strategies', 'Where it matters to you, LFA can incorporate sustainable and socially responsible investments into part or all of your portfolio.'],
      ['Swiss & European Exposure', 'Gain exposure to Swiss and European investments that broaden diversification beyond U.S. markets and the U.S. dollar.'],
      ['U.S. Tax Reporting Support', 'Clear, U.S.-compliant tax reporting so your global investments integrate smoothly with your annual filings.'],
    ],
    'International Wealth Planning': [
      ['Cross-Border Structuring', 'Wealth planning designed around U.S. reporting requirements and your international footprint.'],
      ['Coordination With Your Advisors', 'We work alongside your U.S. advisor for a consolidated, no-overlaps global strategy.'],
    ],
    'Alternative Investments': [
      ['Beyond Public Markets', 'Selective access to alternative assets that broaden diversification and complement core holdings.'],
    ],
    'Family Office Services': [
      ['Holistic Oversight', 'Coordinated stewardship across banking, legal, and estate-planning partners.'],
    ],
    'Sports Division': [
      ['Specialist Advisory', 'Dedicated guidance for professional athletes and the advisors around them.'],
    ],
    'Self-Directed IRAs': [
      ['Swiss Management, U.S. Framework', 'Swiss-based portfolio management within a U.S.-compliant IRA structure.'],
    ],
  };

  return (
    <div>
      {/* Photo banner */}
      <section style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <img src="../../assets/img-market-analyst.png" alt="Analyst reviewing markets"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0) 75%)' }} />
        <Container style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '48px', color: 'var(--lfa-navy)' }}>What We Do</h1>
        </Container>
      </section>

      {/* Rose intro */}
      <RoseSection padding="80px">
        <SectionHeading tone="white"
          title="How can U.S. investors diversify beyond U.S. markets while staying consistent with U.S. tax and regulatory rules?"
          lead="That question sits at the center of what LFA does. We work primarily with U.S. investors who want to expand internationally without adding unnecessary complexity." />
        <p style={{ marginTop: '20px', maxWidth: '70ch', color: 'rgba(255,255,255,0.9)', font: 'var(--fw-regular) 16px/1.62 var(--font-sans)' }}>
          Through Swiss-based investment management, global portfolio construction, and coordination with trusted international partners, LFA offers exposure to diversified strategies designed for U.S. citizens living in the U.S. or abroad.
        </p>
      </RoseSection>

      {/* Services selector */}
      <section style={{ padding: '88px 0' }}>
        <Container style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '56px', alignItems: 'start' }}>
          <MandateTabs items={Object.keys(services)} value={tab} onChange={setTab} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {services[tab].map(([t, body]) => (
              <div key={t} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '14px', alignItems: 'start' }}>
                <span style={{ color: 'var(--lfa-rose)', fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>+</span>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lfa-navy)' }}>{t}</h4>
                  <p style={{ margin: 0, font: 'var(--fw-regular) 16px/1.62 var(--font-sans)', color: 'var(--lfa-navy-500)', maxWidth: '62ch' }}>{body}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '12px' }}>
              <Button variant="primary" onClick={() => go('why')}>See why LFA</Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
window.WhatWeDo = WhatWeDo;
