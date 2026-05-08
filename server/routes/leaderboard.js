const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get leaderboard — top users by eco-points with time filters
router.get('/', async (req, res) => {
  try {
    const { period } = req.query; // week, month, all
    let dateFilter = {};

    if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { created_at: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { created_at: { $gte: monthAgo } };
    }

    const users = await User.find(dateFilter)
      .select('name total_eco_points streak_days city')
      .sort({ total_eco_points: -1 })
      .limit(20);

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get team leaderboard — aggregate eco-points by team_name
router.get('/teams', async (req, res) => {
  try {
    const teams = await User.aggregate([
      { $match: { team_name: { $nin: ['', null] } } },
      {
        $group: {
          _id: '$team_name',
          total_points: { $sum: '$total_eco_points' },
          member_count: { $sum: 1 },
          top_member: { $first: '$name' },
        },
      },
      { $sort: { total_points: -1 } },
      { $limit: 10 },
    ]);
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
