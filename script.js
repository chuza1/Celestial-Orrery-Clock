import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// --- CONFIGURATION ---
const CONFIG = {
    orbitRadius: {
        hours: 18,
        minutes: 12,
        seconds: 7
    },
    planetSize: {
        sun: 4,
        hours: 1.2,   // Saturn
        minutes: 0.8, // Mars
        seconds: 0.6  // Earth
    },
    rotationSpeed: {
        sun: 0.001,
        earth: 0.01,
        mars: 0.008,
        saturn: 0.005
    }
};

// --- STATE ---
let scene, camera, renderer, controls, composer;
let sun, earth, mars, saturn, saturnRing;
let starField;
let timeSpeed = 1;
let is24Hour = true;
let bloomPass;

// --- DOM ELEMENTS ---
const container = document.getElementById('canvas-container');
const timeDisplay = {
    h: document.getElementById('hours'),
    m: document.getElementById('minutes'),
    s: document.getElementById('seconds')
};

// --- INITIALIZATION ---
init();
animate();

function init() {
    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 30, 40);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild(renderer.domElement);

    // 4. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 100;
    controls.minDistance = 10;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    scene.add(pointLight);

    // 6. Objects
    createSun();
    createPlanets();
    createOrbits();
    createStarfield();

    // 7. Post-Processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize);
    setupUIControls();
}

// --- OBJECT CREATION ---
function createSun() {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('textures/sun.jpg');

    // Sun Geometry
    const geometry = new THREE.SphereGeometry(CONFIG.planetSize.sun, 64, 64);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffddaa
    });
    sun = new THREE.Mesh(geometry, material);
    scene.add(sun);
}

function createPlanets() {
    const textureLoader = new THREE.TextureLoader();

    // Earth (Seconds)
    const earthGeo = new THREE.SphereGeometry(CONFIG.planetSize.seconds, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
        map: textureLoader.load('textures/earth_diffuse.jpg'),
        roughness: 0.5,
        metalness: 0.1,
        emissive: 0x112244, // Blueish glow
        emissiveIntensity: 0.2
    });
    earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Mars (Minutes)
    const marsGeo = new THREE.SphereGeometry(CONFIG.planetSize.minutes, 32, 32);
    const marsMat = new THREE.MeshStandardMaterial({
        map: textureLoader.load('textures/mars.jpg'),
        roughness: 0.7,
        metalness: 0.1,
        emissive: 0x441100, // Reddish glow
        emissiveIntensity: 0.2
    });
    mars = new THREE.Mesh(marsGeo, marsMat);
    scene.add(mars);

    // Saturn (Hours)
    const saturnGeo = new THREE.SphereGeometry(CONFIG.planetSize.hours, 32, 32);
    const saturnMat = new THREE.MeshStandardMaterial({
        map: textureLoader.load('textures/saturn.jpg'),
        roughness: 0.4,
        metalness: 0.2,
        emissive: 0x332200, // Goldish glow
        emissiveIntensity: 0.15
    });
    saturn = new THREE.Mesh(saturnGeo, saturnMat);
    scene.add(saturn);

    // Saturn Rings
    const ringGeo = new THREE.RingGeometry(1.6, 2.5, 64);
    const ringTexture = textureLoader.load('textures/saturn_ring.png');
    ringTexture.rotation = Math.PI / 2; // Rotate texture if needed, usually needed for ring geo UVs
    // Actually RingGeometry UVs are radial. A simpler texture mapping is usually linear.
    // Let's assume the texture is good.

    const ringMat = new THREE.MeshStandardMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
    });
    saturnRing = new THREE.Mesh(ringGeo, ringMat);
    saturnRing.rotation.x = Math.PI / 2;
    saturn.add(saturnRing); // Add to Saturn group
}

function createOrbits() {
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });

    // Helper to create circle line
    const createOrbitLine = (radius) => {
        const points = [];
        for (let i = 0; i <= 128; i++) {
            const angle = (i / 128) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.rotation.x = 0; // Flat on XZ plane
        scene.add(line);
    };

    createOrbitLine(CONFIG.orbitRadius.seconds);
    createOrbitLine(CONFIG.orbitRadius.minutes);
    createOrbitLine(CONFIG.orbitRadius.hours);
}

function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 5000; i++) {
        const x = THREE.MathUtils.randFloatSpread(200);
        const y = THREE.MathUtils.randFloatSpread(200);
        const z = THREE.MathUtils.randFloatSpread(200);
        vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
    starField = new THREE.Points(geometry, material);
    scene.add(starField);
}

// --- ANIMATION & LOGIC ---
function animate() {
    requestAnimationFrame(animate);

    // Time Calculation
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = now.getHours() + m / 60;

    // Update Digital Display
    updateDigitalDisplay(now);

    // Calculate Angles (Radians)
    // - Math.PI/2 to start from top (12 o'clock)
    const angleS = -(s / 60) * Math.PI * 2 + Math.PI; // Clockwise
    const angleM = -(m / 60) * Math.PI * 2 + Math.PI;
    const angleH = -((h % 12) / 12) * Math.PI * 2 + Math.PI;

    // Position Planets
    if (earth) {
        earth.position.x = Math.sin(angleS) * CONFIG.orbitRadius.seconds;
        earth.position.z = Math.cos(angleS) * CONFIG.orbitRadius.seconds;
        earth.rotation.y += CONFIG.rotationSpeed.earth * timeSpeed;
    }

    if (mars) {
        mars.position.x = Math.sin(angleM) * CONFIG.orbitRadius.minutes;
        mars.position.z = Math.cos(angleM) * CONFIG.orbitRadius.minutes;
        mars.rotation.y += CONFIG.rotationSpeed.mars * timeSpeed;
    }

    if (saturn) {
        saturn.position.x = Math.sin(angleH) * CONFIG.orbitRadius.hours;
        saturn.position.z = Math.cos(angleH) * CONFIG.orbitRadius.hours;
        // Saturn tilt
        saturn.rotation.z = 0.4;
        saturn.rotation.y += CONFIG.rotationSpeed.saturn * timeSpeed;
    }

    if (sun) {
        sun.rotation.y += CONFIG.rotationSpeed.sun;
    }

    if (starField) {
        starField.rotation.y -= 0.0002;
    }

    controls.update();
    composer.render();
}

function updateDigitalDisplay(date) {
    let h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    if (!is24Hour) {
        h = h % 12 || 12;
    }

    timeDisplay.h.textContent = h < 10 ? '0' + h : h;
    timeDisplay.m.textContent = m < 10 ? '0' + m : m;
    timeDisplay.s.textContent = s < 10 ? '0' + s : s;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function setupUIControls() {
    // Weather Controls
    const weatherBtn = document.getElementById('weatherBtn');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherTemp = document.getElementById('weatherTemp');
    const weatherLoc = document.getElementById('weatherLoc');

    // Toggle Weather Display
    let showWeather = false;
    weatherBtn.addEventListener('click', () => {
        showWeather = !showWeather;
        if (showWeather) {
            weatherDisplay.classList.remove('hidden');
            fetchWeather();
        } else {
            weatherDisplay.classList.add('hidden');
        }
    });

    // Fetch Weather Logic
    async function fetchWeather() {
        weatherLoc.textContent = "Locating...";

        if (!navigator.geolocation) {
            weatherLoc.textContent = "Geo Not Supported";
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Using Open-Meteo API (Free, No Key)
                const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const data = await response.json();

                // Get Location Name (Reverse Geocoding utilizing a public API or just coords if simple)
                // For simplicity/speed without API key limits, we'll display coords or generic. 
                // Better UX: Use simple approximation or just show condition. 
                // Let's try to get a rough name via simple lookup if possible, or just "Local Weather".
                // Actually, open-meteo doesn't return city name. We will just format the data nicely.

                const temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;

                weatherTemp.textContent = `${temp}°C`;
                weatherLoc.textContent = `Lat: ${latitude.toFixed(1)} Lon: ${longitude.toFixed(1)}`;
                weatherIcon.textContent = getWeatherIcon(code);

            } catch (error) {
                console.error("Weather Error:", error);
                weatherLoc.textContent = "Error Fetching";
            }
        }, (error) => {
            console.error("Geo Error:", error);
            weatherLoc.textContent = "Loc Access Denied";
        });
    }

    function getWeatherIcon(code) {
        // WMO Weather interpretation codes (WW)
        // 0: Clear sky
        // 1, 2, 3: Mainly clear, partly cloudy, and overcast
        // 45, 48: Fog and depositing rime fog
        // 51-55: Drizzle
        // 61-65: Rain
        // 71-77: Snow
        // 95-99: Thunderstorm
        if (code === 0) return "☀️";
        if (code >= 1 && code <= 3) return "⛅";
        if (code >= 45 && code <= 48) return "🌫️";
        if (code >= 51 && code <= 67) return "🌧️";
        if (code >= 71 && code <= 77) return "❄️";
        if (code >= 80 && code <= 82) return "🌦️";
        if (code >= 95 && code <= 99) return "⛈️";
        return "🌡️";
    }

    // Settings Panel Toggle
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettings = document.getElementById('closeSettings');
    const panel = document.getElementById('settingsPanel');

    settingsBtn.addEventListener('click', () => panel.classList.add('open'));
    closeSettings.addEventListener('click', () => panel.classList.remove('open'));

    // Formats
    document.getElementById('timeFormat').addEventListener('change', (e) => {
        is24Hour = e.target.value === '24';
    });

    // Speed Control
    document.getElementById('animSpeed').addEventListener('input', (e) => {
        timeSpeed = parseFloat(e.target.value);
    });

    // Bloom Strength
    document.getElementById('bloomStrength').addEventListener('input', (e) => {
        if (bloomPass) {
            bloomPass.strength = parseFloat(e.target.value);
        }
    });
}
