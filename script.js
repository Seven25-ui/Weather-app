// script.js
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const cityNameEl = document.getElementById("cityName");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const humidityEl = document.getElementById("humidity");
const bodyEl = document.body;
const iconWrapper = document.getElementById("weatherIcon");
const iconImg = document.getElementById("iconImg"); // ⚡ Use the img element
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("errorMsg");

// ⚠️ IMPORTANT: Ibutang ni sa .env file or backend. Ayaw i-commit sa GitHub!
const API_KEY = "8a252f61c3bb5b844bf4473729978c30"; 

/* ---------------- PARTICLES ---------------- */
function createParticles(num) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
        const p = document.createElement("div");
        p.classList.add("particle");
        const size = Math.random() * 8 + 2;
        p.style.width = p.style.height = size + "px";
        p.style.background = "rgba(255,255,255,0.5)";
        p.style.left = Math.random() * 100 + "%";
        p.style.top = Math.random() * 100 + "%";
        p.style.animationDuration = (Math.random() * 20 + 10) + "s";
        fragment.appendChild(p);
    }
    bodyEl.appendChild(fragment);
}
createParticles(50);

/* ---------------- WEATHER EFFECTS ---------------- */
function clearEffects(className) {
    document.querySelectorAll(`.${className}`).forEach(el => el.remove());
}

function createRain(num) {
    clearEffects("rain-drop");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
        const drop = document.createElement("div");
        drop.classList.add("rain-drop");
        drop.style.left = Math.random() * 100 + "%";
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
        fragment.appendChild(drop);
    }
    iconWrapper.appendChild(fragment);
}

function createSnow(num) {
    clearEffects("snowflake");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");
        flake.style.left = Math.random() * 100 + "%";
        flake.style.animationDuration = (Math.random() * 5 + 5) + "s";
        flake.style.width = flake.style.height = (Math.random() * 6 + 4) + "px";
        fragment.appendChild(flake);
    }
    iconWrapper.appendChild(fragment);
}

function createCloud(num) {
    clearEffects("cloud");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");
        cloud.style.top = Math.random() * 30 + "%";
        cloud.style.width = (Math.random() * 60 + 40) + "px";
        cloud.style.height = (Math.random() * 30 + 30) + "px";
        cloud.style.animationDuration = (Math.random() * 20 + 20) + "s";
        fragment.appendChild(cloud);
    }
    iconWrapper.appendChild(fragment);
}

function createLightning() {
    const flash = document.createElement("div");
    flash.classList.add("lightning");
    iconWrapper.appendChild(flash);
    setTimeout(() => flash.remove(), 200);
}

function createSun() {
    clearEffects("sun");
    const sun = document.createElement("div");
    sun.classList.add("sun");
    iconWrapper.appendChild(sun);
}

function createWind(num) {
    clearEffects("wind");
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < num; i++) {
        const w = document.createElement("div");
        w.classList.add("wind");
        w.style.top = Math.random() * 100 + "%";
        w.style.width = (Math.random() * 50 + 30) + "px";
        w.style.animationDuration = (Math.random() * 2 + 2) + "s";
        fragment.appendChild(w);
    }
    iconWrapper.appendChild(fragment);
}

/* ---------------- WEATHER SOUNDS ---------------- */
let currentSound = null;
function playSound(weatherMain) {
    stopSound();
    const w = weatherMain.toLowerCase();
    let soundFile = "";
    
    if (w.includes("rain") || w.includes("drizzle")) soundFile = "sounds/Rain Sounds   15 seconds soundtrack.m4a";
    else if (w.includes("storm") || w.includes("thunder")) soundFile = "sounds/Best thunder sound for sleep #thunder #rain #sleep.m4a";
    else if (w.includes("wind")) soundFile = "sounds/Wind Sound FX - Free download.m4a";
    else if (w.includes("sun")) soundFile = "sounds/Morning Bird Sounds _ Real Bird Chirping for Relaxation, Meditation, Focus & Deep Sleep.m4a";
    else return;
    
    currentSound = new Audio(soundFile);
    currentSound.loop = true;
    currentSound.volume = 0.4;
    currentSound.play().catch(err => console.warn("Sound autoplay blocked:", err));
}

function stopSound() {
    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
        currentSound = null;
    }
}

/* ---------------- GET WEATHER ---------------- */
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (city === "") {
        errorEl.textContent = "Please enter a city name.";
        errorEl.classList.remove("hidden");
        return;
    }

    // Reset UI
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    weatherInfo.classList.add("hidden");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    try {
        const res = await fetch(url);
        
        if (!res.ok) {
            if (res.status === 404) throw new Error("City not found! Please try again.");
            if (res.status === 401) throw new Error("Invalid API key. Please check.");
            if (res.status === 429) throw new Error("Too many requests. Please wait.");
            throw new Error("Something went wrong.");
        }

        const data = await res.json();
        
        cityNameEl.textContent = data.name;
        tempEl.textContent = "Temperature: " + Math.round(data.main.temp) + "°C";
        descEl.textContent = "Condition: " + data.weather[0].description;
        humidityEl.textContent = "Humidity: " + data.main.humidity + "%";

        updateIcon(data.weather[0].main);
        updateBackground(data.weather[0].main);

        weatherInfo.classList.remove("hidden");

    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove("hidden");
        console.error("Weather fetch error:", error);
    } finally {
        loadingEl.classList.add("hidden");
    }
}

/* ---------------- UPDATE ICON ---------------- */
function updateIcon(weatherMain) {
    const w = weatherMain.toLowerCase();
    let imgUrl = "";

    ["rain-drop", "snowflake", "cloud", "sun", "wind", "lightning"].forEach(clearEffects);

    if (w.includes("cloud")) {
        imgUrl = "images/clouds-cloudporn-weather-lookup-158163.jpeg";
        createCloud(3);
    } else if (w.includes("rain") || w.includes("drizzle")) {
        imgUrl = "images/pexels-photo-125510.jpeg";
        createRain(50);
    } else if (w.includes("snow")) {
        imgUrl = "images/pexels-photo-688660.jpeg";
        createSnow(50);
    } else if (w.includes("storm") || w.includes("thunder")) {
        imgUrl = "images/pexels-photo-1162251.jpeg";
        createLightning();
        createRain(30);
    } else if (w.includes("sun")) {
        imgUrl = "images/pexels-photo-912364.jpeg";
        createSun();
    } else if (w.includes("wind")) {
        imgUrl = "images/pexels-photo-1030320.jpeg";
        createWind(10);
    } else {
        imgUrl = "images/pexels-photo-1117403.jpeg";
        createSun();
    }

    // ⚡ Correct way to set image source
    iconImg.src = imgUrl;
    iconImg.alt = weatherMain + " weather";
    
    playSound(weatherMain);
}

/* ---------------- UPDATE BACKGROUND ---------------- */
function updateBackground(weatherMain) {
    const w = weatherMain.toLowerCase();
    const gradients = {
        sun: "linear-gradient(135deg, #ffe259, #ffa751)",
        cloud: "linear-gradient(135deg, #d7dde5, #a3b1c6)",
        rain: "linear-gradient(135deg, #4e6e8e, #22303d)",
        drizzle: "linear-gradient(135deg, #4e6e8e, #22303d)",
        snow: "linear-gradient(135deg, #e6f0fa, #b9d3eb)",
        storm: "linear-gradient(135deg, #3a3a3a, #0a0a0a)",
        thunder: "linear-gradient(135deg, #3a3a3a, #0a0a0a)",
        wind: "linear-gradient(135deg, #89f7fe, #66a6ff)"
    };

    let matched = false;
    for (const key in gradients) {
        if (w.includes(key)) {
            bodyEl.style.background = gradients[key];
            matched = true;
            break;
        }
    }
    if (!matched) bodyEl.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
}

/* ---------------- EVENT LISTENER ---------------- */
document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Pugngan ang page reload
    getWeather();
});
