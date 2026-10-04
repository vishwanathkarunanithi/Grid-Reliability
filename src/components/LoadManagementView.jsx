import React from 'react';
import { Cpu, ZapOff, CheckCircle } from 'lucide-react';

export default function LoadManagementView() {
  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      <div className="control-panel glass" style={{ flex: 2 }}>
        <h3>Active Demand Response Rules</h3>
        <div className="load-items">
          <div className="load-item">
            <div className="load-info">
              <span className="load-name">Critical Infrastructure (Hospital & Clinic)</span>
              <span className="load-desc">Feeder A - Uninterruptible (Battery Backup Priority 1)</span>
            </div>
            <span className="badge critical">Protected</span>
          </div>
          <div className="load-item">
            <div className="load-info">
              <span className="load-name">Residential HVAC & Heaters</span>
              <span className="load-desc">Feeder B - Shifted by 2 hours due to intermittency</span>
            </div>
            <span className="badge flexible"><ZapOff size={12}/> Curtailed</span>
          </div>
          <div className="load-item">
            <div className="load-info">
              <span className="load-name">Public Street Lighting</span>
              <span className="load-desc">Feeder C - Dimmed to 60% capacity</span>
            </div>
            <span className="badge flexible">Dimmed</span>
          </div>
          <div className="load-item">
            <div className="load-info">
              <span className="load-name">Commercial District Operations</span>
              <span className="load-desc">Feeder D - Normal Operations</span>
            </div>
            <span className="badge normal"><CheckCircle size={12}/> Normal</span>
          </div>
        </div>
      </div>
      
      <div className="glass" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3>Manual Overrides</h3>
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Execute emergency load shedding protocols if automated systems fail to balance the grid.
        </p>
        <button className="action-btn" style={{ background: 'transparent', border: '1px solid #00d2ff', color: '#00d2ff' }}>
          Trigger Pre-Cooling
        </button>
        <button className="action-btn" style={{ background: 'transparent', border: '1px solid #ffc107', color: '#ffc107' }}>
          Curtail Non-Critical
        </button>
        <button className="action-btn" style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid #ff4b4b', color: '#ff4b4b' }}>
          Emergency Feeder Shutdown
        </button>
      </div>
    </div>
  );
}
