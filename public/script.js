// Global variables
let map;
let userMarker;
let incidentMarkers = {};
let selectedLocation = null;
let socket;
let onlineUsers = 1;
let isSelectingLocation = false; // New flag for selection mode

// API Configuration
const API_BASE = window.location.origin;
const GEOAPIFY_API_KEY = 'f9fc4de949a14c169c5b721995c17b54';

// Incident type configurations
const INCIDENT_CONFIG = {
    traffic_jam: { icon: '🚗', color: '#ea580c', name: 'Traffic Jam' },
    road_closure: { icon: '🚧', color: '#dc2626', name: 'Road Closure' },
    waterlogging: { icon: '💧', color: '#0284c7', name: 'Waterlogging' },
    power_outage: { icon: '⚡', color: '#7c3aed', name: 'Power Outage' },
    accident: { icon: '🚑', color: '#be123c', name: 'Accident' },
    construction: { icon: '🏗️', color: '#ca8a04', name: 'Construction' },
    other: { icon: '📝', color: '#64748b', name: 'Other' }
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initSocketIO();
    initEventListeners();
    getUserLocation();
    loadIncidents();
});

// Initialize Leaflet map with OpenStreetMap
function initMap() {
    // Create map centered on Delhi
    map = L.map('map', {
        center: [28.6139, 77.2090], // Delhi coordinates
        zoom: 13,
        zoomControl: false // We'll add it in a custom position
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add zoom control in top-left position
    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    // Add click event for selecting location
    map.on('click', onMapClick);

    showToast('🗺️ Map loaded successfully!', 'success');
}

// Initialize Socket.IO for real-time updates
function initSocketIO() {
    socket = io(API_BASE);

    socket.on('connect', () => {
        console.log('✅ Connected to server');
        onlineUsers++;
        updateStats();
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        showToast('Connection lost. Reconnecting...', 'warning');
    });

    // Listen for new incidents
    socket.on('new-incident', (incident) => {
        console.log('📍 New incident received:', incident);
        addIncidentMarker(incident);
        updateStats();
        showToast(`New ${INCIDENT_CONFIG[incident.incidentType].name} reported nearby!`, 'warning');
        
        // Play notification sound (optional)
        playNotificationSound();
    });

    // Listen for incident confirmations
    socket.on('incident-confirmed', (data) => {
        console.log('👍 Incident confirmed:', data);
        updateIncidentConfirmations(data.id, data.confirmations);
    });

    // Listen for incident removal
    socket.on('incident-removed', (data) => {
        console.log('🗑️ Incident removed:', data.id);
        removeIncidentMarker(data.id);
        updateStats();
    });
}

// Initialize event listeners
function initEventListeners() {
    // Modal controls
    document.getElementById('report-btn').addEventListener('click', openReportModal);
    document.getElementById('close-modal').addEventListener('click', closeReportModal);
    document.getElementById('cancel-btn').addEventListener('click', closeReportModal);

    // Form submission
    document.getElementById('report-form').addEventListener('submit', handleReportSubmit);

    // Description character count
    document.getElementById('description').addEventListener('input', updateCharCount);

    // Control buttons
    document.getElementById('my-location-btn').addEventListener('click', getUserLocation);
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadIncidents();
        showToast('Incidents refreshed', 'success');
    });
}

// Get user's current location
function getUserLocation() {
    showLoading();

    if (!navigator.geolocation) {
        hideLoading();
        showToast('Geolocation is not supported by your browser', 'error');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            // Center map on user location with smooth animation
            map.flyTo([lat, lon], 15, {
                duration: 2
            });

            // Add/update user marker
            if (userMarker) {
                userMarker.setLatLng([lat, lon]);
            } else {
                // Create custom user location marker
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background: #2563eb; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                    iconSize: [26, 26],
                    iconAnchor: [13, 13]
                });
                
                userMarker = L.marker([lat, lon], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('📍 <strong>You are here</strong>');
            }

            hideLoading();
            showToast('Location found!', 'success');
        },
        (error) => {
            hideLoading();
            console.error('Geolocation error:', error);
            showToast('Could not get your location. Using default location.', 'warning');
        }
    );
}

// Load all incidents from API
async function loadIncidents() {
    try {
        showLoading();

        const response = await fetch(`${API_BASE}/api/incidents`);
        const data = await response.json();

        if (data.success) {
            // Clear existing markers
            Object.values(incidentMarkers).forEach(marker => marker.remove());
            incidentMarkers = {};

            // Add markers for each incident
            data.incidents.forEach(incident => addIncidentMarker(incident));

            updateStats();
            console.log(`✅ Loaded ${data.count} incidents`);
        }

        hideLoading();
    } catch (error) {
        hideLoading();
        console.error('Error loading incidents:', error);
        showToast('Failed to load incidents', 'error');
    }
}

// Add incident marker to map
function addIncidentMarker(incident) {
    const config = INCIDENT_CONFIG[incident.incidentType];
    const [lon, lat] = incident.location.coordinates;

    // Create custom marker icon
    const customIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
            <div style="
                background: ${config.color};
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                border: 3px solid white;
                box-shadow: 0 4px 6px rgba(0,0,0,0.3);
                cursor: pointer;
            ">
                ${config.icon}
            </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        popupAnchor: [0, -23]
    });

    // Create popup content
    const popupContent = createPopupContent(incident);

    // Create marker with popup
    const marker = L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent, { maxWidth: 300 });

    // Store marker reference
    incidentMarkers[incident._id] = marker;

    // Add click event to buttons after popup opens
    marker.on('popupopen', () => {
        const confirmBtn = document.getElementById(`confirm-${incident._id}`);
        const resolveBtn = document.getElementById(`resolve-${incident._id}`);
        
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => confirmIncident(incident._id));
        }
        
        if (resolveBtn) {
            resolveBtn.addEventListener('click', () => resolveIncident(incident._id));
        }
    });
}

// Create popup content HTML
function createPopupContent(incident) {
    const config = INCIDENT_CONFIG[incident.incidentType];
    const date = new Date(incident.timestamp).toLocaleString();

    let weatherHtml = '';
    if (incident.weather) {
        weatherHtml = `
            <div class="meta">
                <div><i class="fas fa-thermometer-half"></i> ${incident.weather.temperature}°C - ${incident.weather.condition}</div>
                <div><i class="fas fa-tint"></i> Humidity: ${incident.weather.humidity}%</div>
            </div>
        `;
    }

    return `
        <div class="incident-popup">
            <h3>${config.icon} ${config.name}</h3>
            <div class="description">${incident.description}</div>
            <div class="meta">
                <div><i class="fas fa-map-marker-alt"></i> ${incident.address}</div>
                <div><i class="fas fa-clock"></i> ${date}</div>
            </div>
            ${weatherHtml}
            <div class="confirmations">
                <i class="fas fa-check-circle"></i>
                <span id="confirm-count-${incident._id}">${incident.confirmations}</span> confirmations
            </div>
            <div class="popup-actions">
                <button class="confirm-btn" id="confirm-${incident._id}">
                    <i class="fas fa-thumbs-up"></i> Confirm
                </button>
                <button class="resolve-btn" id="resolve-${incident._id}">
                    <i class="fas fa-check-double"></i> Problem Resolved
                </button>
            </div>
        </div>
    `;
}

// Handle map click for location selection
function onMapClick(e) {
    // Only allow location selection when in selection mode
    if (isSelectingLocation) {
        const latlng = e.latlng;
        console.log('Map clicked at:', latlng); // Debug log
        
        selectedLocation = {
            lat: latlng.lat,
            lng: latlng.lng
        };

        // Remove old temporary marker if exists
        if (window.tempMarker) {
            map.removeLayer(window.tempMarker);
        }
        
        // Create temp marker icon with pulsing effect
        const tempIcon = L.divIcon({
            className: 'temp-location-marker',
            html: `
                <div style="
                    background: #16a34a;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 4px solid white;
                    box-shadow: 0 0 20px rgba(22, 163, 74, 0.6);
                    animation: pulse 1.5s ease-in-out infinite;
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 16px;
                    ">📍</div>
                </div>
            `,
            iconSize: [38, 38],
            iconAnchor: [19, 19]
        });
        
        window.tempMarker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: tempIcon })
            .addTo(map)
            .bindPopup('📍 <strong>Report Location</strong><br>Opening form...')
            .openPopup();

        // Reset selection mode
        isSelectingLocation = false;
        document.getElementById('map').style.cursor = '';
        
        showToast('✅ Location selected! Opening form...', 'success');
        
        // NOW open the form with location already set
        setTimeout(() => {
            openReportModalWithLocation();
        }, 300);
    }
}

// Open report modal
function openReportModal() {
    // Start location selection mode
    isSelectingLocation = true;
    
    // Change cursor to indicate selection mode
    document.getElementById('map').style.cursor = 'crosshair';
    
    // Show instruction
    showToast('📍 Click on the map to select incident location', 'warning');
    
    console.log('🎯 Location selection mode activated');
}

// Open report modal WITH location already selected
function openReportModalWithLocation() {
    const modal = document.getElementById('report-modal');
    const backdrop = document.getElementById('modal-backdrop');
    
    // CRITICAL: Make modal visible by setting display to flex
    modal.style.display = 'flex';
    modal.classList.add('active');
    backdrop.classList.add('active');

    // Reset form
    document.getElementById('report-form').reset();
    
    // Set the location that was already selected
    if (selectedLocation) {
        document.getElementById('latitude').value = selectedLocation.lat;
        document.getElementById('longitude').value = selectedLocation.lng;
        
        const locationDisplay = document.getElementById('selected-location');
        locationDisplay.textContent = 
            `📍 Selected: ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`;
        locationDisplay.style.color = '#16a34a';
        locationDisplay.style.fontWeight = '600';
        
        // Add selected class to location info
        document.querySelector('.location-info').classList.add('selected');
        
        // Show instruction banner
        const instructionBanner = document.getElementById('instruction-banner');
        if (instructionBanner) {
            instructionBanner.style.display = 'flex';
        }
        
        console.log('✅ Form opened with location:', selectedLocation);
    }
}

// Close report modal
function closeReportModal() {
    const modal = document.getElementById('report-modal');
    const backdrop = document.getElementById('modal-backdrop');
    
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    
    // CRITICAL: Hide modal by setting display to none
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300); // Wait for animation to finish

    // Remove temporary marker
    if (window.tempMarker) {
        map.removeLayer(window.tempMarker);
        window.tempMarker = null;
    }
    
    // Reset selection mode
    isSelectingLocation = false;
    document.getElementById('map').style.cursor = '';
    
    // Reset selected location
    selectedLocation = null;
    
    // Remove selected class
    const locationInfo = document.querySelector('.location-info');
    if (locationInfo) {
        locationInfo.classList.remove('selected');
    }
}

// Handle report form submission
async function handleReportSubmit(e) {
    e.preventDefault();

    if (!selectedLocation) {
        showToast('Please select a location on the map', 'error');
        return;
    }

    const incidentType = document.getElementById('incident-type').value;
    const description = document.getElementById('description').value;

    try {
        showLoading();

        const response = await fetch(`${API_BASE}/api/incidents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
                incidentType,
                description
            })
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            showToast('Incident reported successfully!', 'success');
            closeReportModal();

            // The incident will be added via Socket.IO event
        } else {
            showToast('Failed to report incident: ' + data.error, 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error reporting incident:', error);
        showToast('Failed to report incident. Please try again.', 'error');
    }
}

// Confirm an incident
async function confirmIncident(incidentId) {
    try {
        const response = await fetch(`${API_BASE}/api/incidents/${incidentId}/confirm`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            showToast('Incident confirmed!', 'success');
            // The update will be received via Socket.IO
        } else {
            showToast('Failed to confirm incident', 'error');
        }
    } catch (error) {
        console.error('Error confirming incident:', error);
        showToast('Failed to confirm incident', 'error');
    }
}

// Resolve an incident (remove it)
async function resolveIncident(incidentId) {
    try {
        // Show confirmation dialog
        if (!confirm('Mark this incident as resolved? This will remove it from the map.')) {
            return;
        }
        
        showLoading();
        
        const response = await fetch(`${API_BASE}/api/incidents/${incidentId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            showToast('✅ Problem resolved! Incident removed.', 'success');
            // The incident will be removed via Socket.IO event
        } else {
            showToast('Failed to resolve incident', 'error');
        }
    } catch (error) {
        hideLoading();
        console.error('Error resolving incident:', error);
        showToast('Failed to resolve incident', 'error');
    }
}

// Update incident confirmations
function updateIncidentConfirmations(incidentId, confirmations) {
    const confirmCountElement = document.getElementById(`confirm-count-${incidentId}`);
    if (confirmCountElement) {
        confirmCountElement.textContent = confirmations;
    }
}

// Remove incident marker
function removeIncidentMarker(incidentId) {
    if (incidentMarkers[incidentId]) {
        incidentMarkers[incidentId].remove();
        delete incidentMarkers[incidentId];
    }
}

// Update statistics
function updateStats() {
    const incidentCount = Object.keys(incidentMarkers).length;
    document.getElementById('incident-count').textContent = incidentCount;
    document.getElementById('online-count').textContent = onlineUsers;
}

// Update character count
function updateCharCount() {
    const description = document.getElementById('description').value;
    const charCount = description.length;
    document.getElementById('char-count').textContent = `${charCount} / 500`;
}

// Show loading spinner
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Hide loading spinner
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Play notification sound (optional)
function playNotificationSound() {
    // You can add a subtle notification sound here
    // const audio = new Audio('notification.mp3');
    // audio.play().catch(e => console.log('Sound play failed:', e));
}

// Add CSS animation for toast removal
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
