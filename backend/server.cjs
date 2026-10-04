const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mock Database for the Backend
const demandData = [
  { time: '00:00', supply: 4000, demand: 2400 },
  { time: '04:00', supply: 3000, demand: 1398 },
  { time: '08:00', supply: 2000, demand: 5800 },
  { time: '12:00', supply: 8780, demand: 3908 },
  { time: '16:00', supply: 1890, demand: 4800 },
  { time: '20:00', supply: 2390, demand: 3800 },
  { time: '24:00', supply: 3490, demand: 4300 },
];

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

app.listen(port, () => {
  console.log(`GridSync Backend server running on http://localhost:${port}`);
});
