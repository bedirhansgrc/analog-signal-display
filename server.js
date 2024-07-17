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

  let interval = setInterval(() => {
    const signalData = generateRandomSignalData();
    console.log('Generated signal data:', signalData);
    ws.send(JSON.stringify(signalData), (err) => {
      if (err) {
        console.error('Error sending data:', err);
      } else {
        console.log('Data sent successfully:', signalData);
      }
    });
  }, 3000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clearInterval(interval);
  });
});

// Rastgele sinyal verisi oluşturma fonksiyonu
function generateRandomSignalData() {
  const length = 100; // Veri uzunluğu
  const data = [];
  for (let i = 0; i < length; i++) {
    data.push(parseFloat((Math.random() * 10 - 5).toFixed(8))); // -5 ile 5 arasında rastgele float değer
  }
  console.log('Generated random signal data:', data); // Veri loglaması
  return data;
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
