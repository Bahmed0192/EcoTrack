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

    // --- Streak logic ---
    const user = await User.findById(req.user.id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find the most recent action BEFORE this one
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
        // Same day — streak stays the same, no double-counting
      } else if (diffDays === 1) {
        // Consecutive day — increment streak
        newStreak += 1;
      } else {
        // Missed a day — reset to 1
        newStreak = 1;
      }
    } else {
      // First ever action — start streak at 1
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
