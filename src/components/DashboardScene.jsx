import React, { useState, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Activity, Battery, CloudRain, Cpu, Home, Server } from 'lucide-react';
import MainDashboard from './MainDashboard';
import StorageView from './StorageView';
import CommunityView from './CommunityView';
import DiscomView from './DiscomView';
import LoadManagementView from './LoadManagementView';
import ForecastingView from './ForecastingView';
import ThreeScene from './ThreeScene';

const PANELS = [
  { id: 'dashboard', title: 'Microgrid Overview', component: <MainDashboard />, icon: <Activity /> },
  { id: 'storage', title: 'Distributed Storage', component: <StorageView />, icon: <Battery /> },
  { id: 'community', title: 'Community P2P', component: <CommunityView />, icon: <Home /> },
  { id: 'discom', title: 'DISCOM Analytics', component: <DiscomView />, icon: <Server /> },
  { id: 'load', title: 'Smart Load Management', component: <LoadManagementView />, icon: <Cpu /> },
  { id: 'forecast', title: 'AI Forecasting', component: <ForecastingView />, icon: <CloudRain /> },
];

function HolographicPanel({ data, index, total, activeId, setActiveId }) {
  const groupRef = useRef();
  const isActive = activeId === data.id;
  const isHidden = activeId !== null && !isActive;

  // Calculate circular position
  const angle = (index / total) * Math.PI * 2;
  const radius = 18;
  const targetPos = new THREE.Vector3(
    Math.sin(angle) * radius,
    2,
    Math.cos(angle) * radius
  );
  
  // Rotate to face center
  const targetRot = new THREE.Euler(0, angle + Math.PI, 0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    if (isActive) {
      // Bring active panel to front center
      groupRef.current.position.lerp(new THREE.Vector3(0, 3, 5), 0.05);
      
      const q1 = new THREE.Quaternion().copy(groupRef.current.quaternion);
      const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
      q1.slerp(q2, 0.05);
      groupRef.current.quaternion.copy(q1);
      
      groupRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.05);
    } else {
      // Return to circle or push away if another is active
      const pos = targetPos.clone();
      if (isHidden) {
        pos.y -= 20; // Hide below
      } else {
        pos.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.5; // floating effect
      }
      groupRef.current.position.lerp(pos, 0.05);
      
      const q1 = new THREE.Quaternion().copy(groupRef.current.quaternion);
      const q2 = new THREE.Quaternion().setFromEuler(targetRot);
      q1.slerp(q2, 0.05);
      groupRef.current.quaternion.copy(q1);
      
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
    }
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : data.id); }}>
      <RoundedBox args={[14, 9, 0.2]} radius={0.2} smoothness={4}>
        <meshPhysicalMaterial 
          color="#0b1528" 
          transparent 
          opacity={0.8} 
          roughness={0.2} 
          metalness={0.8}
          transmission={0.5}
          emissive={isActive ? "#00ff88" : "#00d2ff"}
          emissiveIntensity={0.2}
        />
      </RoundedBox>
      <mesh position={[0, 0, -0.15]}>
        <planeGeometry args={[14.4, 9.4]} />
        <meshBasicMaterial color={isActive ? "#00ff88" : "#00d2ff"} transparent opacity={0.3} />
      </mesh>
      
      <Html transform position={[0, 0, 0.2]} scale={0.5} zIndexRange={[100, 0]}>
        <div style={{ 
          width: '1350px', 
          height: '850px', 
          padding: '30px', 
          color: 'white', 
          pointerEvents: isActive ? 'auto' : 'none',
          opacity: isActive ? 1 : 0.7,
          transition: 'opacity 0.3s'
        }} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `2px solid ${isActive ? '#00ff88' : '#00d2ff'}`, paddingBottom: '15px', marginBottom: '20px' }}>
            <div style={{ color: isActive ? '#00ff88' : '#00d2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(1.5)' }}>
              {data.icon}
            </div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{data.title}</h1>
            {isActive && (
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                style={{ marginLeft: 'auto', background: 'rgba(255,75,75,0.2)', color: '#ff4b4b', border: '1px solid #ff4b4b', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                Close View
              </button>
            )}
          </div>
          <div style={{ height: 'calc(100% - 100px)', overflowY: 'auto' }}>
            {data.component}
          </div>
        </div>
      </Html>
    </group>
  );
}

function CenterCore() {
  const coreRef = useRef();
  useFrame((state) => {
    coreRef.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={coreRef} position={[0, -2, 0]}>
      {/* Energy Core visualization */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhysicalMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} wireframe />
      </mesh>
      
      <Text position={[0, 5, 0]} fontSize={1} color="#00ff88" anchorX="center" anchorY="middle">
        GridSync Core
      </Text>
      
      {/* Interactive Microgrid Base */}
      <group position={[0, -1, 0]} scale={[0.8, 0.8, 0.8]}>
        <ThreeScene batteryLevel={85} />
      </group>
    </group>
  );
}

export default function DashboardScene() {
  const [activeId, setActiveId] = useState(null);

  return (
    <group>
      {/* Central Interactive Grid Model */}
      <CenterCore />

      {/* Floating 3D Panels */}
      {PANELS.map((panel, index) => (
        <HolographicPanel 
          key={panel.id} 
          data={panel} 
          index={index} 
          total={PANELS.length} 
          activeId={activeId} 
          setActiveId={setActiveId} 
        />
      ))}
      
      {/* Decorative rings */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
        <ringGeometry args={[16, 16.2, 64]} />
        <meshBasicMaterial color="#00d2ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -2, 0]}>
        <ringGeometry args={[18, 18.1, 64]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
