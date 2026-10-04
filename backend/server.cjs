const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Dynamic state variables
let batteryLevel = 85;
let baseDemand = 4000;
let baseSupply = 4500;
let feederStressA = 92;
let feederStressB = 45;

const nodesData = [
  { id: 1, name: 'Hospital', type: 'critical', x: 2, y: 1 },
  { id: 2, name: 'Solar Farm Array', type: 'producer', x: 5, y: 2 },
  { id: 3, name: 'Residential Block A', type: 'consumer', x: 3, y: 4 },
];

let globalSettings = {
  autoDemandResponse: true,
  p2pTrading: true,
  telemetryRate: '1s',
  alertThreshold: '90',
};

// Helper for random variation
const vary = (val, maxDelta) => val + (Math.random() * maxDelta * 2 - maxDelta);

app.get('/api/grid-status', (req, res) => {
  batteryLevel = vary(batteryLevel, 0.5);
  batteryLevel = Math.max(0, Math.min(100, batteryLevel));
  
  res.json({
    batteryLevel: parseFloat(batteryLevel.toFixed(1)),
    solarGeneration: parseFloat(vary(4.2, 0.3).toFixed(2)),
    windGeneration: parseFloat(vary(1.8, 0.2).toFixed(2)),
    demand: parseFloat(vary(5.1, 0.4).toFixed(2)),
    status: batteryLevel < 20 ? 'Critical' : 'Stable'
  });
});

app.get('/api/demand-forecast', (req, res) => {
  const timeStr = (h) => `${h.toString().padStart(2, '0')}:00`;
  const data = Array.from({ length: 7 }).map((_, i) => ({
    time: timeStr(i * 4),
    supply: Math.round(vary(baseSupply, 1000)),
    demand: Math.round(vary(baseDemand, 1200))
  }));
  res.json(data);
});

app.post('/api/trigger-response', (req, res) => {
  feederStressA = vary(60, 5); // Dramatically reduce stress
  res.json({ success: true, message: 'Demand response protocols initiated.' });
});

app.get('/api/storage', (req, res) => {
  res.json({
    capacity: '1.5 MWh',
    currentCharge: parseFloat(batteryLevel.toFixed(1)),
    status: batteryLevel > 50 ? 'Discharging' : 'Charging',
    dischargeRate: parseFloat(vary(250, 50).toFixed(0)) + ' kW',
    health: '98%',
    cycles: 124
  });
});

app.get('/api/community/nodes', (req, res) => {
  res.json(nodesData);
});

app.post('/api/community/nodes', (req, res) => {
  const newNode = req.body;
  nodesData.push(newNode);
  res.json({ success: true, node: newNode });
});

app.get('/api/discom', (req, res) => {
  feederStressA = Math.max(0, Math.min(100, vary(feederStressA, 2)));
  feederStressB = Math.max(0, Math.min(100, vary(feederStressB, 2)));
  
  res.json({
    feederA: { stress: Math.round(feederStressA), voltage: feederStressA > 90 ? '235V (Warning)' : '240V (Stable)' },
    feederB: { stress: Math.round(feederStressB), voltage: '240V (Stable)' },
    violations: feederStressA > 90 ? Math.floor(Math.random() * 3) : 0
  });
});

app.get('/api/load', (req, res) => {
  res.json({
    sheddingActive: feederStressA < 80, // Will be true if trigger was pressed recently
    criticalLoad: parseFloat(vary(1.2, 0.1).toFixed(2)) + ' MW',
    flexibleLoad: Math.round(vary(800, 50)) + ' kW'
  });
});

app.get('/api/settings', (req, res) => res.json(globalSettings));
app.post('/api/settings', (req, res) => {
  globalSettings = { ...globalSettings, ...req.body };
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`GridSync Backend server running on http://localhost:${port}`);
});
