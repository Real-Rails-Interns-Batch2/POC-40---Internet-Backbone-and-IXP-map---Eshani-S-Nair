import IntelligencePanel from './IntelligencePanel';

export default function Sidebar() {
  return (
    <div className="sidebar" style={{ padding: '1.5rem', height: '100%', borderLeft: '1px solid rgba(56, 189, 248, 0.2)', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#38BDF8' }}>
        Internet Backbone & IXP Intelligence
      </h1>
      
      <IntelligencePanel />

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#38BDF8', fontSize: '1rem' }}>Why This Matters</h3>
        <p style={{ opacity: 0.8 }}>
          The internet’s physical layer is far more concentrated than it appears. 
          Behind every cloud service sits a few key IXPs where global traffic converges.
        </p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#38BDF8', fontSize: '1rem' }}>Who Controls the Rail</h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Select an entity on the map to see ownership details.</p>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#38BDF8', fontSize: '1rem' }}>Filters</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38BDF8', color: '#38BDF8', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>Cables</button>
          <button style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38BDF8', color: '#38BDF8', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>IXPs</button>
        </div>
      </section>

      <section style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
        <h2 style={{ color: '#38BDF8', fontSize: '1rem' }}>Download & Sample Data</h2>
        <button style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem', backgroundColor: '#38BDF8', color: '#030712', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Export Dataset (CSV)</button>
      </section>
    </div>
  );
}
