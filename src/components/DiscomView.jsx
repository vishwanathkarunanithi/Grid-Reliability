import React from 'react';
import { Server, Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const voltageData = [
  { time: '10:00', feederA: 235, feederB: 240, limit: 253 },
  { time: '11:00', feederA: 238, feederB: 242, limit: 253 },
  { time: '12:00', feederA: 245, feederB: 248, limit: 253 },
  { time: '13:00', feederA: 252, feederB: 250, limit: 253 }, // Near violation!
  { time: '14:00', feederA: 242, feederB: 245, limit: 253 },
];

export default function DiscomView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="stat-card glass" style={{ border: '1px solid rgba(255, 75, 75, 0.3)' }}>
          <div className="stat-icon"><AlertCircle color="#ff4b4b" /></div>
          <div className="stat-info">
            <h3>Feeder Stress Alerts</h3>
            <p style={{ color: '#ff4b4b' }}>1 Warning (Feeder A)</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Server color="#00d2ff" /></div>
          <div className="stat-info">
            <h3>Grid Frequency</h3>
            <p>49.95 Hz</p>
          </div>
        </div>
      </div>

      <div className="chart-card glass" style={{ flex: 1, minHeight: '400px' }}>
        <h3>Feeder Voltage Monitoring</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={voltageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#888" />
            <YAxis stroke="#888" domain={[220, 260]} />
            <Tooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px'}} />
            <Line type="monotone" dataKey="feederA" stroke="#ffc107" strokeWidth={3} name="Feeder A (V)" />
            <Line type="monotone" dataKey="feederB" stroke="#00d2ff" strokeWidth={3} name="Feeder B (V)" />
            <Line type="step" dataKey="limit" stroke="#ff4b4b" strokeDasharray="5 5" name="Upper Limit" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
