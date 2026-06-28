// LFA Home — hero, Swiss intro, facts & figures, Why-LFA grid.
function Home({ go }) {
  const { SectionHeading, Button, StatCard, FeatureCard, Eyebrow } = window.LFADesignSystem_f7f6ac;
  const { Icon, Container } = window;

  const reasons = [
    { icon: 'globe', title: 'International Asset Management', body: 'Access global markets through internationally diversified portfolios, managed from Switzerland.' },
    { icon: 'shield-check', title: 'Regulated Fiduciary Oversight', body: 'Registered with the U.S. SEC and regulated by FINMA in Switzerland — dual oversight.' },
    { icon: 'banknote', title: 'Exposure to a Stable Currency', body: 'Investments denominated in Swiss francs add currency diversification beyond the U.S. dollar.' },
    { icon: 'users', title: 'Independent, Client-Aligned Advice', body: 'A fee-based, open-architecture advisory firm — free from product or third-party influence.' },
    { icon: 'phone-call', title: 'High-Touch Relationship Service', body: 'A single point of contact, regular reporting, and direct access by video, phone, or in person.' },
    { icon: 'file-text', title: 'Transparent, Fee-Based Compensation', body: 'An asset-based fee structure aligned with long-term stewardship, not transactions.' },
  ];

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '560px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img src="../../assets/img-hero-zurich.png" alt="Zürich at golden hour"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,250,245,0.92) 0%, rgba(255,250,245,0.7) 38%, rgba(255,250,245,0.15) 70%, rgba(255,250,245,0) 100%)' }} />
        <Container style={{ position: 'relative' }}>
          <div style={{ maxWidth: '560px' }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(38px, 5vw, 60px)', lineHeight: 1.08, letterSpacing: '-0.01em', color: 'var(--lfa-navy)' }}>
              Your Swiss Guide to International Diversification
            </h1>
            <p style={{ marginTop: '24px', font: 'var(--fw-regular) 19px/1.6 var(--font-sans)', color: 'var(--lfa-navy-500)', maxWidth: '46ch' }}>
              For U.S. investors seeking global investment strategies beyond domestic markets, LFA offers Swiss-based wealth management tailored to your goals and risk profile.
            </p>
            <div style={{ marginTop: '32px' }}>
              <Button variant="link" iconRight="→" onClick={() => go('what')}>Get Started</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* SWISS INTRO */}
      <section style={{ padding: '96px 0' }}>
        <Container style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '64px', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="../../assets/illustration-swiss-flag.png" alt="Swiss flag" style={{ width: '78%', maxWidth: '300px' }} />
          </div>
          <div>
            <SectionHeading
              title="Swiss Wealth Management for U.S. Investors"
              lead="LFA is part of LFG Holding, one of Switzerland's leading firms of independent asset managers, with over 50 investment professionals, approximately 700 clients, and more than USD 2.5 billion in assets under management." />
            <p style={{ marginTop: '18px', font: 'var(--fw-regular) 17px/1.62 var(--font-sans)', color: 'var(--lfa-navy-500)', maxWidth: '56ch' }}>
              We work exclusively with U.S. investors, subject to U.S. tax reporting, and provide Swiss-based wealth management that is structured for cross-border requirements.
            </p>
          </div>
        </Container>
      </section>

      {/* FACTS & FIGURES */}
      <section style={{ background: 'var(--lfa-paper)', padding: '72px 0', borderTop: '1px solid var(--lfa-line)', borderBottom: '1px solid var(--lfa-line)' }}>
        <Container>
          <Eyebrow>Facts &amp; Figures</Eyebrow>
          <div style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            <StatCard value="2.5" suffix="bn" label="USD assets under management" />
            <StatCard value="700" label="Clients served" tone="rose" />
            <StatCard value="50" suffix="+" label="Investment professionals" />
            <StatCard value="2009" label="Founded · SEC-registered 2010" />
          </div>
        </Container>
      </section>

      {/* WHY LFA GRID */}
      <section style={{ padding: '96px 0' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionHeading align="center" eyebrow="Why LFA"
              title="Why investors partner with LFA"
              lead="Our structure, location, and investment philosophy are intentionally designed to support diversification, transparency, and long-term portfolio oversight." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 40px' }}>
            {reasons.map((r) => (
              <FeatureCard key={r.title} icon={<Icon name={r.icon} size={30} />} title={r.title}>{r.body}</FeatureCard>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
window.Home = Home;
