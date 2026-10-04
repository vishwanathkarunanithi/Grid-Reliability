import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, ContactShadows } from '@react-three/drei';
import DashboardScene from './components/DashboardScene';
import NormalDashboard from './components/NormalDashboard';
import { Info, Monitor, Box } from 'lucide-react';
import './App.css';

export default function App() {
  const [showHelp, setShowHelp] = useState(true);
  const [viewMode, setViewMode] = useState('3D'); // '3D' or '2D'

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#030510', overflow: 'hidden', position: 'relative' }}>
      {/* View Switcher (Only absolute in 3D mode) */}
      {viewMode === '3D' && (
        <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000, display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setViewMode('2D')} 
            style={{ whiteSpace: 'nowrap', background: viewMode === '2D' ? 'rgba(0,210,255,0.4)' : 'rgba(0,210,255,0.1)', border: '1px solid #00d2ff', color: '#00d2ff', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}
          >
            <Monitor size={18} /> Standard View
          </button>
          <button 
            onClick={() => setViewMode('3D')} 
            style={{ whiteSpace: 'nowrap', background: viewMode === '3D' ? 'rgba(0,255,136,0.4)' : 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}
          >
            <Box size={18} /> 3D Holographic
          </button>
        </div>
      )}

      {viewMode === '3D' ? (
        <>
          {/* Navigation Help Overlay */}
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000 }}>
            <button 
              onClick={() => setShowHelp(!showHelp)} 
              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', backdropFilter: 'blur(10px)' }}
            >
              <Info size={20} /> {showHelp ? 'Hide Guide' : 'How to Navigate'}
            </button>
            
            {showHelp && (
              <div style={{ marginTop: '15px', background: 'rgba(5, 10, 25, 0.85)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(0, 255, 136, 0.3)', color: 'white', width: '320px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Info size={20} /> Interface Guide
                </h3>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.95rem', color: '#ddd' }}>
                  <li><strong>Rotate Camera:</strong> Click and drag anywhere in the dark background space.</li>
                  <li><strong>Zoom In/Out:</strong> Use your mouse scroll wheel.</li>
                  <li><strong>View Data Modules:</strong> Click on any of the floating glowing panels to bring it to the center. Click "Close View" to dismiss it.</li>
                  <li><strong>Inspect Grid Network:</strong> Click on the Houses, Solar Panels, or Wind Turbines in the center to view real-time node analytics.</li>
                </ul>
              </div>
            )}
          </div>

          <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
            <color attach="background" args={['#030510']} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={2} castShadow color="#00ff88" />
            <spotLight position={[-10, 20, -10]} angle={0.2} penumbra={1} intensity={1} castShadow color="#00d2ff" />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1.5} />
            
            <Suspense fallback={null}>
              <DashboardScene />
            </Suspense>

            <ContactShadows resolution={1024} scale={100} blur={2} opacity={0.4} far={20} color="#00d2ff" />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
          </Canvas>
        </>
      ) : (
        <NormalDashboard viewMode={viewMode} setViewMode={setViewMode} />
      )}
    </div>
  );
}
