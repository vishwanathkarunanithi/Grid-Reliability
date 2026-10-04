import React, { useState, useEffect } from 'react';
import { Battery, Zap, Activity, Clock, ShieldCheck, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, AlertCircle } from 'lucide-react';

export default function StorageView() {
  const [data, setData] = useState({
    capacity: '1.5 MWh',
    currentCharge: 85,
    status: 'Discharging',
    dischargeRate: '250 kW',
    health: '98%',
    cycles: 124
  });
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/storage')
        .then(res => res.json())
        .then(d => {
          setData(d);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      {/* Top Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '15px', borderRadius: '50%' }}><Battery color="#00ff88"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>State of Charge</p><h2 style={{ margin: 0, color: '#fff' }}>{data.currentCharge}%</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%' }}><Activity color="#00d2ff"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Active Rate</p><h2 style={{ margin: 0, color: '#fff' }}>{data.dischargeRate}</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}><ShieldCheck color="#ffc107"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Battery Health</p><h2 style={{ margin: 0, color: '#fff' }}>{data.health}</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(235, 59, 90, 0.2)', padding: '15px', borderRadius: '50%' }}><RefreshCw color="#eb3b5a"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Charge Cycles</p><h2 style={{ margin: 0, color: '#fff' }}>{data.cycles}</h2></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', flex: 1, minHeight: '300px' }}>
        
        {/* Main Control Panel */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#00ff88', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Zap size={20}/> Storage Array Control</h3>
            <span style={{ background: 'rgba(0,255,136,0.1)', color: '#00ff88', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
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
                    <strong style={{ color: '#ffc107' }}>42°C</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#333', borderRadius: '4px' }}>
                    <div style={{ width: '60%', height: '100%', background: '#ffc107', borderRadius: '4px' }} />
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
          
          <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
            <button className="action-btn" style={{ flex: 1, background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid #00ff88' }}>Force Discharge</button>
            <button className="action-btn" style={{ flex: 1, background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid #00d2ff' }}>Force Charge</button>
            <button className="action-btn" style={{ flex: 1, background: 'rgba(235, 59, 90, 0.1)', color: '#eb3b5a', border: '1px solid #eb3b5a' }}>Emergency Stop</button>
          </div>
        </div>

        {/* Action Log / Recent History */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
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

      </div>
    </div>
  );
}
