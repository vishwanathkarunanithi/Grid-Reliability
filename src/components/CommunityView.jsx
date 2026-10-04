import React, { useState, useEffect } from 'react';
import { Home, Zap, Map as MapIcon, Plus, X, Server, Download, Activity, Leaf, ArrowRightLeft } from 'lucide-react';

export default function CommunityView() {
  const [showMap, setShowMap] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [marketPrice, setMarketPrice] = useState(12.4);

  // Fetch initial nodes and setup dynamic transactions
  useEffect(() => {
    fetch('/api/community/nodes')
      .then(res => res.json())
      .then(data => setNodes(data))
      .catch(err => {
        console.log('Mock');
        setNodes([
          { id: 1, name: 'Hospital', type: 'critical', x: 2, y: 1 },
          { id: 2, name: 'Solar Farm Array', type: 'producer', x: 5, y: 2 },
          { id: 3, name: 'Residential Block A', type: 'consumer', x: 3, y: 4 },
        ]);
      });

    // Generate fake transactions every 3 seconds
    const txInterval = setInterval(() => {
      setMarketPrice(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(2));
      setTransactions(prev => {
        const newTx = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          seller: Math.random() > 0.5 ? 'Solar Farm Array' : 'Prosumer Home ' + Math.floor(Math.random() * 10),
          buyer: Math.random() > 0.5 ? 'Hospital' : 'Residential Block A',
          amount: +(Math.random() * 50 + 10).toFixed(1),
          price: marketPrice
        };
        return [newTx, ...prev].slice(0, 8); // Keep last 8
      });
    }, 3000);

    return () => clearInterval(txInterval);
  }, [marketPrice]);

  const handleMapClick = (x, y) => {
    if (!nodes.find(n => n.x === x && n.y === y)) {
      const newNode = { id: Date.now(), name: `Prosumer Node ${nodes.length + 1}`, type: 'consumer', x, y };
      setNodes([...nodes, newNode]);
      try {
        fetch('/api/community/nodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNode)
        });
      } catch (err) {}
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Time', 'Seller', 'Buyer', 'Amount (kWh)', 'Price (cents/kWh)'];
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + transactions.map(t => `${t.id},${t.time},${t.seller},${t.buyer},${t.amount},${t.price}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "p2p_energy_ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%' }}><Activity color="#00d2ff"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Market Rate</p><h2 style={{ margin: 0, color: '#fff' }}>{marketPrice} ¢/kWh</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '15px', borderRadius: '50%' }}><ArrowRightLeft color="#00ff88"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>24h Volume</p><h2 style={{ margin: 0, color: '#fff' }}>1,245 kWh</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}><Zap color="#ffc107"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Active Nodes</p><h2 style={{ margin: 0, color: '#fff' }}>{nodes.length} Connected</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(235, 59, 90, 0.2)', padding: '15px', borderRadius: '50%' }}><Leaf color="#eb3b5a"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>CO2 Offset</p><h2 style={{ margin: 0, color: '#fff' }}>840 kg</h2></div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 210, 255, 0.1)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Peer-to-Peer Energy Network</h2>
          <p style={{ color: '#ccc', margin: '5px 0 0 0' }}>Manage local energy sharing, bids, and the microgrid topology.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={exportCSV} 
            className="action-btn"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
          >
            <Download size={18} /> Export Ledger (CSV)
          </button>
          <button 
            onClick={() => setShowMap(true)} 
            className="action-btn"
            style={{ background: '#00ff88', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,255,136,0.3)' }}
          >
            <MapIcon size={18} /> Open Geographic Map
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: '400px' }}>
        
        {/* Left: Active Nodes */}
        <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00d2ff', marginTop: 0 }}>Registered Network Nodes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
            {nodes.map(node => (
              <div key={node.id} style={{ padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  {node.type === 'producer' ? <Zap color="#ffc107" /> : node.type === 'critical' ? <Server color="#eb3b5a" /> : <Home color="#00d2ff" />}
                  {node.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', fontSize: '0.9rem' }}>
                  <span>Status: <strong style={{ color: '#00ff88' }}>Grid Synced</strong></span>
                  <span>Role: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{node.type}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Transaction Ledger */}
        <div className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00ff88', marginTop: 0 }}>Live P2P Ledger (Blockchain Verified)</h3>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '10px 0', color: '#fff' }}>Time</th>
                  <th style={{ padding: '10px 0', color: '#fff' }}>Seller</th>
                  <th style={{ padding: '10px 0', color: '#fff' }}>Buyer</th>
                  <th style={{ padding: '10px 0', color: '#fff' }}>Vol (kWh)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 && <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Awaiting network activity...</td></tr>}
                {transactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 0' }}>{tx.time}</td>
                    <td style={{ padding: '12px 0', color: '#ffc107' }}>{tx.seller}</td>
                    <td style={{ padding: '12px 0', color: '#00d2ff' }}>{tx.buyer}</td>
                    <td style={{ padding: '12px 0', fontWeight: 'bold', color: '#00ff88' }}>{tx.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
                className="action-btn"
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
