const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock Data
const demandData = [
  { time: '00:00', supply: 4000, demand: 2400 },
  { time: '04:00', supply: 3000, demand: 1398 },
  { time: '08:00', supply: 2000, demand: 5800 },
  { time: '12:00', supply: 8780, demand: 3908 },
  { time: '16:00', supply: 1890, demand: 4800 },
  { time: '20:00', supply: 2390, demand: 3800 },
  { time: '24:00', supply: 3490, demand: 4300 },
];

const nodesData = [
  { id: 1, name: 'Hospital', type: 'critical', x: 2, y: 1 },
  { id: 2, name: 'Solar Farm Array', type: 'producer', x: 5, y: 2 },
  { id: 3, name: 'Residential Block A', type: 'consumer', x: 3, y: 4 },
];

// Endpoints
app.get('/api/grid-status', (req, res) => {
  res.json({
    batteryLevel: 85,
    solarGeneration: 4.2,
    windGeneration: 1.8,
    demand: 5.1,
    status: 'Stable'
  });
});

app.get('/api/demand-forecast', (req, res) => {
  res.json(demandData);
});

app.post('/api/trigger-response', (req, res) => {
  console.log("Demand response triggered from dashboard!");
  res.json({ success: true, message: 'Demand response protocols initiated.' });
});

// New Endpoints for Advanced Tabs
app.get('/api/storage', (req, res) => {
  res.json({
    capacity: '1.5 MWh',
    currentCharge: 85,
    status: 'Charging',
    dischargeRate: '0 kW',
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
  res.json({
    feederA: { stress: 92, voltage: '235V (Warning)' },
    feederB: { stress: 45, voltage: '240V (Stable)' },
    violations: 2
  });
});

app.get('/api/load', (req, res) => {
  res.json({
    sheddingActive: false,
    criticalLoad: '1.2 MW',
    flexibleLoad: '800 kW'
  });
});

app.listen(port, () => {
  console.log(`GridSync Backend server running on http://localhost:${port}`);
});
