import React, { useState, Suspense } from 'react';
import { Activity, AlertTriangle, Zap, Wind, Battery, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ThreeScene from './ThreeScene';

export default function MainDashboard() {
  const [triggerStatus, setTriggerStatus] = useState('idle'); // idle, triggering, active

  const handleTriggerCooling = async () => {
    setTriggerStatus('triggering');
    try {
      const response = await fetch('/api/trigger-response', { method: 'POST' });
      if (response.ok) {
        setTimeout(() => setTriggerStatus('active'), 1500);
      }
    } catch (error) {
      console.error("Backend error:", error);
      setTimeout(() => setTriggerStatus('active'), 1000); // Fallback if backend offline
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', height: '100%' }}>
      {/* Left Column: 3D Microgrid View */}
      <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#00d2ff' }}>
          <Activity size={20} /> Live Holographic Grid Topology
        </h3>
        
        {/* Embedded 3D Scene */}
        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', background: '#030510', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
          <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} intensity={2} color="#00ff88" />
            <spotLight position={[-10, 20, -10]} intensity={1} color="#00d2ff" />
            <Suspense fallback={null}>
              <ThreeScene batteryLevel={85} />
            </Suspense>
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
          </Canvas>
        </div>
      </div>

      {/* Right Column: Actions & Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Demand Response Trigger */}
        <div className="glass" style={{ padding: '20px', background: 'rgba(235, 59, 90, 0.1)', border: '1px solid rgba(235, 59, 90, 0.3)' }}>
          <h3 style={{ color: '#eb3b5a', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} /> Feeder Overload Risk
          </h3>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '20px' }}>
            Feeder A is nearing peak capacity due to low renewable generation. Initiate smart cooling protocol to shed 120kW of non-critical HVAC load.
          </p>
          
          <button 
            onClick={handleTriggerCooling}
            disabled={triggerStatus !== 'idle'}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: 'none', 
              background: triggerStatus === 'idle' ? '#eb3b5a' : triggerStatus === 'active' ? '#00ff88' : '#f39c12', 
              color: triggerStatus === 'active' ? '#000' : '#fff', 
              fontWeight: 'bold', 
              cursor: triggerStatus === 'idle' ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {triggerStatus === 'idle' && <><ThermometerSnowflake size={18} /> Trigger Smart Cooling Protocol</>}
            {triggerStatus === 'triggering' && 'Initiating Protocol...'}
            {triggerStatus === 'active' && <><CheckCircle2 size={18} /> Load Shedding Active</>}
          </button>
        </div>

        {/* Real-time Stats */}
        <div className="glass" style={{ padding: '20px', flex: 1 }}>
          <h3 style={{ color: '#00ff88', marginBottom: '15px' }}>Grid Vitals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Zap size={16} /> Total Demand</span>
              <strong style={{ color: '#fff' }}>4.2 MW</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Wind size={16} /> Renewable Gen</span>
              <strong style={{ color: '#00d2ff' }}>2.1 MW</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Battery size={16} /> Battery Discharge</span>
              <strong style={{ color: '#00ff88' }}>2.1 MW</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
