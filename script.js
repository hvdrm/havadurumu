const apiKey = "ae49cf2d391e1c2f24a8cb3910ea3014";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const unitSelect = document.getElementById("unitSelect");
const toggleTheme = document.getElementById("toggle-theme");

const cityName = document.getElementById("cityName");
const icon = document.getElementById("icon");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const feels_like = document.getElementById("feels_like");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const forecastDiv = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

unitSelect.addEventListener("change", () => {
  const city = cityName.textContent;
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function getWeather(city) {
  const unit = unitSelect.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}&lang=tr`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      cityName.textContent = data.name;
      icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      description.textContent = data.weather[0].description;
      temp.textContent = `Sıcaklık: ${data.main.temp}°`;
      feels_like.textContent = `Hissedilen: ${data.main.feels_like}°`;
      wind.textContent = `Rüzgar: ${data.wind.speed} ${unit === "metric" ? "m/sn" : "mph"}`;
      humidity.textContent = `Nem: ${data.main.humidity}%`;
    })
    .catch(() => alert("Şehir bulunamadı."));
}

function getForecast(city) {
  const unit = unitSelect.value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}&lang=tr`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      

      const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

      dailyForecasts.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString("tr-TR");
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const description = item.weather[0].description;
        const temp = item.main.temp;

        forecastDiv.innerHTML += `
          <div class="forecast-day">
            <strong>${date}</strong><br/>
            <img src="${iconUrl}" alt="${description}"/><br/>
            ${description}, ${temp}°
          </div>
        `;
      });
    });
}


window.onload = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    const unit = unitSelect.value;
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=tr`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}&lang=tr`;


    fetch(currentUrl)
      .then(res => res.json())
      .then(data => {
        cityName.textContent = data.name;
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        description.textContent = data.weather[0].description;
        temp.textContent = `Sıcaklık: ${data.main.temp}°`;
        feels_like.textContent = `Hissedilen: ${data.main.feels_like}°`;
        wind.textContent = `Rüzgar: ${data.wind.speed} ${unit === "metric" ? "m/sn" : "mph"}`;
        humidity.textContent = `Nem: ${data.main.humidity}%`;
      });

    
    fetch(forecastUrl)
      .then(res => res.json())
      .then(data => {
        

        const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        dailyForecasts.forEach(item => {
          const date = new Date(item.dt_txt).toLocaleDateString("tr-TR");
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
          const description = item.weather[0].description;
          const temp = item.main.temp;

          forecastDiv.innerHTML += `
            <div class="forecast-day">
              <strong>${date}</strong><br/>
              <img src="${iconUrl}" alt="${description}"/><br/>
              ${description}, ${temp}°
            </div>
          `;
        });
      });
  });
};
