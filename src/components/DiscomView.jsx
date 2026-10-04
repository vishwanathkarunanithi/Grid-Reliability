import React, { useState, useEffect } from 'react';
import { Server, AlertTriangle, Activity } from 'lucide-react';

export default function DiscomView() {
  const [data, setData] = useState({
    feederA: { stress: 92, voltage: '235V (Warning)' },
    feederB: { stress: 45, voltage: '240V (Stable)' },
    violations: 2
  });

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/discom')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.log('Using fallback mock data'));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>DISCOM & Feeder Analytics</h2>
        <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Live diagnostic data for utility operators.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
        <div className="glass" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#00d2ff', display: 'flex', alignItems: 'center', gap: '10px' }}><Server /> Feeder A (Critical)</h3>
            {data.feederA.stress > 90 && <span style={{ background: '#eb3b5a', padding: '5px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>HIGH STRESS</span>}
          </div>
          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#ccc', marginBottom: '5px' }}>Current Stress Level: {data.feederA.stress}%</p>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${data.feederA.stress}%`, height: '100%', background: data.feederA.stress > 90 ? '#eb3b5a' : '#00ff88' }}></div>
            </div>
          </div>
          <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#ccc' }}>Voltage Status: <strong style={{ color: data.feederA.stress > 90 ? '#eb3b5a' : '#fff' }}>{data.feederA.voltage}</strong></p>
          </div>
        </div>

        <div className="glass" style={{ padding: '25px' }}>
          <h3 style={{ color: '#00ff88', display: 'flex', alignItems: 'center', gap: '10px' }}><Server /> Feeder B (Stable)</h3>
          <div style={{ marginTop: '30px' }}>
            <p style={{ color: '#ccc', marginBottom: '5px' }}>Current Stress Level: {data.feederB.stress}%</p>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${data.feederB.stress}%`, height: '100%', background: '#00ff88' }}></div>
            </div>
          </div>
          <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#ccc' }}>Voltage Status: <strong style={{ color: '#00ff88' }}>{data.feederB.voltage}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
