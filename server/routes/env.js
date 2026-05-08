const express = require('express');
const axios = require('axios');

const router = express.Router();

// Proxy to Open-Meteo for free, keyless live air quality data
router.get('/airquality', async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ msg: 'City parameter is required' });
    }

    // Step 1: Geocode the city name to get Latitude and Longitude
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ msg: 'City not found' });
    }

    const location = geoResponse.data.results[0];

    // Step 2: Get Air Quality using Coordinates
    const aqiResponse = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide`
    );

    const current = aqiResponse.data.current;

    // Determine a rough dominant pollutant by finding the highest raw value
    // (Open-Meteo doesn't return the dominant pollutant directly)
    const pollutants = {
      'pm10': current.pm10,
      'pm25': current.pm2_5,
      'o3': current.ozone,
      'no2': current.nitrogen_dioxide
    };
    
    let dominantPollutant = 'pm25';
    let maxVal = -1;
    for (const [key, val] of Object.entries(pollutants)) {
      if (val > maxVal) {
        maxVal = val;
        dominantPollutant = key;
      }
    }

    res.json({
      city: location.name,
      aqi: current.us_aqi,
      dominantPollutant: dominantPollutant,
      time: current.time,
      isLive: true
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Failed to fetch air quality data' });
  }
});

// Get live AQI for major world cities
router.get('/world-aqi', async (req, res) => {
  try {
    const cities = [
      { id: 1, name: "New York", lat: 40.7128, lng: -74.0060 },
      { id: 2, name: "London", lat: 51.5074, lng: -0.1278 },
      { id: 3, name: "Tokyo", lat: 35.6762, lng: 139.6503 },
      { id: 4, name: "São Paulo", lat: -23.5505, lng: -46.6333 },
      { id: 5, name: "Nairobi", lat: -1.2921, lng: 36.8219 },
      { id: 6, name: "Sydney", lat: -33.8688, lng: 151.2093 },
      { id: 7, name: "Beijing", lat: 39.9042, lng: 116.4074 },
      { id: 8, name: "Delhi", lat: 28.7041, lng: 77.1025 },
      { id: 9, name: "Cairo", lat: 30.0444, lng: 31.2357 },
      { id: 10, name: "Moscow", lat: 55.7558, lng: 37.6173 },
      { id: 11, name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
      { id: 12, name: "Paris", lat: 48.8566, lng: 2.3522 },
      { id: 13, name: "Jakarta", lat: -6.2088, lng: 106.8456 },
      { id: 14, name: "Lagos", lat: 6.5244, lng: 3.3792 },
      { id: 15, name: "Seoul", lat: 37.5665, lng: 126.9780 },
    ];

    const lats = cities.map(c => c.lat).join(',');
    const lngs = cities.map(c => c.lng).join(',');

    const aqiResponse = await axios.get(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=us_aqi`
    );

    const results = cities.map((city, index) => {
      const data = Array.isArray(aqiResponse.data) ? aqiResponse.data[index] : aqiResponse.data;
      return {
        ...city,
        aqi: data?.current?.us_aqi || 50,
      };
    });

    res.json(results);
  } catch (err) {
    console.error("World AQI error:", err.message);
    res.status(500).json({ msg: 'Failed to fetch world aqi data' });
  }
});

module.exports = router;
