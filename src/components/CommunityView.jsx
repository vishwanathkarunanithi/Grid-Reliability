import React, { useState } from 'react';
import { Home, Zap, Map as MapIcon, Plus, X, Server } from 'lucide-react';

export default function CommunityView() {
  const [showMap, setShowMap] = useState(false);
  const [nodes, setNodes] = useState([
    { id: 1, name: 'Hospital', type: 'critical', x: 2, y: 1 },
    { id: 2, name: 'Solar Farm Array', type: 'producer', x: 5, y: 2 },
    { id: 3, name: 'Residential Block A', type: 'consumer', x: 3, y: 4 },
  ]);

  const handleMapClick = (x, y) => {
    // If empty plot clicked, add a new community house
    if (!nodes.find(n => n.x === x && n.y === y)) {
      setNodes([...nodes, { 
        id: Date.now(), 
        name: `New Prosumer Home ${nodes.length + 1}`, 
        type: 'consumer', 
        x, 
        y 
      }]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      
      {/* Top Bar with Map Button */}
      <div className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 210, 255, 0.1)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Peer-to-Peer Energy Network</h2>
          <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Manage local energy sharing and add new houses to the microgrid map.</p>
        </div>
        <button 
          onClick={() => setShowMap(true)} 
          style={{ background: '#00ff88', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(0,255,136,0.3)' }}
        >
          <MapIcon size={20} /> Open Geographic Map
        </button>
      </div>

      {/* Connected Nodes List */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {nodes.map(node => (
          <div key={node.id} className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {node.type === 'producer' ? <Zap color="#ffc107" /> : node.type === 'critical' ? <Server color="#eb3b5a" /> : <Home color="#00d2ff" />}
              {node.name}
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '5px' }}>
                <span>Status:</span>
                <span style={{ color: '#00ff88' }}>Grid Synced</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc' }}>
                <span>Energy Role:</span>
                <span style={{ color: '#fff', textTransform: 'capitalize' }}>{node.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map Modal */}
      {showMap && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5, 10, 25, 0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div className="glass" style={{ width: '85vw', height: '85vh', background: '#0b0f19', padding: '30px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0, 255, 136, 0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ color: '#00ff88', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapIcon size={28}/> Interactive City Grid Map
                </h2>
                <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Click on any empty plot to dynamically construct a new house and connect it to the grid.</p>
              </div>
              <button 
                onClick={() => setShowMap(false)} 
                style={{ background: 'rgba(235, 59, 90, 0.2)', border: '1px solid #eb3b5a', color: '#eb3b5a', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
              >
                <X size={18}/> Close Map
              </button>
            </div>
            
            <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '4px', background: '#111827', padding: '10px', overflow: 'hidden' }}>
              {Array.from({ length: 60 }).map((_, i) => {
                const x = i % 10;
                const y = Math.floor(i / 10);
                const node = nodes.find(n => n.x === x && n.y === y);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => handleMapClick(x, y)}
                    style={{ 
                      background: node ? (node.type === 'producer' ? 'rgba(255, 193, 7, 0.2)' : node.type === 'critical' ? 'rgba(235, 59, 90, 0.2)' : 'rgba(0, 210, 255, 0.2)') : '#1f2937', 
                      border: node ? `2px solid ${node.type === 'producer' ? '#ffc107' : node.type === 'critical' ? '#eb3b5a' : '#00d2ff'}` : '1px dashed #374151',
                      borderRadius: '8px',
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {node ? (
                      <div style={{ textAlign: 'center' }}>
                        {node.type === 'producer' ? <Zap color="#ffc107" size={24} /> : node.type === 'critical' ? <Server color="#eb3b5a" size={24} /> : <Home color="#00d2ff" size={24} />}
                        <div style={{ fontSize: '10px', color: '#fff', marginTop: '4px', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {node.name}
                        </div>
                      </div>
                    ) : (
                      <Plus color="#4b5563" size={24} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
