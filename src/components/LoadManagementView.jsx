import React, { useState, useEffect } from 'react';
import { Cpu, Power, ShieldCheck, ThermometerSnowflake } from 'lucide-react';

export default function LoadManagementView() {
  const [data, setData] = useState({
    sheddingActive: false,
    criticalLoad: '1.2 MW',
    flexibleLoad: '800 kW'
  });

  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    fetch('/api/load')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setToggled(d.sheddingActive);
      })
      .catch(err => console.log('Using fallback mock data'));
  }, []);

  const handleToggle = () => {
    setToggled(!toggled);
    // In a real app this would POST to the backend
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>Smart Load Management</h2>
        <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Prioritize critical infrastructure and shift flexible loads automatically.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass" style={{ padding: '25px', border: toggled ? '1px solid #00ff88' : '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><ThermometerSnowflake color="#00d2ff"/> Demand Response Protocol</h3>
            <button 
              onClick={handleToggle}
              style={{ background: toggled ? '#00ff88' : 'rgba(255,255,255,0.1)', border: 'none', padding: '10px 20px', borderRadius: '20px', color: toggled ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {toggled ? 'ACTIVE' : 'STANDBY'}
            </button>
          </div>
          <p style={{ color: '#ccc' }}>When active, non-critical loads (like residential HVAC units) will be temporarily modulated to prevent feeder overload.</p>
        </div>

        <div className="glass" style={{ padding: '25px' }}>
          <h3 style={{ color: '#eb3b5a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck /> Protected Critical Loads</h3>
          <h1 style={{ color: '#fff', margin: 0 }}>{data.criticalLoad}</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Hospital, Water Treatment, Emergency Services</p>
        </div>

        <div className="glass" style={{ padding: '25px' }}>
          <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Power /> Shiftable Flexible Loads</h3>
          <h1 style={{ color: '#fff', margin: 0 }}>{data.flexibleLoad}</h1>
          <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Residential EV Chargers, HVAC, Water Heaters</p>
        </div>
      </div>
    </div>
  );
}
