// LFA — About / Why LFA: castle hero, differentiators, values triad.
function About() {
  const { SectionHeading, FeatureCard, Eyebrow } = window.LFADesignSystem_f7f6ac;
  const { Icon, Container } = window;

  const diff = [
    { icon: 'landmark', title: 'SEC Registered', body: 'Authorized to provide advisory services to U.S. clients.' },
    { icon: 'shield-check', title: 'FINMA Regulated', body: 'Recognized as a regulated Swiss asset manager.' },
    { icon: 'network', title: 'Global Network', body: 'Connected to Swiss banks, international law firms, and estate-planning partners.' },
    { icon: 'handshake', title: 'Client-First Focus', body: 'Long-term relationships built on trust, discretion, and aligned financial goals.' },
  ];
  const values = [
    ['Accountability', 'We own our advice and our outcomes — transparently, and over the long term.'],
    ['Respect', 'High regard for personal privacy, confidentiality, and each client\u2019s unique goals.'],
    ['Courage', 'Prudence and care, with the conviction to act on long-term investment opportunities.'],
  ];

  return (
    <div>
      {/* Castle hero */}
      <section style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img src="../../assets/img-bellinzona-castle.png" alt="Bellinzona castle"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 80%)' }} />
        <Container style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: '48px', color: 'var(--lfa-navy)' }}>About Us</h1>
        </Container>
      </section>

      {/* Intro + lake image */}
      <section style={{ padding: '88px 0' }}>
        <Container style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
          <SectionHeading
            title="Swiss Wealth Management for U.S. Investors"
            lead="LFA is a fee-based Swiss wealth management firm focused on serving U.S. investors who want to expand part of their portfolio beyond U.S. markets and currency. We deliver custom investment strategies, global diversification options, and tax-aware planning designed to protect and grow wealth in an international context." />
          <img src="../../assets/img-swiss-alps-lake.png" alt="Swiss Alps and lake"
            style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }} />
        </Container>
      </section>

      {/* What makes LFA different */}
      <section style={{ background: 'var(--lfa-paper)', padding: '96px 0', borderTop: '1px solid var(--lfa-line)' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionHeading align="center"
              title="What Makes LFA Different From Other Wealth Management Firms?"
              lead="As an independent Swiss investment advisor with dual registration in the United States and Switzerland, LFA combines localized expertise with deep international insight." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '36px' }}>
            {diff.map((d) => (
              <FeatureCard key={d.title} align="center" icon={<Icon name={d.icon} size={34} />} title={d.title}>{d.body}</FeatureCard>
            ))}
          </div>
        </Container>
      </section>

      {/* Values triad */}
      <section style={{ padding: '96px 0' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Eyebrow>Our Values</Eyebrow>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {values.map(([t, body], i) => (
              <div key={t} style={{ textAlign: 'center', paddingTop: '28px', borderTop: '2px solid var(--lfa-rose)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '30px', color: 'var(--lfa-navy)', marginBottom: '14px' }}>{t}</div>
                <p style={{ margin: '0 auto', font: 'var(--fw-regular) 16px/1.62 var(--font-sans)', color: 'var(--lfa-navy-500)', maxWidth: '32ch' }}>{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
window.About = About;
