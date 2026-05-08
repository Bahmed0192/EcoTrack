const express = require('express');
const FootprintLog = require('../models/FootprintLog');
const User = require('../models/User');
const { OpenAI } = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware to authenticate token (placeholder for now)
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Calculate and Log Footprint
router.post('/calculate', auth, async (req, res) => {
  try {
    const { transport, energy, food, shopping } = req.body;
    
    // Server-side calculation with mock emission factors
    const transport_co2 = transport * 0.21;
    const energy_co2 = energy * 0.82;
    const diet_co2 = food === 'Vegan' ? 1.5 : (food === 'Vegetarian' ? 2.5 : 3.3);
    const shopping_co2 = shopping * 0.5;
    
    const total_co2 = transport_co2 + energy_co2 + diet_co2 + shopping_co2;

    const footprintLog = new FootprintLog({
      user_id: req.user.id,
      transport_co2,
      energy_co2,
      diet_co2,
      shopping_co2,
      total_co2
    });

    await footprintLog.save();

    // AI Integration
    let aiTip = "Keep up the great work reducing your carbon footprint!";
    try {
      if (process.env.OPENAI_API_KEY) {
        const prompt = `Act as an Eco-Advisor. The user just logged their carbon footprint:
        - Transport: ${transport} km/week (${transport_co2.toFixed(1)} kg CO2)
        - Energy: ${energy} kWh/month (${energy_co2.toFixed(1)} kg CO2)
        - Diet: ${food}
        - Shopping: $${shopping}/month
        Total CO2: ${total_co2.toFixed(1)} kg.
        Give them ONE short, highly specific, and actionable sustainability tip based on their highest emission category. Keep it to 2 sentences max. Be encouraging.`;

        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          max_tokens: 60,
        });

        aiTip = completion.choices[0].message.content;
      }
    } catch (aiError) {
      console.error("OpenAI Error:", aiError.message);
      // Fallback tip already set
    }

    res.json({
      footprintLog,
      aiTip,
      message: 'Footprint logged successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
