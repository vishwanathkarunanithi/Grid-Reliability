import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Zap, Sun, Wind, Home } from 'lucide-react';

function InfoPopup({ title, icon, stats, onClose }) {
  return (
    <Html position={[0, 3, 0]} center zIndexRange={[100, 0]}>
      <div style={{ background: 'rgba(5, 10, 25, 0.95)', padding: '20px', borderRadius: '12px', border: '1px solid #00d2ff', color: 'white', width: '260px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#00d2ff', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
          {icon} {title}
        </h4>
        <div style={{ fontSize: '13px', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>
              <span>{stat.label}</span>
              <strong style={{ color: stat.color || '#fff' }}>{stat.value}</strong>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose} 
          style={{ marginTop: '15px', width: '100%', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid #00d2ff', color: '#00d2ff', cursor: 'pointer', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}
        >
          Close Analytics
        </button>
      </div>
    </Html>
  );
}

export function WindTurbine({ position, speed, id, activeId, setActiveId }) {
  const bladesRef = useRef();
  const isActive = activeId === id;
  
  useFrame(() => {
    if (bladesRef.current) bladesRef.current.rotation.z += speed;
  });

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : id); }}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 3, 16]} />
        <meshStandardMaterial color={isActive ? "#00d2ff" : "#cccccc"} emissive={isActive ? "#00d2ff" : "#000"} emissiveIntensity={0.5} />
      </mesh>
      <group position={[0, 3, 0]} ref={bladesRef}>
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 16]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[0, 0.8, 0.3]}>
          <boxGeometry args={[0.1, 1.6, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.69, -0.4, 0.3]} rotation={[0, 0, (2 * Math.PI) / 3]}>
          <boxGeometry args={[0.1, 1.6, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.69, -0.4, 0.3]} rotation={[0, 0, (4 * Math.PI) / 3]}>
          <boxGeometry args={[0.1, 1.6, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
      {isActive && (
        <InfoPopup 
          title="Wind Turbine Array" 
          icon={<Wind size={18} />} 
          stats={[
            { label: 'Status', value: 'Generating', color: '#00ff88' },
            { label: 'Output', value: '0.9 MW' },
            { label: 'Wind Speed', value: '12 m/s' },
            { label: 'Efficiency', value: '92%' }
          ]}
          onClose={(e) => { e.stopPropagation(); setActiveId(null); }}
        />
      )}
    </group>
  );
}

export function SolarPanel({ position, id, activeId, setActiveId }) {
  const isActive = activeId === id;
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : id); }}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color={isActive ? "#00d2ff" : "#112255"} emissive={isActive ? "#00d2ff" : "#000"} emissiveIntensity={0.5} />
      </mesh>
      {isActive && (
        <InfoPopup 
          title="Solar PV Array" 
          icon={<Sun size={18} />} 
          stats={[
            { label: 'Status', value: 'Peak Sun Hours', color: '#ffc107' },
            { label: 'Output', value: '1.2 MW' },
            { label: 'Irradiance', value: '850 W/m²' }
          ]}
          onClose={(e) => { e.stopPropagation(); setActiveId(null); }}
        />
      )}
    </group>
  );
}

export function House({ position, color = "#4b7bec", name, powerStatus, id, activeId, setActiveId }) {
  const isActive = activeId === id;
  const isCritical = powerStatus === 'Protected';
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : id); }}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={isActive ? '#00ff88' : color} emissive={isActive ? '#00ff88' : '#000'} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 1.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1, 0.6, 4]} />
        <meshStandardMaterial color="#3867d6" />
      </mesh>
      {isActive && (
        <InfoPopup 
          title={name} 
          icon={<Home size={18} />} 
          stats={[
            { label: 'Grid Status', value: powerStatus, color: isCritical ? '#ffc107' : '#00ff88' },
            { label: 'Current Demand', value: isCritical ? '240 kW' : '45 kW' },
            { label: 'Feeder', value: isCritical ? 'Feeder A' : 'Feeder B' },
            { label: 'Demand Response', value: isCritical ? 'Opt-Out' : 'Active' }
          ]}
          onClose={(e) => { e.stopPropagation(); setActiveId(null); }}
        />
      )}
    </group>
  );
}

export function BatteryStorage({ position, charge, id, activeId, setActiveId }) {
  const isActive = activeId === id;
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : id); }}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1.2, 1]} />
        <meshStandardMaterial color={isActive ? "#00ff88" : "#333"} emissive={isActive ? "#00ff88" : "#000"} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0.51]}>
        <planeGeometry args={[1.8, 1]} />
        <meshBasicMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.5, 0.52]}>
        <planeGeometry args={[(1.6 * charge) / 100, 0.8]} />
        <meshBasicMaterial color={charge > 20 ? "#00ff88" : "#ff4b4b"} />
      </mesh>
      {isActive && (
        <InfoPopup 
          title="Community Storage" 
          icon={<Zap size={18} />} 
          stats={[
            { label: 'State of Charge', value: `${charge}%`, color: '#00ff88' },
            { label: 'Total Capacity', value: '1.0 MWh' },
            { label: 'Discharge Rate', value: '0 kW (Standby)' }
          ]}
          onClose={(e) => { e.stopPropagation(); setActiveId(null); }}
        />
      )}
    </group>
  );
}

export default function ThreeScene({ batteryLevel = 85 }) {
  const [activeId, setActiveId] = useState(null);

  // Deselect when clicking the background grid
  const handleBackgroundClick = (e) => {
    setActiveId(null);
  };

  return (
    <group>
      {/* Grid Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow onClick={handleBackgroundClick}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#1a2538" />
        <gridHelper args={[16, 16, '#00ff88', '#223344']} rotation={[Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Elements */}
      <WindTurbine id="wt1" activeId={activeId} setActiveId={setActiveId} position={[-4, 0, -4]} speed={0.05} />
      <WindTurbine id="wt2" activeId={activeId} setActiveId={setActiveId} position={[-6, 0, -2]} speed={0.07} />
      
      <SolarPanel id="sp1" activeId={activeId} setActiveId={setActiveId} position={[4, 0, -4]} />
      <SolarPanel id="sp2" activeId={activeId} setActiveId={setActiveId} position={[6, 0, -4]} />
      <SolarPanel id="sp3" activeId={activeId} setActiveId={setActiveId} position={[4, 0, -2]} />
      <SolarPanel id="sp4" activeId={activeId} setActiveId={setActiveId} position={[6, 0, -2]} />

      <BatteryStorage id="batt1" activeId={activeId} setActiveId={setActiveId} position={[0, 0, -2]} charge={batteryLevel} />

      <House id="h1" activeId={activeId} setActiveId={setActiveId} position={[-3, 0, 4]} name="Hospital" powerStatus="Protected" color="#eb3b5a" />
      <House id="h2" activeId={activeId} setActiveId={setActiveId} position={[0, 0, 4]} name="Residential Block A" powerStatus="Shifted" color="#2bcbba" />
      <House id="h3" activeId={activeId} setActiveId={setActiveId} position={[3, 0, 4]} name="Commercial District" powerStatus="Normal" color="#4b7bec" />
      <House id="h4" activeId={activeId} setActiveId={setActiveId} position={[-1.5, 0, 6]} name="Street Lighting" powerStatus="Dimmed" color="#a55eea" />
      <House id="h5" activeId={activeId} setActiveId={setActiveId} position={[1.5, 0, 6]} name="Residential Block B" powerStatus="Normal" color="#2bcbba" />
    </group>
  );
}
