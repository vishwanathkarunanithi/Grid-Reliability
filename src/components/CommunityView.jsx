import React from 'react';
import { Users, ArrowRightLeft, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const p2pData = [
  { name: 'Self-Consumed', value: 45 },
  { name: 'Shared P2P', value: 35 },
  { name: 'Grid Export', value: 20 },
];
const COLORS = ['#00ff88', '#00d2ff', '#ffc107'];

export default function CommunityView() {
  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="stat-card glass">
          <div className="stat-icon"><Users color="#00ff88" /></div>
          <div className="stat-info">
            <h3>Active Prosumers</h3>
            <p>1,248 Homes</p>
          </div>
        </div>
        
        <div className="chart-card glass" style={{ flex: 1, minHeight: '300px' }}>
          <h3>Energy Distribution Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={p2pData}
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {p2pData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{backgroundColor: 'rgba(0,0,0,0.8)', border: 'none'}} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="control-panel glass" style={{ flex: 1 }}>
        <h3>Live P2P Transactions</h3>
        <div className="load-items">
          {[1,2,3,4,5].map(i => (
            <div className="load-item" key={i}>
              <div className="load-info">
                <span className="load-name">House {100 + i} <ArrowRightLeft size={12}/> House {200 + i}</span>
                <span className="load-desc">Transferring 2.5 kWh</span>
              </div>
              <span className="badge normal"><ShieldCheck size={12}/> Verified</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
