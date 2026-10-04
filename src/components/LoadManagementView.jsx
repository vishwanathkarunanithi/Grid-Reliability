import React, { useState, useEffect } from 'react';
import { Cpu, Power, ZapOff, Play, ShieldAlert, Sliders, Activity, ThermometerSnowflake, Monitor, Clock, CheckCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function LoadManagementView() {
  const [data, setData] = useState({
    sheddingActive: false,
    criticalLoad: '1.2 MW',
    flexibleLoad: '800 kW'
  });
  
  const [appliances, setAppliances] = useState([
    { id: 1, name: 'HVAC Sector A', type: 'flexible', power: '240 kW', active: true },
    { id: 2, name: 'HVAC Sector B', type: 'flexible', power: '210 kW', active: true },
    { id: 3, name: 'EV Charging Hub', type: 'flexible', power: '350 kW', active: true },
    { id: 4, name: 'Hospital Life Support', type: 'critical', power: '120 kW', active: true },
    { id: 5, name: 'Data Center Servers', type: 'critical', power: '850 kW', active: true },
    { id: 6, name: 'Street Lighting', type: 'normal', power: '150 kW', active: false },
  ]);

  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/load')
        .then(res => res.json())
        .then(d => {
          setData(d);
          if (d.sheddingActive) {
            setAppliances(prev => prev.map(a => a.type === 'flexible' ? { ...a, active: false } : a));
          }
        })
        .catch(err => console.log('Using fallback mock data'));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerToggleAppliance = (app) => {
    if (app.type === 'critical') return;
    setModalConfig({
      title: `Toggle ${app.name}`,
      message: `Are you sure you want to turn ${app.active ? 'OFF' : 'ON'} ${app.name}? This will affect total grid demand by ${app.power}.`,
      action: () => setAppliances(prev => prev.map(a => a.id === app.id ? { ...a, active: !a.active } : a))
    });
  };

  const handleGlobalToggle = () => {
    setModalConfig({
      title: data.sheddingActive ? "Restore Loads" : "Force Curtailment",
      message: data.sheddingActive ? "Restore all flexible loads to normal operation?" : "Force immediate load shedding for all flexible resources?",
      action: () => {
        fetch('/api/trigger-response', { method: 'POST' });
        setAppliances(prev => prev.map(a => a.type === 'flexible' ? { ...a, active: data.sheddingActive } : a));
        setData(prev => ({ ...prev, sheddingActive: !prev.sheddingActive }));
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Banner */}
      <div className="glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: data.sheddingActive ? 'rgba(235, 59, 90, 0.1)' : 'rgba(0, 255, 136, 0.1)', border: data.sheddingActive ? '1px solid rgba(235,59,90,0.4)' : '1px solid rgba(0,255,136,0.3)' }}>
        <div>
          <h2 style={{ margin: 0, color: data.sheddingActive ? '#eb3b5a' : '#00ff88', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {data.sheddingActive ? <ShieldAlert size={28}/> : <CheckCircle size={28}/>} 
            {data.sheddingActive ? 'Demand Response: ACTIVE (Load Shedding)' : 'Demand Response: STANDBY'}
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>
            {data.sheddingActive ? 'Non-critical and flexible loads have been curtailed to maintain grid stability.' : 'Sufficient generation capacity available to meet all load requirements.'}
          </p>
        </div>
        <button 
          onClick={handleGlobalToggle}
          title={data.sheddingActive ? "Restore power to all non-critical loads." : "Cut power to all non-critical loads instantly."}
          className="action-btn"
          style={{ background: data.sheddingActive ? 'transparent' : '#eb3b5a', color: data.sheddingActive ? '#eb3b5a' : '#fff', border: `1px solid #eb3b5a`, padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: data.sheddingActive ? 'none' : '0 0 15px rgba(235,59,90,0.5)' }}
        >
          {data.sheddingActive ? <Play size={18}/> : <ZapOff size={18}/>}
          {data.sheddingActive ? 'Restore All Loads' : 'Force Emergency Curtailment'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', flex: 1 }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Load Breakdown */}
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20}/> Load Breakdown</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(235, 59, 90, 0.1)', border: '1px solid rgba(235,59,90,0.2)', padding: '20px', borderRadius: '12px' }}>
                <span style={{ color: '#eb3b5a', fontSize: '0.9rem', fontWeight: 'bold' }}>CRITICAL LOAD (Must Run)</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '2rem' }}>{data.criticalLoad}</h2>
              </div>
              <div style={{ background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0,210,255,0.2)', padding: '20px', borderRadius: '12px' }}>
                <span style={{ color: '#00d2ff', fontSize: '0.9rem', fontWeight: 'bold' }}>FLEXIBLE LOAD (Curtailable)</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '2rem' }}>{data.flexibleLoad}</h2>
              </div>
              <div style={{ background: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255,193,7,0.2)', padding: '20px', borderRadius: '12px' }}>
                <span style={{ color: '#ffc107', fontSize: '0.9rem', fontWeight: 'bold' }}>TOTAL ACTIVE DRAW</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '2rem' }}>
                  {(parseFloat(data.criticalLoad) + (parseFloat(data.flexibleLoad)/1000)).toFixed(2)} MW
                </h2>
              </div>
            </div>
          </div>
          
          <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ color: '#fff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20}/> Curtailment History</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '15px', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
              <p style={{ color: '#888', margin: '0 0 10px 0' }}>14:32 - Shed 240kW (HVAC A)</p>
              <p style={{ color: '#888', margin: '0 0 10px 0' }}>09:15 - Shed 150kW (Street Lights)</p>
              <p style={{ color: '#888', margin: '0 0 10px 0' }}>Yesterday - Event duration: 42m</p>
            </div>
          </div>
        </div>

        {/* Appliance Level Control */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00ff88', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Sliders size={20}/> Active Appliance Management</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', overflowY: 'auto', paddingRight: '5px' }}>
            {appliances.map(app => (
              <div key={app.id} style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: 'bold' }}>
                    {app.name.includes('HVAC') ? <ThermometerSnowflake size={18} color="#00d2ff"/> : <Monitor size={18} color="#ffc107"/>}
                    {app.name}
                  </div>
                  <span className={`badge ${app.type}`}>{app.type.toUpperCase()}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ color: '#888', fontSize: '1.2rem', fontWeight: 'bold' }}>{app.power}</span>
                  
                  {/* Toggle Switch UI */}
                  <div 
                    title={app.type === 'critical' ? "Critical loads cannot be disabled manually." : `Click to toggle ${app.name}`}
                    onClick={() => triggerToggleAppliance(app)}
                    style={{ 
                      width: '50px', height: '26px', background: app.active ? '#00ff88' : '#333', 
                      borderRadius: '13px', position: 'relative', cursor: app.type === 'critical' ? 'not-allowed' : 'pointer',
                      opacity: app.type === 'critical' ? 0.5 : 1, transition: 'background 0.3s'
                    }}
                  >
                    <div style={{ 
                      width: '20px', height: '20px', background: '#fff', borderRadius: '50%', 
                      position: 'absolute', top: '3px', left: app.active ? '27px' : '3px', transition: 'left 0.3s' 
                    }}/>
                  </div>
                </div>
              </div>
            ))}
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
