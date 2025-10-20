const express = require('express');
const router = express.Router();
const axios = require('axios');
const Incident = require('../models/Incident');

// Helper function to get address from coordinates using Geoapify
async function getAddressFromCoordinates(lat, lon) {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`
    );
    
    if (response.data.features && response.data.features.length > 0) {
      const properties = response.data.features[0].properties;
      return properties.formatted || properties.address_line1 || 'Unknown location';
    }
    return 'Unknown location';
  } catch (error) {
    console.error('Geoapify error:', error.message);
    return 'Unknown location';
  }
}

// Helper function to get weather data using OpenWeatherMap
async function getWeatherData(lat, lon) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      return null; // Skip weather if API key not configured
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    return {
      temperature: response.data.main.temp,
      condition: response.data.weather[0].description,
      humidity: response.data.main.humidity
    };
  } catch (error) {
    console.error('OpenWeather error:', error.message);
    return null;
  }
}

// GET all active incidents
router.get('/', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    
    let query = { isActive: true };
    
    // If coordinates provided, find incidents within radius (default 10km)
    if (lat && lon) {
      const radiusInMeters = (radius || 10) * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      };
    }
    
    const incidents = await Incident.find(query).sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, count: incidents.length, incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new incident
router.post('/', async (req, res) => {
  try {
    const { latitude, longitude, incidentType, description } = req.body;
    
    // Validate required fields
    if (!latitude || !longitude || !incidentType || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: latitude, longitude, incidentType, description' 
      });
    }
    
    // Get address and weather data in parallel
    const [address, weather] = await Promise.all([
      getAddressFromCoordinates(latitude, longitude),
      getWeatherData(latitude, longitude)
    ]);
    
    // Create new incident
    const incident = new Incident({
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      incidentType,
      description,
      address,
      weather
    });
    
    await incident.save();
    
    // Emit real-time update to all connected clients
    const io = req.app.get('socketio');
    io.emit('new-incident', incident);
    
    console.log('✅ New incident created:', incidentType, 'at', address);
    
    res.status(201).json({ success: true, incident });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST confirm an incident
router.post('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params;
    
    const incident = await Incident.findByIdAndUpdate(
      id,
      { $inc: { confirmations: 1 } },
      { new: true }
    );
    
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    
    // Emit real-time update to all connected clients
    const io = req.app.get('socketio');
    io.emit('incident-confirmed', { id: incident._id, confirmations: incident.confirmations });
    
    console.log('👍 Incident confirmed:', incident._id, '- Total confirmations:', incident.confirmations);
    
    res.json({ success: true, incident });
  } catch (error) {
    console.error('Error confirming incident:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE an incident (optional - for admin use)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const incident = await Incident.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    
    // Emit real-time update to all connected clients
    const io = req.app.get('socketio');
    io.emit('incident-removed', { id: incident._id });
    
    res.json({ success: true, message: 'Incident marked as inactive' });
  } catch (error) {
    console.error('Error deleting incident:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
