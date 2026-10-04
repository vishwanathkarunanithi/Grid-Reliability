import React, { useState, useEffect } from 'react';
import { CloudRain, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForecastingView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/demand-forecast')
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
        <h2 style={{ margin: 0, color: '#fff' }}>AI Weather & Generation Forecasting</h2>
        <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Anticipate renewable-energy gaps using localized ML weather models.</p>
      </div>

      <div className="glass" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ color: '#00d2ff', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <TrendingUp /> 24-Hour Supply vs Demand Forecast
        </h3>
        
        <div style={{ flex: 1, minHeight: '300px' }}>
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eb3b5a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#eb3b5a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#8892b0" />
                <YAxis stroke="#8892b0" />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <Tooltip contentStyle={{ backgroundColor: '#0b0f19', border: '1px solid #00d2ff', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="supply" name="Renewable Supply (kW)" stroke="#00ff88" fillOpacity={1} fill="url(#colorSupply)" />
                <Area type="monotone" dataKey="demand" name="Grid Demand (kW)" stroke="#eb3b5a" fillOpacity={1} fill="url(#colorDemand)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#00d2ff' }}>Loading Forecast Models...</div>
          )}
        </div>
      </div>
    </div>
  );
}
