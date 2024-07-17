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

  let interval;

  ws.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    if (message === 'start') {
      console.log('Starting emulation');
      clearInterval(interval); // Eski interval varsa temizle
      interval = setInterval(() => {
        const signalData = generateSineWaveData();
        console.log('Generated signal data:', signalData);
        ws.send(JSON.stringify(signalData), (err) => {
          if (err) {
            console.error('Error sending data:', err);
          } else {
            console.log('Data sent successfully');
          }
        });
      }, 3000);
    } else if (message === 'stop') {
      console.log('Stopping emulation');
      clearInterval(interval);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

// Sinüs dalgası verisi oluşturma fonksiyonu
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
