const API_KEY = 'd80899bfa8eecf987dd399fb1d7e1281'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const recentCitiesDiv = document.getElementById('recentButtons');
const errorMsg = document.getElementById('errorMsg');
const weatherDisplay = document.getElementById('weatherDisplay');

const weatherIcon = document.getElementById('weatherIcon');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

function showWeather() {
    errorMsg.classList.add('hidden');
    weatherDisplay.classList.remove('hidden');
}

function showError(message) {
    weatherDisplay.classList.add('hidden');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found or API error');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

function displayWeather(data) {
    const { name, main, weather, wind } = data;
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    cityName.textContent = name;
    temperature.textContent = `${Math.round(main.temp)}°C`;
    description.textContent = weather[0].description;
    humidity.textContent = `Humidity: ${main.humidity}%`;
    windSpeed.textContent = `Wind: ${wind.speed} m/s`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = weather[0].description;

    showWeather();
}

function updateRecentCities(city) {
    let recent = JSON.parse(localStorage.getItem('recentCities')) || [];
    
    recent = recent.filter(c => c !== city);
    
    recent.unshift(city);
    
    recent = recent.slice(0, 3);
    
    localStorage.setItem('recentCities', JSON.stringify(recent));
    
    renderRecentCities();
}

function renderRecentCities() {
    const recent = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCitiesDiv.innerHTML = '';
    
    if (recent.length === 0) {
        return;
    }
    
    recent.forEach(city => {
        const btn = document.createElement('button');
        btn.textContent = city;
        btn.classList.add('recent-btn');
        btn.addEventListener('click', () => searchCity(city));
        recentCitiesDiv.appendChild(btn);
    });
}

async function searchCity(city) {
    if (!city.trim()) {
        showError('Please enter a city name');
        return;
    }

    try {
        const data = await fetchWeather(city);
        displayWeather(data);
        updateRecentCities(city);
    } catch (error) {
        showError(error.message);
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    searchCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        searchCity(city);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderRecentCities();
});