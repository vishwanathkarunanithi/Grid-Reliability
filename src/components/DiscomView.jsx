import React, { useState, useEffect } from 'react';
import { Server, Activity, AlertTriangle, Zap, CheckCircle, Navigation, TrendingUp, Settings2, BarChart3, Radio } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function DiscomView() {
  const [data, setData] = useState({
    feederA: { stress: 45, voltage: '240V', thd: '2.1%' },
    feederB: { stress: 30, voltage: '240V', thd: '1.8%' },
    violations: 0
  });
  
  const [freqData, setFreqData] = useState(50.00);
  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/discom')
        .then(res => res.json())
        .then(d => {
          setData(prev => ({ ...prev, ...d, feederA: { ...prev.feederA, ...d.feederA, thd: (Math.random()*1+1).toFixed(1)+'%' }, feederB: { ...prev.feederB, ...d.feederB, thd: (Math.random()*1+1).toFixed(1)+'%' } }));
          setFreqData(+(50 + (Math.random() * 0.1 - 0.05)).toFixed(2));
        })
        .catch(err => console.log('Using fallback mock data'));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerAction = (actionName) => {
    setModalConfig({
      title: `Confirm ${actionName}`,
      message: `Initiating ${actionName} will alter the physical connection state to the national grid. Proceed?`,
      action: () => console.log(`${actionName} executed`)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Grid Compliance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
        <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #00ff88' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Activity size={14}/> Grid Frequency</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{freqData} <span style={{ fontSize: '0.9rem', color: '#888' }}>Hz</span></h2>
        </div>
        
        <div className="glass" style={{ padding: '20px', borderLeft: data.feederA.stress > 80 ? '4px solid #eb3b5a' : '4px solid #00d2ff' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Zap size={14}/> Feeder A Load</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{data.feederA.stress}%</h2>
        </div>

        <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #00d2ff' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Zap size={14}/> Feeder B Load</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{data.feederB.stress}%</h2>
        </div>

        <div className="glass" style={{ padding: '20px', borderLeft: data.violations > 0 ? '4px solid #eb3b5a' : '4px solid #00ff88' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={14}/> Grid Violations</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>{data.violations}</h2>
        </div>

        <div className="glass" style={{ padding: '20px', borderLeft: '4px solid #ffc107' }}>
          <p style={{ margin: '0 0 5px 0', color: '#ccc', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}><Radio size={14}/> Power Quality</p>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.8rem' }}>99.8%</h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1 }}>
        
        {/* Node Telemetry Table */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Server size={20}/> Substation Telemetry</h3>
          
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '15px' }}>
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
                  <td style={{ padding: '15px 5px', color: '#ccc' }}>Active Power</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederA.stress * 4.5)} kW</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederB.stress * 4.5)} kW</td>
                  <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 5px', color: '#ccc' }}>Reactive Power</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederA.stress * 0.8)} kVAR</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>{Math.round(data.feederB.stress * 0.8)} kVAR</td>
                  <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 5px', color: '#ccc' }}>Power Factor</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>0.98</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold' }}>0.99</td>
                  <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 5px', color: '#ccc' }}>THD (Harmonics)</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold', color: '#ffc107' }}>{data.feederA.thd}</td>
                  <td style={{ padding: '15px 5px', fontWeight: 'bold', color: '#ffc107' }}>{data.feederB.thd}</td>
                  <td style={{ padding: '15px 5px' }}><CheckCircle size={18} color="#00ff88"/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stability Graph Placeholder */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 size={20}/> Phase Stability Matrix</h3>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '2px dashed #00d2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', width: '2px', height: '100%', background: 'rgba(0, 210, 255, 0.2)' }} />
                <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(0, 210, 255, 0.2)' }} />
                <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%', position: 'absolute', top: '40%', left: '55%', boxShadow: '0 0 10px #00ff88' }} />
                <div style={{ width: '8px', height: '8px', background: '#eb3b5a', borderRadius: '50%', position: 'absolute', top: '30%', left: '70%', boxShadow: '0 0 10px #eb3b5a' }} />
              </div>
              <p style={{ color: '#888', marginTop: '20px', fontSize: '0.9rem' }}>Phasor Measurement Unit (PMU) Data</p>
            </div>
          </div>

          {/* Grid Interconnection Control */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings2 size={20}/> Islanding & Sync Controls</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ padding: '20px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>Main Grid Connection</h4>
                  <p style={{ margin: 0, color: '#ccc', fontSize: '0.9rem' }}>Microgrid is synchronized.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00ff88', fontWeight: 'bold' }}>
                  <Navigation size={20}/> SYNCED
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  className="action-btn" onClick={() => triggerAction('Initiate Island Mode')} title="Disconnect from main grid and operate independently."
                  style={{ flex: 1, background: 'rgba(235, 59, 90, 0.1)', color: '#eb3b5a', border: '1px solid #eb3b5a' }}
                >
                  Initiate Island Mode
                </button>
                <button 
                  className="action-btn" onClick={() => triggerAction('Re-sync to Grid')} title="Synchronize phase/frequency and reconnect to main grid."
                  style={{ flex: 1, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid #00d2ff' }}
                >
                  Re-sync to Grid
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal 
        isOpen={!!modalConfig}
        title={modalConfig?.title}
        message={modalConfig?.message}
        onConfirm={() => {
          if (modalConfig?.action) modalConfig.action();
          setModalConfig(null);
        }}
        onCancel={() => setModalConfig(null)}
      />
    </div>
  );
}
