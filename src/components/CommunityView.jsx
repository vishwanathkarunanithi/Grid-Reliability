import React, { useState, useEffect } from 'react';
import { Network, ArrowRightLeft, DollarSign, Download, Zap, Leaf, Map as MapIcon, RefreshCw, Activity } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import ConfirmModal from './ConfirmModal';

// Fix for default leaflet icons not showing in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function CommunityView() {
  const [transactions, setTransactions] = useState([
    { id: 'tx-1', from: 'Solar Farm Alpha', to: 'Hospital Block', amount: 150, rate: 0.12, timestamp: '14:32:45' },
    { id: 'tx-2', from: 'Residential Grid 3', to: 'EV Charging Hub', amount: 45, rate: 0.11, timestamp: '14:31:12' },
    { id: 'tx-3', from: 'Wind Park North', to: 'Data Center', amount: 320, rate: 0.10, timestamp: '14:28:50' },
    { id: 'tx-4', from: 'Storage Hub Beta', to: 'Commercial Sector', amount: 85, rate: 0.14, timestamp: '14:25:33' }
  ]);

  const [mapNodes] = useState([
    { id: 1, name: "Solar Farm Alpha", role: "Producer", lat: 13.0827, lng: 80.2707, power: "+1.2 MW" },
    { id: 2, name: "Hospital Block", role: "Consumer", lat: 13.0850, lng: 80.2750, power: "-450 kW" },
    { id: 3, name: "Wind Park North", role: "Producer", lat: 13.0900, lng: 80.2650, power: "+2.5 MW" },
    { id: 4, name: "Storage Hub Beta", role: "Prosumer", lat: 13.0780, lng: 80.2720, power: "Standby" },
  ]);

  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = {
        id: `tx-${Math.floor(Math.random() * 10000)}`,
        from: mapNodes[Math.floor(Math.random() * mapNodes.length)].name,
        to: ['EV Hub', 'Data Center', 'Res Block', 'Hospital'][Math.floor(Math.random() * 4)],
        amount: Math.floor(Math.random() * 200) + 10,
        rate: +(0.10 + Math.random() * 0.05).toFixed(2),
        timestamp: new Date().toLocaleTimeString()
      };
      setTransactions(prev => [newTx, ...prev].slice(0, 8));
    }, 4500);
    return () => clearInterval(interval);
  }, [mapNodes]);

  const exportCSV = () => {
    setModalConfig({
      title: 'Export Ledger',
      message: 'Are you sure you want to download the recent P2P blockchain ledger as a CSV file?',
      action: () => {
        const header = "ID,From,To,Amount(kW),Rate($/kWh),Timestamp\n";
        const csv = transactions.map(t => `${t.id},${t.from},${t.to},${t.amount},${t.rate},${t.timestamp}`).join('\n');
        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'p2p_ledger_export.csv';
        a.click();
      }
    });
  };

  const forceMarketClear = () => {
    setModalConfig({
      title: 'Force Market Clear',
      message: 'This will forcefully settle all pending P2P energy trades immediately. Proceed?',
      highlightArea: 'ledger-list',
      action: () => {
        // Flash empty and rebuild
        setTransactions([]);
        setTimeout(() => {
          setTransactions([
            { id: 'sys-clear', from: 'Market Maker', to: 'System', amount: 0, rate: 0, timestamp: new Date().toLocaleTimeString() }
          ]);
        }, 500);
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      {/* Top Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.2)', padding: '15px', borderRadius: '50%' }}><DollarSign color="#00ff88"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Spot Market Rate</p><h2 style={{ margin: 0, color: '#fff' }}>$0.12 <span style={{fontSize:'1rem', color:'#888'}}>/kWh</span></h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(0, 210, 255, 0.2)', padding: '15px', borderRadius: '50%' }}><ArrowRightLeft color="#00d2ff"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>24h Volume</p><h2 style={{ margin: 0, color: '#fff' }}>14.2 MWh</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(255, 193, 7, 0.2)', padding: '15px', borderRadius: '50%' }}><Network color="#ffc107"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>Active Nodes</p><h2 style={{ margin: 0, color: '#fff' }}>42</h2></div>
        </div>
        <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'rgba(170, 170, 170, 0.2)', padding: '15px', borderRadius: '50%' }}><Leaf color="#aaa"/></div>
          <div><p style={{ margin: 0, color: '#ccc' }}>CO2 Offset</p><h2 style={{ margin: 0, color: '#fff' }}>8.5 Tons</h2></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '20px', flex: 1, minHeight: '400px' }}>
        
        {/* Real Geographic Map */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#00d2ff', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}><MapIcon size={20}/> Real-Time Node Map (Geographic)</h3>
          
          <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
            <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {mapNodes.map(node => (
                <div key={node.id}>
                  <Marker position={[node.lat, node.lng]}>
                    <Popup>
                      <strong style={{ color: '#000' }}>{node.name}</strong><br/>
                      Role: {node.role}<br/>
                      Output: <span style={{ color: node.role === 'Consumer' ? 'red' : 'green' }}>{node.power}</span>
                    </Popup>
                  </Marker>
                  <Circle center={[node.lat, node.lng]} pathOptions={{ color: node.role === 'Consumer' ? 'red' : '#00ff88', fillColor: node.role === 'Consumer' ? 'red' : '#00ff88' }} radius={400} />
                </div>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Live Transaction Ledger */}
        <div className="glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff88', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={20}/> Live P2P Ledger</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={forceMarketClear} title="Force settle all transactions." className="action-btn" style={{ padding: '8px 12px', background: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', border: '1px solid #ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <RefreshCw size={14}/> Settle
              </button>
              <button onClick={exportCSV} title="Download Ledger Data as CSV" className="action-btn" style={{ padding: '8px 12px', background: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff', border: '1px solid #00d2ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Download size={14}/> Export
              </button>
            </div>
          </div>
          
          <div id="ledger-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {transactions.map((tx) => (
              <div key={tx.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid #00ff88', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>TX: {tx.id} | {tx.timestamp}</span>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{tx.amount} kW</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.9rem' }}>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{tx.from}</span>
                  <ArrowRightLeft size={14} color="#888" />
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{tx.to}</span>
                </div>
                <div style={{ color: '#00d2ff', fontSize: '0.8rem', textAlign: 'right' }}>
                  Rate: ${tx.rate}/kWh
                </div>
              </div>
            ))}
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
