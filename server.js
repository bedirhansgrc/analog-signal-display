const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 8000;

// Statik dosyaları sunma
app.use(express.static(path.join(__dirname, 'public')));

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    const msg = JSON.parse(message);
    if (msg.action === 'emulate') {
      // Generate random signals and send them
      const data = generateRandomSignals(); // Assume this function exists
      ws.send(JSON.stringify(data));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Function to generate random signals (you can adjust the logic as needed)
function generateRandomSignals() {
  const length = 100;
  const data = [];
  for (let i = 0; i < length; i++) {
    const value = Math.random() * 10 - 5; // Generates a random value between -5 and 5
    data.push(parseFloat(value.toFixed(8)));
  }
  console.log('Generated random signals:', data);
  return data;
}

// Sinüs dalgası verisi oluşturma fonksiyonu (gerekirse kullanılabilir)
function generateSineWaveData() {
  const length = 100;
  const data = [];
  const frequency = 0.1; // Frekans değeri
  for (let i = 0; i < length; i++) {
    const value = Math.sin(2 * Math.PI * frequency * i);
    data.push(parseFloat(value.toFixed(8)));
  }
  console.log('Generated sine wave data:', data); // Veri loglaması
  return data;
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
