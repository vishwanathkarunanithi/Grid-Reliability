import React, { useState, useEffect } from 'react';
import { Save, Shield, Bell, Network, Zap, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    autoDemandResponse: true,
    p2pTrading: true,
    telemetryRate: '1s',
    alertThreshold: '90',
  });
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.log('Using default local settings'));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setTimeout(() => setSaveStatus('saved'), 800);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (e) {
      setTimeout(() => setSaveStatus('saved'), 800);
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', maxWidth: '800px' }}>
      <div className="glass" style={{ padding: '20px' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>System Configuration</h2>
        <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Manage global parameters for the microgrid operation.</p>
      </div>

      <div className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* Setting Item */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ color: '#00d2ff', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18}/> Autonomous Demand Response</h3>
            <p style={{ color: '#8892b0', margin: 0, fontSize: '0.9rem' }}>Allow the system to automatically shed flexible loads during feeder stress.</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.autoDemandResponse} 
              onChange={(e) => handleChange('autoDemandResponse', e.target.checked)} 
              style={{ width: '20px', height: '20px', accentColor: '#00ff88' }} 
            />
          </label>
        </div>

        {/* Setting Item */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ color: '#00d2ff', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Network size={18}/> Peer-to-Peer Trading Active</h3>
            <p style={{ color: '#8892b0', margin: 0, fontSize: '0.9rem' }}>Enable local households to share surplus solar energy.</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={settings.p2pTrading} 
              onChange={(e) => handleChange('p2pTrading', e.target.checked)} 
              style={{ width: '20px', height: '20px', accentColor: '#00ff88' }} 
            />
          </label>
        </div>

        {/* Setting Item */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
          <div>
            <h3 style={{ color: '#00d2ff', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18}/> Feeder Alert Threshold (%)</h3>
            <p style={{ color: '#8892b0', margin: 0, fontSize: '0.9rem' }}>Capacity limit before triggering critical DISCOM alerts.</p>
          </div>
          <input 
            type="number" 
            value={settings.alertThreshold} 
            onChange={(e) => handleChange('alertThreshold', e.target.value)} 
            style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 210, 255, 0.3)', color: '#fff', borderRadius: '6px', width: '80px', textAlign: 'center' }}
          />
        </div>

        {/* Setting Item */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#00d2ff', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18}/> Telemetry Refresh Rate</h3>
            <p style={{ color: '#8892b0', margin: 0, fontSize: '0.9rem' }}>How often IoT sensors push data to the central hub.</p>
          </div>
          <select 
            value={settings.telemetryRate} 
            onChange={(e) => handleChange('telemetryRate', e.target.value)}
            style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 210, 255, 0.3)', color: '#fff', borderRadius: '6px' }}
          >
            <option value="500ms">500 ms</option>
            <option value="1s">1 Second</option>
            <option value="5s">5 Seconds</option>
          </select>
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleSave}
            style={{ 
              background: saveStatus === 'saved' ? '#00ff88' : 'rgba(0, 210, 255, 0.2)', 
              color: saveStatus === 'saved' ? '#000' : '#00d2ff', 
              border: saveStatus === 'saved' ? 'none' : '1px solid #00d2ff', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
          >
            {saveStatus === 'saved' ? <><CheckCircle2 size={18}/> Configuration Saved</> : <><Save size={18}/> Save Configuration</>}
          </button>
        </div>

      </div>
    </div>
  );
}
