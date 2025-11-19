const apiKey = "0d1a7c7cd26c3e9abc5f1545a4d3d29d"; 

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city");
const countryInput = document.getElementById("country");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");
const mapContainer = document.getElementById("map-container");

const locationEl = document.getElementById("location");
const descriptionEl = document.getElementById("description");
const temperatureEl = document.getElementById("temperature");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

let map = null;
let marker = null;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const city = cityInput.value.trim();
    const country = countryInput.value.trim();

    if (!city && !country) {
        showError("Por favor, ingresa al menos una ciudad.");
        return;
    }

    if (!city && country) {
        showError("Debes ingresar una ciudad junto con el país.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}${country ? ',' + country : ''}&appid=${apiKey}&units=metric&lang=es`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ciudad o país no encontrados.");
            }
            return response.json();
        })
        .then(data => {
            if (country && data.sys && data.sys.country.toLowerCase() !== country.toLowerCase()) {
                throw new Error("Los datos no coinciden con la ubicación ingresada.");
            }
            showWeather(data);
            showMap(data.coord.lat, data.coord.lon, data.name);
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

function showMap(lat, lon, cityName) {
    mapContainer.classList.remove("hidden");
    
    setTimeout(() => {
        if (map) {
            map.setView([lat, lon], 10);
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map)
                    .bindPopup(cityName)
                    .openPopup();
            }
            map.invalidateSize();
        } else {
            map = L.map('map').setView([lat, lon], 10);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(cityName)
                .openPopup();
            
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, 50);
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
    mapContainer.classList.add("hidden");
}