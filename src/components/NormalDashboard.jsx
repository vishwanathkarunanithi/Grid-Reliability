import React, { useState } from 'react';
import { Battery, Zap, AlertTriangle, Wind, Sun, Home, Server, Activity, Settings, CloudRain, Cpu } from 'lucide-react';
import MainDashboard from './MainDashboard';
import StorageView from './StorageView';
import CommunityView from './CommunityView';
import DiscomView from './DiscomView';
import LoadManagementView from './LoadManagementView';
import ForecastingView from './ForecastingView';
import '../App.css';

export default function NormalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <MainDashboard />;
      case 'storage': return <StorageView />;
      case 'community': return <CommunityView />;
      case 'discom': return <DiscomView />;
      case 'load': return <LoadManagementView />;
      case 'forecast': return <ForecastingView />;
      case 'settings': return <div className="glass" style={{padding: '2rem'}}><h2>Settings module coming soon...</h2></div>;
      default: return <MainDashboard />;
    }
  };

  return (
    <div className="app-container" style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#0b0f19', backgroundImage: 'radial-gradient(at 0% 0%, rgba(0, 255, 136, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 210, 255, 0.1) 0px, transparent 50%)' }}>
      <nav className="sidebar glass" style={{ height: '100%', borderRadius: 0, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3rem', width: '250px' }}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Zap size={32} color="#00ff88" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>GridSync</h1>
        </div>
        <ul className="nav-links" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { id: 'dashboard', icon: <Activity size={20}/>, label: 'Dashboard' },
            { id: 'storage', icon: <Battery size={20}/>, label: 'Storage Systems' },
            { id: 'community', icon: <Home size={20}/>, label: 'Community P2P' },
            { id: 'discom', icon: <Server size={20}/>, label: 'DISCOM Sync' },
            { id: 'load', icon: <Cpu size={20}/>, label: 'Load Management' },
            { id: 'forecast', icon: <CloudRain size={20}/>, label: 'Forecasting' },
            { id: 'settings', icon: <Settings size={20}/>, label: 'Settings' }
          ].map(tab => (
            <li 
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''} 
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#8892b0',
                transition: 'all 0.3s'
              }}
            >
              {tab.icon} {tab.label}
            </li>
          ))}
        </ul>
      </nav>

      <main className="main-content" style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto' }}>
        <header className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
            {activeTab === 'dashboard' && 'Microgrid Operations Overview'}
            {activeTab === 'storage' && 'Distributed Storage Network'}
            {activeTab === 'community' && 'Peer-to-Peer Energy Sharing'}
            {activeTab === 'discom' && 'DISCOM Feeder Analytics'}
            {activeTab === 'load' && 'Smart Demand Response'}
            {activeTab === 'forecast' && 'AI Weather & Generation Forecasting'}
            {activeTab === 'settings' && 'System Configuration'}
          </h2>
          <div className="status-badge stable" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 500, background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
            <AlertTriangle size={16} />
            <span>Grid Node: Active</span>
          </div>
        </header>
        
        <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
