document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('signalCanvas').getContext('2d');
    const startButton = document.getElementById('start');

    let socket;
    let chart;

    // Chart.js grafik oluşturma fonksiyonu
    function createChart() {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 100 }, (_, i) => i), // 0'dan 99'a kadar etiketler
                datasets: [{
                    label: 'Analog Signal',
                    data: Array.from({ length: 100 }, () => Math.random() * 10 - 5), // -5 ile 5 arasında rastgele veriler
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        min: -5,  // Y ekseni minimum değeri
                        max: 5    // Y ekseni maksimum değeri
                    }
                }
            }
        });
    }

    // Grafik güncelleme fonksiyonu
    function updateChart(data) {
        console.log('Updating chart with data:', data); // Veriyi konsola loglayın
        chart.data.labels = data.map((_, index) => index);
        chart.data.datasets[0].data = data;
        chart.update();
    }

    // WebSocket ile veri alımı
    function initializeWebSocket() {
        socket = new WebSocket('ws://localhost:8000');

        socket.onmessage = function(event) {
            const signalData = JSON.parse(event.data);
            console.log('Received data:', signalData); // Gelen veriyi loglayın
            updateChart(signalData);
        };

        socket.onopen = function() {
            console.log('WebSocket connection opened');
        };

        socket.onclose = function() {
            console.log('WebSocket connection closed');
        };

        socket.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
    }

    // Emülasyonu başlatma fonksiyonu
    function startEmulation() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('Sending start message to server');
            socket.send('start');
        } else {
            console.log('WebSocket is not open');
        }
    }

    // Sayfa yüklendiğinde WebSocket bağlantısını başlat ve Chart.js grafiğini oluştur
    initializeWebSocket();
    createChart();

    // Başlat butonuna tıklama olayı
    startButton.addEventListener('click', startEmulation);
});
