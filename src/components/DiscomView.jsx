import React, { useState, useEffect } from 'react';
import { Server, Activity, AlertTriangle, Zap, CheckCircle, Navigation, TrendingUp, Settings2 } from 'lucide-react';

export default function DiscomView() {
  const [data, setData] = useState({
    feederA: { stress: 45, voltage: '240V' },
    feederB: { stress: 30, voltage: '240V' },
    violations: 0
  });
  
  const [freqData, setFreqData] = useState(50.00);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/discom')
        .then(res => res.json())
        .then(d => {
          setData(d);
          setFreqData(+(50 + (Math.random() * 0.1 - 0.05)).toFixed(2));
        })
        .catch(err => console.log('Using fallback mock data'));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Grid Compliance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #00ff88' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16}/> Grid Frequency</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>{freqData} <span style={{ fontSize: '1rem', color: '#888' }}>Hz</span></h2>
          <span style={{ color: '#00ff88', fontSize: '0.85rem' }}>Within 49.9 - 50.1 Hz limit</span>
        </div>
        
        <div className="glass" style={{ padding: '20px', borderLeft: data.feederA.stress > 80 ? '4px solid #eb3b5a' : '4px solid #00d2ff' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16}/> Feeder A Load</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>{data.feederA.stress}%</h2>
          <span style={{ color: data.feederA.stress > 80 ? '#eb3b5a' : '#00d2ff', fontSize: '0.85rem' }}>
            {data.feederA.stress > 80 ? 'Approaching capacity limit' : 'Nominal operation'}
          </span>
        </div>

        <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #00d2ff' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={16}/> Feeder B Load</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>{data.feederB.stress}%</h2>
          <span style={{ color: '#00d2ff', fontSize: '0.85rem' }}>Nominal operation</span>
        </div>

        <div className="glass" style={{ padding: '20px', borderLeft: data.violations > 0 ? '4px solid #eb3b5a' : '4px solid #00ff88' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16}/> Grid Violations</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '2rem' }}>{data.violations}</h2>
          <span style={{ color: data.violations > 0 ? '#eb3b5a' : '#00ff88', fontSize: '0.85rem' }}>
            {data.violations > 0 ? 'Immediate action required' : 'Full compliance maintained'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: '350px' }}>
        
        {/* Node Telemetry Table */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Server size={20}/> Substation Telemetry</h3>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#888' }}>
                <th style={{ padding: '10px 5px' }}>Parameter</th>
                <th style={{ padding: '10px 5px' }}>Feeder A</th>
                <th style={{ padding: '10px 5px' }}>Feeder B</th>
                <th style={{ padding: '10px 5px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 5px', color: '#ccc' }}>Voltage (RMS)</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{data.feederA.voltage}</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{data.feederB.voltage}</td>
                <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 5px', color: '#ccc' }}>Active Power (kW)</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederA.stress * 4.5)}</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederB.stress * 4.5)}</td>
                <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 5px', color: '#ccc' }}>Reactive Power (kVAR)</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederA.stress * 0.8)}</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederB.stress * 0.8)}</td>
                <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 5px', color: '#ccc' }}>Power Factor</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>0.98</td>
                <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>0.99</td>
                <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grid Interconnection Control */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#ffc107', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings2 size={20}/> Islanding & Sync Controls</h3>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '20px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Main Grid Connection</h4>
                <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>Microgrid is synchronized and connected to national grid.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00ff88', fontWeight: 'bold' }}>
                <Navigation size={20}/> SYNCED
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
              <button className="action-btn" style={{ flex: 1, background: 'rgba(235, 59, 90, 0.1)', color: '#eb3b5a', border: '1px solid #eb3b5a' }}>
                Initiate Island Mode
              </button>
              <button className="action-btn" style={{ flex: 1, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid #00d2ff' }}>
                Re-sync to Grid
              </button>
            </div>
            
            <div style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#ccc', fontSize: '0.9rem' }}><TrendingUp size={14} style={{ marginRight: '5px' }}/> Auto-Islanding Thresholds</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#888' }}>Under-Voltage: &lt; 207V</span>
                <span style={{ color: '#888' }}>Over-Voltage: &gt; 253V</span>
                <span style={{ color: '#888' }}>Frequency: &lt; 49.5Hz</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
