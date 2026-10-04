import React, { useState, useEffect } from 'react';
import { Settings, Save, Server, Shield, Globe, Bell, Zap, Cpu } from 'lucide-react';

export default function SettingsView() {
  const [config, setConfig] = useState({
    autoDemandResponse: true,
    p2pTrading: true,
    telemetryRate: '1s',
    alertThreshold: '90',
    gridIslandMode: 'auto',
    apiEndpoint: 'wss://core.gridsync.network/v1',
    mlModel: 'xgboost-v4.2',
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setConfig).catch(e => console.log('Mock'));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    }).then(() => {
      setTimeout(() => setSaving(false), 800);
    }).catch(() => {
      setTimeout(() => setSaving(false), 800);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      <div className="glass" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={28}/> System Configuration</h2>
          <p style={{ margin: '5px 0 0 0', color: '#ccc' }}>Modify global microgrid behavior, ML models, and networking endpoints.</p>
        </div>
        <button 
          onClick={handleSave} 
          className="action-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: saving ? '#ffc107' : '#00d2ff', color: '#000' }}
        >
          <Save size={18}/> {saving ? 'Applying Configuration...' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Operational Policies */}
        <div className="glass" style={{ padding: '25px' }}>
          <h3 style={{ color: '#00ff88', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={20}/> Operational Policies</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Autonomous Demand Response</strong>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>Allow system to automatically shed non-critical loads</span>
              </div>
              <input type="checkbox" name="autoDemandResponse" checked={config.autoDemandResponse} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Peer-to-Peer Market Making</strong>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>Enable automated block trading between local nodes</span>
              </div>
              <input type="checkbox" name="p2pTrading" checked={config.p2pTrading} onChange={handleChange} style={{ width: '20px', height: '20px' }} />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>Feeder Alert Threshold (%)</strong>
              <input type="range" name="alertThreshold" min="50" max="100" value={config.alertThreshold} onChange={handleChange} style={{ width: '100%' }} />
              <span style={{ color: '#00d2ff', fontWeight: 'bold', textAlign: 'right' }}>{config.alertThreshold}%</span>
            </label>
          </div>
        </div>

        {/* Network & Machine Learning */}
        <div className="glass" style={{ padding: '25px' }}>
          <h3 style={{ color: '#ffc107', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><Cpu size={20}/> Analytics & Telemetry</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>Telemetry Refresh Rate</strong>
              <select name="telemetryRate" value={config.telemetryRate} onChange={handleChange} style={{ background: '#111827', color: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #333', outline: 'none' }}>
                <option value="100ms">Ultra-Fast (100ms)</option>
                <option value="1s">Standard (1s)</option>
                <option value="5s">Eco Mode (5s)</option>
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>Forecast ML Model Engine</strong>
              <select name="mlModel" value={config.mlModel} onChange={handleChange} style={{ background: '#111827', color: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #333', outline: 'none' }}>
                <option value="xgboost-v4.2">XGBoost Advanced Grid v4.2</option>
                <option value="lstm-rnn">LSTM Neural Network (Experimental)</option>
                <option value="linear-reg">Linear Regression (Fallback)</option>
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <strong style={{ color: '#fff' }}>API Core Endpoint (WebSocket)</strong>
              <input type="text" name="apiEndpoint" value={config.apiEndpoint} onChange={handleChange} style={{ background: '#111827', color: '#00d2ff', padding: '10px', borderRadius: '4px', border: '1px solid #333', outline: 'none' }} />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
