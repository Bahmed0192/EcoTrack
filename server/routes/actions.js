const express = require('express');
const EcoAction = require('../models/EcoAction');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Whitelist of trusted preset actions — client cannot modify these values
const ACTION_PRESETS_WHITELIST = {
  "Biked to work":           { category: "Transport", co2_saved: 2.4, points_earned: 25 },
  "Used public transit":     { category: "Transport", co2_saved: 1.8, points_earned: 20 },
  "Turned off unused lights":{ category: "Energy",    co2_saved: 0.5, points_earned: 10 },
  "Air-dried laundry":       { category: "Energy",    co2_saved: 1.2, points_earned: 15 },
  "Had a plant-based meal":  { category: "Food",      co2_saved: 1.5, points_earned: 15 },
  "Composted food waste":    { category: "Food",      co2_saved: 0.8, points_earned: 10 },
  "Used reusable bags":      { category: "Shopping",  co2_saved: 0.3, points_earned: 5  },
  "Bought second-hand":      { category: "Shopping",  co2_saved: 2.0, points_earned: 20 },
};

// Helper: call OpenAI to calculate CO2 impact for a custom action
async function calculateWithAI(description) {
  const prompt = `You are a carbon footprint expert. A user logged this eco-friendly action: "${description}"

Respond ONLY with a valid JSON object (no markdown, no explanation) in this exact format:
{
  "category": "<Transport|Energy|Food|Shopping|Other>",
  "co2_saved": <number in kg, realistic estimate, max 10>,
  "points_earned": <integer 5-50, proportional to CO2 saved>,
  "tip": "<one encouraging sentence about the environmental impact, max 20 words>"
}

Rules:
- co2_saved must be between 0.1 and 10 kg
- points_earned = round(co2_saved * 10), min 5, max 50
- If the action is not eco-friendly or is vague/nonsensical, return co2_saved: 0.1, points_earned: 5`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 200,
  });

  const text = response.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

// ─────────────────────────────────────────────────────────────
// POST /api/actions/calculate  — AI preview (no DB write)
// ─────────────────────────────────────────────────────────────
router.post('/calculate', auth, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || description.trim().length < 5) {
      return res.status(400).json({ msg: 'Please describe your action in more detail.' });
    }

    const result = await calculateWithAI(description.trim());
    res.json(result);
  } catch (err) {
    console.error('AI calculate error:', err.message);
    // Fallback if OpenAI fails
    res.json({
      category: 'Other',
      co2_saved: 0.5,
      points_earned: 5,
      tip: 'Every small action counts towards a greener planet!'
    });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/actions  — Log an action
// ─────────────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { description, isCustom } = req.body;
    let { category, co2_saved, points_earned } = req.body;

    if (isCustom) {
      // CUSTOM ACTION: always calculate server-side via AI — ignore any client values
      if (!description || description.trim().length < 5) {
        return res.status(400).json({ msg: 'Please describe your action in more detail.' });
      }
      try {
        const aiResult = await calculateWithAI(description.trim());
        category = aiResult.category;
        co2_saved = aiResult.co2_saved;
        points_earned = aiResult.points_earned;
      } catch (aiErr) {
        // Fallback defaults if AI fails
        console.error('AI error, using fallback:', aiErr.message);
        category = category || 'Other';
        co2_saved = 0.5;
        points_earned = 5;
      }
    } else {
      // PRESET ACTION: validate against whitelist — reject if tampered
      const preset = ACTION_PRESETS_WHITELIST[description];
      if (preset) {
        category = preset.category;
        co2_saved = preset.co2_saved;
        points_earned = preset.points_earned;
      }
      // If not in whitelist, use the client values (legacy support)
    }

    const action = new EcoAction({
      user_id: req.user.id,
      category,
      description,
      co2_saved,
      points_earned,
    });

    await action.save();

    // ── Streak logic ──────────────────────────────────────────
    const user = await User.findById(req.user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const lastAction = await EcoAction.findOne({
      user_id: req.user.id,
      _id: { $ne: action._id },
    }).sort({ logged_at: -1 });

    let newStreak = user.streak_days || 0;

    if (lastAction) {
      const lastDate = new Date(lastAction.logged_at);
      const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
      const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day — streak unchanged
      } else if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { total_eco_points: points_earned },
        $set: { streak_days: newStreak },
      },
      { new: true }
    ).select('-password');

    res.json({ action, user: updatedUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/actions  — Get user's action history
// ─────────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const actions = await EcoAction.find({ user_id: req.user.id })
      .sort({ logged_at: -1 })
      .limit(50);
    res.json(actions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
