document.addEventListener('DOMContentLoaded', function() {
    initializeWebSocket();
    createChart();

    // Auto Scale butonuna tıklama olayı
    const autoScaleButton = document.getElementById('autoScale');
    autoScaleButton.addEventListener('click', toggleAutoScale);
});

let socket;
let chart;
let isAutoScale = false; // Auto Scale durumunu takip eder

// Chart.js grafik oluşturma fonksiyonu
function createChart() {
    const ctx = document.getElementById('signalCanvas').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Zaman etiketleri başlangıçta boş
            datasets: [{
                label: 'Analog Signal',
                data: [], // Başlangıçta boş veri seti
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

    // Auto Scale açıksa, min ve max değerlerini otomatik olarak ayarla
    if (isAutoScale) {
        const minY = Math.min(...data);
        const maxY = Math.max(...data);
        chart.options.scales.y.min = minY;
        chart.options.scales.y.max = maxY;
    } else {
        chart.options.scales.y.min = -5;
        chart.options.scales.y.max = 5;
    }

    chart.update();
}

// WebSocket ile veri alımı ve bağlantı başlatma
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

// Auto Scale butonuna tıklama olayı
function toggleAutoScale() {
    isAutoScale = !isAutoScale;
    console.log('Auto Scale:', isAutoScale);
    // Mevcut verilerle grafiği yeniden çiz
    updateChart(chart.data.datasets[0].data);
}
