import React from 'react';
import { CloudRain, Sun, Wind, CloudLightning } from 'lucide-react';

export default function ForecastingView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card glass">
          <div className="stat-icon"><Sun color="#ffc107" /></div>
          <div className="stat-info">
            <h3>Solar Irradiance</h3>
            <p>850 W/m²</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><Wind color="#00d2ff" /></div>
          <div className="stat-info">
            <h3>Wind Speed</h3>
            <p>12 m/s</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><CloudRain color="#888" /></div>
          <div className="stat-info">
            <h3>Precipitation Prob.</h3>
            <p>15%</p>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon"><CloudLightning color="#ff4b4b" /></div>
          <div className="stat-info">
            <h3>Cloud Cover Alert</h3>
            <p>Expected at 14:00</p>
          </div>
        </div>
      </div>
      
      <div className="glass" style={{ flex: 1, padding: '2rem' }}>
        <h3>AI Generation Predictor Model</h3>
        <p style={{ color: '#888', marginTop: '1rem' }}>
          The machine learning forecasting model indicates a sharp 40% drop in solar generation between 14:00 and 16:00 due to an incoming storm cell. 
          Demand Response and Battery dispatch protocols have been automatically pre-scheduled to bridge this intermittency gap.
        </p>
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,193,7,0.1)', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
          <strong>System Action Log:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#ccc' }}>
            <li>[10:05 AM] Weather API synched: Storm cell detected.</li>
            <li>[10:06 AM] Solar generation forecast revised down by 1.2 MW.</li>
            <li>[10:06 AM] Scheduled battery pre-charging from Grid (Off-peak).</li>
            <li>[10:07 AM] Sent intent signals to DISCOM feeder analytics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
