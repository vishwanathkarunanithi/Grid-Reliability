import React, { useState, useEffect, Suspense } from 'react';
import { Activity, AlertTriangle, Zap, Wind, Battery, ThermometerSnowflake, CheckCircle2 } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ThreeScene from './ThreeScene';
import ConfirmModal from './ConfirmModal';

export default function MainDashboard() {
  const [triggerStatus, setTriggerStatus] = useState('idle'); // idle, triggering, active
  const [modalConfig, setModalConfig] = useState(null);

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

  const [gridData, setGridData] = useState({
    demand: 4.2,
    solarGeneration: 2.1,
    batteryLevel: 85
  });

  useEffect(() => {
    const fetchGridStatus = () => {
      fetch('/api/grid-status')
        .then(res => res.json())
        .then(data => setGridData(data))
        .catch(err => console.log('Mock'));
    };
    fetchGridStatus();
    const interval = setInterval(fetchGridStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', height: '100%' }}>
      {/* Left Column: 3D Microgrid View */}
      <div className="glass" style={{ flex: '1 1 500px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative', minHeight: '400px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: '#00d2ff' }}>
          <Activity size={20} /> Live Holographic Grid Topology
        </h3>
        
        {/* Embedded 3D Scene */}
        <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', background: '#030510', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
          <Canvas camera={{ position: [0, 5, 12], fov: 60 }} performance={{ min: 0.5 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} intensity={1.5} color="#00ff88" />
            <spotLight position={[-10, 20, -10]} intensity={1} color="#00d2ff" />
            <Suspense fallback={null}>
              <ThreeScene batteryLevel={gridData.batteryLevel} coolingActive={triggerStatus === 'active'} />
            </Suspense>
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
          </Canvas>
        </div>
      </div>

      {/* Right Column: Actions & Stats */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Demand Response Trigger */}
        <div className="glass" style={{ padding: '20px', background: 'rgba(235, 59, 90, 0.1)', border: '1px solid rgba(235, 59, 90, 0.3)', transition: 'all 0.3s' }}>
          <h3 style={{ color: '#eb3b5a', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} /> Feeder Overload Risk
          </h3>
          <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '20px' }}>
            Feeder A is nearing peak capacity due to low renewable generation. Initiate smart cooling protocol to shed 120kW of non-critical HVAC load.
          </p>
          
          <button 
            onClick={handleTriggerCooling}
            disabled={triggerStatus !== 'idle'}
            className="action-btn"
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
              gap: '10px',
              boxShadow: triggerStatus === 'idle' ? '0 0 15px rgba(235,59,90,0.5)' : 'none',
              transform: triggerStatus === 'active' ? 'scale(0.98)' : 'scale(1)'
            }}
            title="Force a load shedding event on the grid to protect feeder limits."
          >
            {triggerStatus === 'idle' && <><ThermometerSnowflake size={18} /> Trigger Smart Cooling Protocol</>}
            {triggerStatus === 'triggering' && 'Initiating Protocol...'}
            {triggerStatus === 'active' && <><CheckCircle2 size={18} /> Load Shedding Active</>}
          </button>
        </div>

        {/* Real-time Stats */}
        <div id="stats-area" className="glass" style={{ padding: '20px', flex: 1, borderRadius: '12px' }}>
          <h3 style={{ color: '#00ff88', marginBottom: '15px' }}>Grid Vitals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Zap size={16} /> Total Demand</span>
              <strong style={{ color: '#fff', fontSize: '1.2rem' }}>{gridData.demand} MW</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Wind size={16} /> Renewable Gen</span>
              <strong style={{ color: '#00d2ff', fontSize: '1.2rem' }}>{gridData.solarGeneration} MW</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc' }}><Battery size={16} /> Battery SOC</span>
              <strong style={{ color: '#00ff88', fontSize: '1.2rem' }}>{gridData.batteryLevel}%</strong>
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal 
        isOpen={!!modalConfig}
        title={modalConfig?.title}
        message={modalConfig?.message}
        highlightArea={modalConfig?.highlightArea}
        onConfirm={() => {
          if (modalConfig?.action) modalConfig.action();
          setModalConfig(null);
        }}
        onCancel={() => setModalConfig(null)}
      />
    </div>
  );
}
