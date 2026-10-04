import React from 'react';
import { Battery, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const storageData = [
  { name: 'Sector 1 (Second-life)', capacity: 100, current: 85, health: 92 },
  { name: 'Sector 2 (Li-ion)', capacity: 250, current: 120, health: 98 },
  { name: 'Sector 3 (Flow)', capacity: 500, current: 410, health: 100 },
  { name: 'Sector 4 (Second-life)', capacity: 150, current: 40, health: 78 },
];

export default function StorageView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card glass">
          <div className="stat-icon"><Battery color="#00ff88" /></div>
          <div className="stat-info">
            <h3>Total Capacity</h3>
            <p>1.0 MWh</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Zap color="#00d2ff" /></div>
          <div className="stat-info">
            <h3>Current Charge</h3>
            <p>655 kWh</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Battery color="#ffc107" /></div>
          <div className="stat-info">
            <h3>Avg Battery Health</h3>
            <p>92%</p>
          </div>
        </div>
      </div>
      
      <div className="chart-card glass" style={{ flex: 1, minHeight: '400px' }}>
        <h3>Distributed Battery Clusters Status</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={storageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px'}} />
            <Legend />
            <Bar dataKey="capacity" fill="#2a2a2a" name="Total Capacity (kWh)" />
            <Bar dataKey="current" fill="#00ff88" name="Current Charge (kWh)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
