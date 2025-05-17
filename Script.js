const apiKey = '62387946a0d9f75cf89a0fd34a44607f';
const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const infoDiv = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');
const aqiDiv = document.getElementById('air-quality');
const aqiSpan = document.getElementById('aqi');
const forecastDiv = document.getElementById('forecast');
const chartContainer = document.getElementById('chart-container');

let forecastChart;  // will hold our Chart.js instance

document.getElementById('city-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = document.getElementById('city-input').value;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();

        // Update weather information
        document.getElementById('location').textContent = data.name;
        document.getElementById('temp').textContent = data.main.temp;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity;

        // Update coordinates
        document.getElementById('latitude').textContent = data.coord.lat;
        document.getElementById('longitude').textContent = data.coord.lon;

        // Show the weather info section
        document.getElementById('weather-info').classList.remove('hidden');

        // Fetch and display the 5-day forecast
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        document.getElementById('error-msg').textContent = error.message;
        document.getElementById('error-msg').classList.remove('hidden');
    }
});

async function fetchForecast(lat, lon) {
    const endpoint = `https://api.openweathermap.org/data/2.5/onecall`
        + `?lat=${lat}&lon=${lon}`
        + `&exclude=current,minutely,hourly,alerts`
        + `&units=metric`
        + `&appid=${apiKey}`;

    const response = await fetch(endpoint);
    if (!response.ok) {
        console.warn('Failed to fetch forecast data');
        return;
    }

    const data = await response.json();
    displayForecast(data.daily);
}

// 1st fetch: current weather
async function fetchWeather(city) {
  const endpoint = 
    `https://api.openweathermap.org/data/2.5/weather`
    + `?q=${encodeURIComponent(city)}`
    + `&units=metric`
    + `&appid=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Error ${res.status}`);
  }
  return res.json();
}

function displayWeather(data) {
  document.getElementById('location').textContent    = `${data.name}, ${data.sys.country}`;
  document.getElementById('temp').textContent        = Math.round(data.main.temp);
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent    = data.main.humidity;
  infoDiv.classList.remove('hidden');

  // 2nd fetch: 5‑day forecast
  fetchForecast(data.coord.lat, data.coord.lon);
}

// 2nd fetch: One Call API for forecast
async function fetchForecast(lat, lon) {
  const endpoint = `https://api.openweathermap.org/data/2.5/onecall`
    + `?lat=${lat}&lon=${lon}`
    + `&exclude=current,minutely,hourly,alerts`
    + `&units=metric`
    + `&appid=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) return console.warn('Forecast fetch failed');
  const payload = await res.json();
  displayForecast(payload.daily);
}

// Render forecast cards AND Chart.js line chart
function displayForecast(dailyData) {
  forecastDiv.innerHTML = '';
  const labels = [], maxTemps = [], minTemps = [];

  // take days 1–5 (skip today at index 0)
  dailyData.slice(1, 6).forEach(day => {
    const date = new Date(day.dt * 1000)
      .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const iconCode = day.weather[0].icon;
    const desc     = day.weather[0].description;
    const maxTemp  = Math.round(day.temp.max);
    const minTemp  = Math.round(day.temp.min);

    labels.push(date);
    maxTemps.push(maxTemp);
    minTemps.push(minTemp);

    const card = document.createElement('div');
    card.className = 'forecast-day';
    card.innerHTML = `
      <h3>${date}</h3>
      <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${desc}" />
      <p>${desc}</p>
      <p>↑ ${maxTemp}°C  ↓ ${minTemp}°C</p>
    `;
    forecastDiv.appendChild(card);
  });

  forecastDiv.classList.remove('hidden');
  chartContainer.classList.remove('hidden');
  renderChart(labels, maxTemps, minTemps);
}

// Chart.js setup
function renderChart(labels, maxData, minData) {
  const ctx = document.getElementById('forecastChart').getContext('2d');
  if (forecastChart) forecastChart.destroy();
  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Max Temp (°C)', data: maxData, tension: 0.4 },
        { label: 'Min Temp (°C)', data: minData, tension: 0.4 }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// 3rd fetch: Air Pollution API
async function fetchAirQuality(lat, lon) {
  const endpoint = 
    `https://api.openweathermap.org/data/2.5/air_pollution`
    + `?lat=${lat}&lon=${lon}`
    + `&appid=${apiKey}`;

  const res = await fetch(endpoint);
  if (!res.ok) return console.warn('Air Quality fetch failed');
  const payload = await res.json();
  displayAirQuality(payload);
}

function displayAirQuality(data) {
  const aqi = data.list[0].main.aqi; 
  const descs = ['Good','Fair','Moderate','Poor','Very Poor'];
  aqiSpan.textContent = `${aqi} (${descs[aqi-1]})`;
  aqiDiv.classList.remove('hidden');
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}