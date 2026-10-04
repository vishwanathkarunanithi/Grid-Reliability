import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Wind, BrainCircuit, Activity, LineChart, Cpu, Umbrella, Map } from 'lucide-react';

export default function ForecastingView() {
  const [data, setData] = useState([]);
  const [weather, setWeather] = useState({ temp: 24, cloudCover: 30, wind: 12.5 });

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/demand-forecast')
        .then(res => res.json())
        .then(d => {
          setData(d);
          setWeather({
            temp: +(24 + (Math.random()*2-1)).toFixed(1),
            cloudCover: Math.round(30 + (Math.random()*10-5)),
            wind: +(12.5 + (Math.random()-0.5)).toFixed(1)
          });
        })
        .catch(err => console.log('Using fallback mock data'));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%' }}><Sun color="#00d2ff"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Ambient Temp</p><h2 style={{ margin: 0, color: '#fff' }}>{weather.temp}°C</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}><Wind color="#ffc107"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Wind Speed</p><h2 style={{ margin: 0, color: '#fff' }}>{weather.wind} m/s</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(170, 170, 170, 0.2)', padding: '15px', borderRadius: '50%' }}><Umbrella color="#aaa"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Cloud Cover</p><h2 style={{ margin: 0, color: '#fff' }}>{weather.cloudCover}%</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '15px', borderRadius: '50%' }}><BrainCircuit color="#00ff88"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>AI Confidence</p><h2 style={{ margin: 0, color: '#fff' }}>94.2%</h2></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', flex: 1, minHeight: '400px' }}>
        
        {/* Generative AI Forecast Chart Simulator */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff88', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><LineChart size={20}/> 24-Hour AI Load & Generation Forecast</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffc107', fontSize: '0.9rem' }}><span style={{ width: '12px', height: '12px', background: '#ffc107', borderRadius: '50%' }}/> Supply Forecast</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#eb3b5a', fontSize: '0.9rem' }}><span style={{ width: '12px', height: '12px', background: '#eb3b5a', borderRadius: '50%' }}/> Demand Forecast</span>
            </div>
          </div>
          
          {/* Simulated Chart using flex layout */}
          <div style={{ flex: 1, background: '#111827', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-end', gap: '10px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            
            {/* Grid lines */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}/>
            <div style={{ position: 'absolute', top: '50%', left: '20px', right: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}/>
            <div style={{ position: 'absolute', bottom: '40px', left: '20px', right: '20px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}/>

            {data.length === 0 ? <p style={{ color: '#888', margin: 'auto' }}>Generating forecast matrix...</p> : null}
            
            {data.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '0', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', height: 'calc(100% - 40px)' }}>
                  
                  {/* Supply Bar */}
                  <div style={{ width: '30%', height: `${(d.supply / 7000) * 100}%`, background: 'linear-gradient(0deg, rgba(255,193,7,0.2) 0%, rgba(255,193,7,1) 100%)', borderRadius: '4px 4px 0 0', marginRight: '2px', transition: 'height 0.5s' }} title={`Supply: ${d.supply}`} />
                  
                  {/* Demand Bar */}
                  <div style={{ width: '30%', height: `${(d.demand / 7000) * 100}%`, background: 'linear-gradient(0deg, rgba(235,59,90,0.2) 0%, rgba(235,59,90,1) 100%)', borderRadius: '4px 4px 0 0', marginLeft: '2px', transition: 'height 0.5s' }} title={`Demand: ${d.demand}`} />
                </div>
                <span style={{ color: '#888', fontSize: '0.8rem', marginTop: 'auto' }}>{d.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
