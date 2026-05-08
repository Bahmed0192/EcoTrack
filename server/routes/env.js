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

module.exports = router;
