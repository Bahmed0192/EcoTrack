const express = require('express');
const EcoAction = require('../models/EcoAction');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Log a new eco-action
router.post('/', auth, async (req, res) => {
  try {
    const { category, description, co2_saved, points_earned } = req.body;

    const action = new EcoAction({
      user_id: req.user.id,
      category,
      description,
      co2_saved,
      points_earned,
    });

    await action.save();

    // Update user's total eco points and streak
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { total_eco_points: points_earned, streak_days: 1 },
    });

    res.json(action);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's eco-action history
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
