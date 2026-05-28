import IntelligencePanel from './IntelligencePanel';

export default function Sidebar() {
  return (
    <div className="sidebar" style={{ padding: '1.5rem', height: '100%' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        Internet Backbone & IXP Intelligence
      </h1>
      <IntelligencePanel />
      <section style={{ marginTop: '2rem' }}>
        <h3>Why This Matters</h3>
        <p style={{ opacity: 0.8 }}>
          The internet’s physical layer is far more concentrated than it appears. 
          Behind every cloud service sits a few key IXPs where global traffic converges.
        </p>
      </section>
    </div>
  );
}
