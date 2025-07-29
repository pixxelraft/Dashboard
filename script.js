// ===== THREE.JS 3D BACKGROUND =====
let scene, camera, renderer, planet, stars;
let dayNightCycle = 0; // Day-night cycle variable

// Scene setup
function initThreeJS() {
    console.log('Starting Three.js initialization...');
    
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
        console.error('THREE.js not loaded!');
        return;
    }
    
    console.log('THREE.js is available:', THREE.REVISION);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8; // Move camera back to frame the centered moon

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const container = document.getElementById('planet-container');
    if (container) {
        container.appendChild(renderer.domElement);
        console.log('Renderer added to container');
    } else {
        console.error('Planet container not found!');
        return;
    }

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Reduced ambient light for day-night effect
    scene.add(ambientLight);

    // Create a realistic moon in the center with Solar System Scope texture
    const moonGeometry = new THREE.SphereGeometry(4, 64, 64); // Large moon
    
    // Load Solar System Scope moon texture
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
        (texture) => {
            console.log('Moon texture loaded successfully');
        },
        undefined,
        (error) => {
            console.log('Error loading moon texture:', error);
            // Fallback to simple moon
        }
    );
    
    // Create moon material with fallback
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 0.9,
        metalness: 0.1,
        color: 0xcccccc // Fallback color in case texture fails
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0, 0, 0); // Position moon in center
    scene.add(moon);
    console.log('Realistic moon added in center');

    // Add a simple fallback moon in case the main one fails
    const fallbackGeometry = new THREE.SphereGeometry(4, 32, 32);
    const fallbackMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xcccccc,
        transparent: true,
        opacity: 0.8
    });
    const fallbackMoon = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
    fallbackMoon.position.set(0, 0, 0);
    fallbackMoon.visible = false; // Hidden by default
    scene.add(fallbackMoon);
    console.log('Fallback moon added');

    // Add directional light for day-night cycle
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(10, 5, 5);
    scene.add(sunLight);
    
    // Start animation
    animate();
    console.log('Three.js initialization complete');
}

function animate() {
    requestAnimationFrame(animate);

    // Update day-night cycle
    dayNightCycle += 0.002; // Much slower day-night cycle
    
    // Rotate moon slowly
    const moon = scene.children.find(child => child.material && child.material.map);
    const fallbackMoon = scene.children.find(child => child.material && child.material.type === 'MeshBasicMaterial');
    
    if (moon) {
        moon.rotation.y += 0.001; // Much slower rotation
        console.log('Main moon rotating');
    } else if (fallbackMoon) {
        fallbackMoon.rotation.y += 0.001; // Much slower rotation
        fallbackMoon.visible = true; // Show fallback if main moon fails
        console.log('Fallback moon rotating');
    }

    // Update sun position for day-night cycle
    const sunLight = scene.children.find(child => child.type === 'DirectionalLight');
    if (sunLight) {
        // Create circular motion for sun around the moon
        const radius = 15;
        sunLight.position.x = Math.cos(dayNightCycle) * radius;
        sunLight.position.z = Math.sin(dayNightCycle) * radius;
        sunLight.position.y = Math.sin(dayNightCycle * 0.5) * 5; // Slight vertical movement
        
        // Adjust light intensity based on day-night cycle
        const intensity = 0.5 + Math.sin(dayNightCycle) * 0.5; // Varies between 0 and 1
        sunLight.intensity = Math.max(0.1, intensity);
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// ===== DASHBOARD FUNCTIONALITY =====

// Time and Date
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const dateFullElement = document.getElementById('current-date-full');
    
    if (timeElement && dateElement && dateFullElement) {
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const dayString = now.toLocaleDateString('en-US', {
            weekday: 'long'
        });
        
        const dateString = now.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long'
        });
        
        timeElement.textContent = timeString;
        dateElement.textContent = dayString;
        dateFullElement.textContent = dateString;
    }
}

// Weather API with enhanced details
async function getWeather() {
    try {
        // Use the user's approach with a specific city
        const API_KEY = '56bc161f08d7c12971025fc7d82dc687';
        const city = 'Cuttack'; // You can change this to your city
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('Weather API not available');
        }
        
        const data = await response.json();
        
        // Update weather details
        const tempLabel = document.getElementById('temperature-label');
        const condition = document.getElementById('condition');
        const windSpeed = document.getElementById('wind-speed');
        const humidity = document.getElementById('humidity');
        
        if (tempLabel) tempLabel.textContent = `${Math.round(data.main.temp)}°`;
        if (condition) condition.textContent = data.weather[0].description;
        
        // Wind speed
        const windSpeedValue = data.wind.speed;
        let windDescription = 'Calm';
        if (windSpeedValue > 0.5) windDescription = 'Light breeze';
        if (windSpeedValue > 3) windDescription = 'Gentle breeze';
        if (windSpeedValue > 5) windDescription = 'Moderate breeze';
        if (windSpeedValue > 8) windDescription = 'Fresh breeze';
        if (windSpeedValue > 11) windDescription = 'Strong breeze';
        if (windSpeed) windSpeed.textContent = windDescription;
        
        // Humidity
        const humidityValue = data.main.humidity;
        let humidityDescription = 'Dry';
        if (humidityValue > 30) humidityDescription = 'Comfortable';
        if (humidityValue > 60) humidityDescription = 'Humid';
        if (humidityValue > 80) humidityDescription = 'Sultry';
        if (humidity) humidity.textContent = humidityDescription;
        
        // Update timeline with current weather
        updateTimeline(data);
        
        console.log('Weather updated for', city);
        
    } catch (error) {
        console.log('Weather not available:', error);
        const tempLabel = document.getElementById('temperature-label');
        const condition = document.getElementById('condition');
        const windSpeed = document.getElementById('wind-speed');
        const humidity = document.getElementById('humidity');
        
        if (tempLabel) tempLabel.textContent = '--°';
        if (condition) condition.textContent = 'Weather unavailable';
        if (windSpeed) windSpeed.textContent = 'Unknown';
        if (humidity) humidity.textContent = 'Unknown';
    }
}

// Update timeline with weather data
function updateTimeline(weatherData) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Update current time slot (first item)
    if (timelineItems[0]) {
        const weatherIcon = timelineItems[0].querySelector('.timeline-icon');
        const temp = timelineItems[0].querySelector('.timeline-temp');
        
        if (weatherIcon && temp) {
            const weatherCode = weatherData.weather[0].id;
            const iconClass = getWeatherIconClass(weatherCode);
            weatherIcon.className = `fas ${iconClass} timeline-icon`;
            temp.textContent = `${Math.round(weatherData.main.temp)}°`;
        }
    }
}

function getWeatherIconClass(weatherCode) {
    const iconMap = {
        200: 'fa-bolt',
        300: 'fa-cloud-rain',
        500: 'fa-cloud-rain',
        600: 'fa-snowflake',
        700: 'fa-smog',
        800: 'fa-sun',
        801: 'fa-cloud-sun',
        802: 'fa-cloud',
        803: 'fa-cloud',
        804: 'fa-cloud'
    };
    
    return iconMap[Math.floor(weatherCode / 100) * 100] || 'fa-cloud';
}

// News functionality
function updateNews() {
    const newsItem = document.getElementById('news-item');
    if (newsItem) {
        const newsItems = [
            'Anker is no longer selling 3D printers | Sales have been paused indefinitely.',
            'New AI breakthrough in quantum computing announced',
            'SpaceX successfully launches new satellite constellation',
            'Major tech companies announce collaboration on renewable energy',
            'Breakthrough in fusion energy research reported'
        ];
        
        const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];
        newsItem.textContent = randomNews;
    }
}

// Shortcuts Management
class ShortcutsManager {
    constructor() {
        this.shortcuts = this.loadShortcuts();
        this.init();
    }
    
    loadShortcuts() {
        const saved = localStorage.getItem('dashboard-shortcuts');
        return saved ? JSON.parse(saved) : this.getDefaultShortcuts();
    }
    
    getDefaultShortcuts() {
        return [
            { name: 'Gmail', url: 'https://mail.google.com', icon: 'fa-envelope' },
            { name: 'YouTube', url: 'https://youtube.com', icon: 'fa-play' },
            { name: 'GitHub', url: 'https://github.com', icon: 'fa-code-branch' },
            { name: 'Reddit', url: 'https://reddit.com', icon: 'fa-comments' },
            { name: 'Twitter', url: 'https://twitter.com', icon: 'fa-twitter' },
            { name: 'Spotify', url: 'https://open.spotify.com', icon: 'fa-music' }
        ];
    }
    
    saveShortcuts() {
        localStorage.setItem('dashboard-shortcuts', JSON.stringify(this.shortcuts));
    }
    
    render() {
        const container = document.getElementById('shortcuts-row');
        if (!container) {
            console.error('Shortcuts container not found');
            return;
        }
        
        container.innerHTML = '';
        
        this.shortcuts.forEach((shortcut, index) => {
            const shortcutElement = document.createElement('a');
            shortcutElement.href = shortcut.url;
            shortcutElement.target = '_blank';
            shortcutElement.className = 'shortcut-item';
            
            // Apply brand colors based on URL
            let iconColor = '#ffffff'; // Default white
            if (shortcut.url.includes('youtube.com')) iconColor = '#ff0000';
            else if (shortcut.url.includes('github.com')) iconColor = '#ffffff';
            else if (shortcut.url.includes('reddit.com')) iconColor = '#ff4500';
            else if (shortcut.url.includes('twitter.com')) iconColor = '#1da1f2';
            else if (shortcut.url.includes('spotify.com')) iconColor = '#1db954';
            else if (shortcut.url.includes('gmail.com')) iconColor = '#ea4335';
            else if (shortcut.url.includes('facebook.com')) iconColor = '#1877f2';
            else if (shortcut.url.includes('instagram.com')) iconColor = '#e4405f';
            else if (shortcut.url.includes('linkedin.com')) iconColor = '#0077b5';
            
            shortcutElement.innerHTML = `
                <i class="${shortcut.icon} shortcut-icon" style="color: ${iconColor} !important;"></i>
                <span class="shortcut-name">${shortcut.name}</span>
            `;
            
            // Add delete functionality
            shortcutElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.deleteShortcut(index);
            });
            
            container.appendChild(shortcutElement);
        });
        
        console.log('Shortcuts rendered with brand colors:', this.shortcuts.length);
    }
    
    addShortcut(name, url) {
        const domain = new URL(url).hostname;
        const icon = this.getIconForDomain(domain);
        
        this.shortcuts.push({ name, url, icon });
        this.saveShortcuts();
        this.render();
    }
    
    deleteShortcut(index) {
        this.shortcuts.splice(index, 1);
        this.saveShortcuts();
        this.render();
    }
    
    getIconForDomain(domain) {
        const iconMap = {
            'gmail.com': 'fa-envelope',
            'youtube.com': 'fa-play',
            'github.com': 'fa-code-branch',
            'reddit.com': 'fa-comments',
            'twitter.com': 'fa-twitter',
            'spotify.com': 'fa-music',
            'facebook.com': 'fa-facebook',
            'instagram.com': 'fa-instagram',
            'linkedin.com': 'fa-linkedin',
            'netflix.com': 'fa-play',
            'amazon.com': 'fa-shopping-cart',
            'stackoverflow.com': 'fa-stack-overflow',
            'discord.com': 'fa-discord',
            'twitch.tv': 'fa-twitch',
            'pinterest.com': 'fa-pinterest',
            'tiktok.com': 'fa-tiktok',
            'whatsapp.com': 'fa-whatsapp',
            'telegram.org': 'fa-telegram',
            'slack.com': 'fa-slack',
            'zoom.us': 'fa-video'
        };
        
        return iconMap[domain] || 'fa-globe';
    }
    
    init() {
        this.render();
        this.setupModal();
    }
    
    setupModal() {
        const modal = document.getElementById('shortcut-modal');
        const addBtn = document.getElementById('add-shortcut-btn');
        const form = document.getElementById('shortcut-form');
        const cancelBtn = document.getElementById('cancel-shortcut');
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                if (modal) modal.classList.add('active');
            });
        }
        
        if (cancelBtn && modal) {
            cancelBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                if (form) form.reset();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    if (form) form.reset();
                }
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('shortcut-name');
                const urlInput = document.getElementById('shortcut-url');
                
                if (nameInput && urlInput) {
                    this.addShortcut(nameInput.value, urlInput.value);
                    if (modal) modal.classList.remove('active');
                    form.reset();
                }
            });
        }
    }
}

// Search functionality
function setupSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.open(searchUrl, '_blank');
                searchInput.value = '';
            }
        });
        
        // Focus search on page load
        searchInput.focus();
    }
}

// ===== INITIALIZATION =====

function init() {
    console.log('Initializing dashboard...');
    
    // Initialize Three.js immediately
    try {
        initThreeJS();
    } catch (error) {
        console.error('Error initializing Three.js:', error);
    }
    
    // Initialize dashboard components
    updateTime();
    setInterval(updateTime, 1000);
    
    getWeather();
    setInterval(getWeather, 600000); // Update every 10 minutes as per user's suggestion
    
    updateNews();
    setInterval(updateNews, 30000); // Update news every 30 seconds
    
    // Initialize shortcuts
    window.shortcutsManager = new ShortcutsManager();
    
    // Force re-render shortcuts after a delay to ensure brand colors
    setTimeout(() => {
        if (window.shortcutsManager) {
            window.shortcutsManager.render();
            console.log('Forced re-render of shortcuts');
        }
    }, 1000);
    
    // Setup search
    setupSearch();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
    
    console.log('Dashboard initialization complete');
}

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Fallback for FontAwesome
window.addEventListener('load', () => {
    console.log('Window loaded, checking FontAwesome...');
    setTimeout(() => {
        if (window.shortcutsManager) {
            window.shortcutsManager.render();
        }
    }, 500);
});
