import React, { useState, useEffect } from 'react';
import { Battery, Zap, Activity, Clock, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, AlertCircle, TrendingDown, Settings2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function StorageView() {
  const [data, setData] = useState({
    capacity: '1.5 MWh',
    currentCharge: 85,
    status: 'Discharging',
    dischargeRate: '250 kW',
    health: '98%',
    cycles: 124,
    temp: 42,
    voltage: '480V',
    efficiency: '96.5%'
  });
  
  const [history, setHistory] = useState([]);
  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/storage')
        .then(res => res.json())
        .then(d => {
          setData(prev => ({ ...prev, ...d, temp: +(42 + Math.random()*2-1).toFixed(1) }));
          setHistory(prev => {
            const newPoint = { time: new Date().toLocaleTimeString(), level: d.currentCharge, rate: parseInt(d.dischargeRate) };
            return [newPoint, ...prev].slice(0, 5);
          });
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
      message: `Are you sure you want to initiate ${actionName}? This will override the autonomous AI control for the storage array.`,
      highlightArea: 'storage-status',
      action: () => setData(prev => ({ ...prev, status: actionName }))
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '15px', borderRadius: '50%' }}><Battery color="#00ff88"/></div>
          <div><p style={{ margin: 0, color: '#ccc', fontSize: '0.8rem' }}>State of Charge</p><h2 style={{ margin: 0, color: '#fff' }}>{data.currentCharge}%</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%' }}><Activity color="#00d2ff"/></div>
          <div><p style={{ margin: 0, color: '#ccc', fontSize: '0.8rem' }}>Active Rate</p><h2 style={{ margin: 0, color: '#fff' }}>{data.dischargeRate}</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}><ShieldCheck color="#ffc107"/></div>
          <div><p style={{ margin: 0, color: '#ccc', fontSize: '0.8rem' }}>Battery SOH</p><h2 style={{ margin: 0, color: '#fff' }}>{data.health}</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(235, 59, 90, 0.2)', padding: '15px', borderRadius: '50%' }}><RefreshCw color="#eb3b5a"/></div>
          <div><p style={{ margin: 0, color: '#ccc', fontSize: '0.8rem' }}>Charge Cycles</p><h2 style={{ margin: 0, color: '#fff' }}>{data.cycles}</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(170, 170, 170, 0.2)', padding: '15px', borderRadius: '50%' }}><Zap color="#aaa"/></div>
          <div><p style={{ margin: 0, color: '#ccc', fontSize: '0.8rem' }}>DC Voltage</p><h2 style={{ margin: 0, color: '#fff' }}>{data.voltage}</h2></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1 }}>
        
        {/* Left Column: Controls & Deep Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Control Panel */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#00ff88', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={20}/> Storage Array Control</h3>
              <span id="storage-status" style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Status: {data.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#ccc', margin: '0 0 15px 0' }}>Capacity Overview</h4>
                <div style={{ width: '100%', height: '20px', background: '#333', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                  <div style={{ width: `${data.currentCharge}%`, height: '100%', background: 'linear-gradient(90deg, #00d2ff, #00ff88)', transition: 'width 0.5s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9rem' }}>
                  <span>0 MWh</span>
                  <span>{data.capacity} Total</span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#ccc', margin: '0 0 15px 0' }}>Thermal Management</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Core Temp</span>
                      <strong style={{ color: '#ffc107' }}>{data.temp}°C</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
                      <div style={{ width: `${(data.temp/80)*100}%`, height: '100%', background: '#ffc107', borderRadius: '4px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Cooling Sys</span>
                      <strong style={{ color: '#00d2ff' }}>Active</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
                      <div style={{ width: '100%', height: '100%', background: '#00d2ff', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button 
                className="action-btn" onClick={() => triggerAction('Force Discharge')} title="Manually override AI to force battery discharge into the grid."
                style={{ flex: 1, background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid #00ff88' }}
              >
                Force Discharge
              </button>
              <button 
                className="action-btn" onClick={() => triggerAction('Force Charge')} title="Manually override AI to force battery charging from grid."
                style={{ flex: 1, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid #00d2ff' }}
              >
                Force Charge
              </button>
              <button 
                className="action-btn" onClick={() => triggerAction('Emergency Stop')} title="Immediately halt all charge/discharge operations."
                style={{ flex: 1, background: 'rgba(235, 59, 90, 0.1)', color: '#eb3b5a', border: '1px solid #eb3b5a' }}
              >
                Emergency Stop
              </button>
            </div>
          </div>

          {/* Degradation Metrics */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingDown size={20}/> Degradation & Efficiency Analysis</h3>
            <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>Round Trip Efficiency</span>
                <strong style={{ fontSize: '2.5rem', color: '#00ff88' }}>{data.efficiency}</strong>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>Est. Lifespan Remaining</span>
                <strong style={{ fontSize: '2.5rem', color: '#00d2ff' }}>8.2 Yrs</strong>
              </div>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>Depth of Discharge (Avg)</span>
                <strong style={{ fontSize: '2.5rem', color: '#ffc107' }}>45%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Logs and Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Log / Recent History */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20}/> Telemetry Log</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.length === 0 ? <p style={{ color: '#888' }}>Waiting for telemetry...</p> : null}
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{h.time}</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{h.level}%</span>
                  <span style={{ color: h.rate > 0 ? '#00d2ff' : '#eb3b5a', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {h.rate > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>} {Math.abs(h.rate)} kW
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BMS Settings */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#ccc', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings2 size={20}/> BMS Constraints</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}><span>Max SOC Limit</span><strong style={{ color: '#fff' }}>95%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}><span>Min SOC Limit</span><strong style={{ color: '#fff' }}>15%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}><span>Charge Current Limit</span><strong style={{ color: '#fff' }}>1200 A</strong></div>
              <button 
                className="action-btn" onClick={() => triggerAction('Update BMS Limits')} title="Modify the Battery Management System constraints."
                style={{ width: '100%', marginTop: '10px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                Modify Limits
              </button>
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
