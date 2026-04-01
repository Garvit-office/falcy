const plant = document.querySelector('.plant');
const weatherSelect = document.getElementById('weatherSelect');
const body = document.body;
let growth = 0;

function setGrowth(l) {
  growth = Math.max(0, Math.min(3, l));
  plant.classList.remove('grown-1','grown-2','grown-3');
  if (growth >= 1) plant.classList.add('grown-1');
  if (growth >= 2) plant.classList.add('grown-2');
  if (growth >= 3) plant.classList.add('grown-3');
}

function setWeather(m) {
  body.classList.remove('weather--sunny','weather--cloudy','weather--rainy','weather--night');
  body.classList.add(`weather--${m}`);
  document.querySelector('.rain').style.opacity = m === 'rainy' ? 1 : 0;
}

// Controls
document.getElementById('btnWater').addEventListener('click',()=>setGrowth(growth+1));
document.getElementById('btnFertilizer').addEventListener('click',()=>setGrowth(growth+2));
document.getElementById('btnReset').addEventListener('click',()=>setGrowth(0));
weatherSelect.addEventListener('change',()=>setWeather(weatherSelect.value));

// 🌍 Detect real weather outside
async function detectWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const apiKey = "YOUR_API_KEY"; // replace with your OpenWeatherMap key
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const condition = data.weather[0].main.toLowerCase();

        let weatherMode = "sunny";
        if (condition.includes("cloud")) weatherMode = "cloudy";
        else if (condition.includes("rain")) weatherMode = "rainy";
        else if (condition.includes("storm") || condition.includes("thunder")) weatherMode = "rainy";

        const currentTime = Date.now() / 1000; 
        if (currentTime < data.sys.sunrise || currentTime > data.sys.sunset) {
          weatherMode = "night";
        }

        setWeather(weatherMode);
        weatherSelect.value = weatherMode;
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    });
  }
}
5
// Init
setGrowth(1);
setWeather("sunny");
document.getElementById('year').textContent=new Date().getFullYear();
detectWeather(); // auto-set weather
