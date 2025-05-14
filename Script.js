const apiKey = '62387946a0d9f75cf89a0fd34a44607f';
const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const infoDiv = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  // reset UI
  infoDiv.classList.add('hidden');
  errorMsg.classList.add('hidden');
  try {
    const data = await fetchWeather(city);
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  }
});

async function fetchWeather(city) {
  const endpoint = `https://api.openweathermap.org/data/3.0/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error('City not found or network error');
  }
  return res.json();
}

function displayWeather(data) {
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temp').textContent = Math.round(data.main.temp);
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = data.main.humidity;
  infoDiv.classList.remove('hidden');
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove('hidden');
}
// after displayWeather(data) ends, add:
function displayWeather(data) {
    // …existing DOM updates for current weather…
  
    // then fetch & show forecast
    fetchForecast(data.coord.lat, data.coord.lon);
  }
  
  // New: fetch 5‑day forecast via One Call
  async function fetchForecast(lat, lon) {
    const endpoint = `https://api.openweathermap.org/data/2.5/onecall`
      + `?lat=${lat}&lon=${lon}`
      + `&exclude=current,minutely,hourly,alerts`
      + `&units=metric`
      + `&appid=${apiKey}`;
  
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn('Forecast fetch failed');
      return;
    }
    const payload = await res.json();
    displayForecast(payload.daily);
  }
  
  // New: render the next 5 days
  function displayForecast(dailyData) {
    const fcDiv = document.getElementById('forecast');
    fcDiv.innerHTML = '';                // clear old
    // dailyData[0] is today; so take days 1–5
    dailyData.slice(1, 6).forEach(day => {
      const date = new Date(day.dt * 1000)
        .toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
  
      const iconCode = day.weather[0].icon;
      const desc     = day.weather[0].description;
      const maxTemp  = Math.round(day.temp.max);
      const minTemp  = Math.round(day.temp.min);
  
      // build card
      const card = document.createElement('div');
      card.className = 'forecast-day';
      card.innerHTML = `
        <h3>${date}</h3>
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
             alt="${desc}" />
        <p>${desc}</p>
        <p>↑ ${maxTemp}°C  ↓ ${minTemp}°C</p>
      `;
      fcDiv.appendChild(card);
    });
  
    // show the container
    fcDiv.classList.remove('hidden');
  }
  