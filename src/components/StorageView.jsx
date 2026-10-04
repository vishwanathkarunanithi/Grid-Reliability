import React, { useState, useEffect } from 'react';
import { Battery, Zap, Activity, Clock } from 'lucide-react';

export default function StorageView() {
  const [data, setData] = useState({
    capacity: '1.5 MWh',
    currentCharge: 85,
    status: 'Charging',
    dischargeRate: '0 kW',
    health: '98%',
    cycles: 124
  });

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/storage')
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
      <div className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff' }}>Distributed Storage Network</h2>
          <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Real-time telemetry from community second-life battery deployments.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid #00ff88', padding: '10px 20px', borderRadius: '8px', color: '#00ff88' }}>
            <strong>System Health: {data.health}</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div className="glass" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Battery size={64} color="#00ff88" />
          <h1 style={{ color: '#fff', fontSize: '3rem', margin: '10px 0' }}>{data.currentCharge}%</h1>
          <p style={{ color: '#00ff88', fontSize: '1.2rem', margin: 0 }}>State of Charge</p>
        </div>
        <div style={{ flex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="glass" style={{ padding: '20px' }}>
            <Zap size={24} color="#00d2ff" />
            <p style={{ color: '#ccc', margin: '10px 0 5px 0' }}>Total Capacity</p>
            <h2 style={{ color: '#fff', margin: 0 }}>{data.capacity}</h2>
          </div>
          <div className="glass" style={{ padding: '20px' }}>
            <Activity size={24} color="#eb3b5a" />
            <p style={{ color: '#ccc', margin: '10px 0 5px 0' }}>Discharge Rate</p>
            <h2 style={{ color: '#fff', margin: 0 }}>{data.dischargeRate}</h2>
          </div>
          <div className="glass" style={{ padding: '20px' }}>
            <Clock size={24} color="#f39c12" />
            <p style={{ color: '#ccc', margin: '10px 0 5px 0' }}>Total Cycles</p>
            <h2 style={{ color: '#fff', margin: 0 }}>{data.cycles} Cycles</h2>
          </div>
          <div className="glass" style={{ padding: '20px' }}>
            <Battery size={24} color="#00ff88" />
            <p style={{ color: '#ccc', margin: '10px 0 5px 0' }}>Operating Status</p>
            <h2 style={{ color: '#fff', margin: 0 }}>{data.status}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
