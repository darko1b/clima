const apiKey = "0d1a7c7cd26c3e9abc5f1545a4d3d29d"; 

const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");
const searchButton = document.getElementById("search");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

searchButton.addEventListener("click", () => {
    const city = cityInput.value.trim();
    const country = countryInput.value.trim();
    
    if (city === "") {
        showError("Por favor, ingresa el nombre de una ciudad.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${country ? ',' + country : ''}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ciudad no encontrada");
            }
            return response.json();
        })
        .then(data => {
            showWeather(data);
        })
        .catch(error => {
            showError(error.message);
        });
});

function showWeather(data) {
    const { name, sys, main, weather, wind } = data;
    locationEl.textContent = `${name}, ${sys.country}`;
    descriptionEl.textContent = weather[0].description;
    temperatureEl.textContent = main.temp.toFixed(1);
    humidityEl.textContent = main.humidity;
    windEl.textContent = (wind.speed * 3.6).toFixed(1); 

    weatherInfo.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
}
