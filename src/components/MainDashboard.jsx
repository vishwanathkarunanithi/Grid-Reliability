import React, { useState, useEffect } from 'react';
import { Battery, Zap, Wind, Sun } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const demandData = [
  { time: '00:00', supply: 4000, demand: 2400 },
  { time: '04:00', supply: 3000, demand: 1398 },
  { time: '08:00', supply: 2000, demand: 5800 },
  { time: '12:00', supply: 8780, demand: 3908 },
  { time: '16:00', supply: 1890, demand: 4800 },
  { time: '20:00', supply: 2390, demand: 3800 },
  { time: '24:00', supply: 3490, demand: 4300 },
];

export default function MainDashboard() {
  const [batteryLevel, setBatteryLevel] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => (prev > 20 ? prev - 0.5 : 100));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon"><Sun color="#ffc107" /></div>
          <div className="stat-info">
            <h3>Solar Generation</h3>
            <p>4.2 MW</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Wind color="#00d2ff" /></div>
          <div className="stat-info">
            <h3>Wind Generation</h3>
            <p>1.8 MW</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Battery color="#00ff88" /></div>
          <div className="stat-info">
            <h3>Community Storage</h3>
            <p>{batteryLevel.toFixed(1)}%</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Zap color="#ff4b4b" /></div>
          <div className="stat-info">
            <h3>Current Demand</h3>
            <p>5.1 MW</p>
          </div>
        </div>
      </section>

      <section style={{ height: '400px' }}>
        <div className="chart-card glass" style={{ width: '100%', height: '100%' }}>
          <h3>Supply vs Demand Forecast (24h)</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demandData}>
                <defs>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4b4b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff4b4b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px'}} />
                <Area type="monotone" dataKey="supply" stroke="#00ff88" fillOpacity={1} fill="url(#colorSupply)" name="Renewable Supply" />
                <Area type="monotone" dataKey="demand" stroke="#ff4b4b" fillOpacity={1} fill="url(#colorDemand)" name="Community Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
