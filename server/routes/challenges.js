const express = require('express');
const Challenge = require('../models/Challenge');
const ChallengeParticipant = require('../models/ChallengeParticipant');
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

const requireOrganizer = (req, res, next) => {
  if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied. Only organizers can create challenges.' });
  }
  next();
};

// Get all active challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find({ end_date: { $gte: new Date() } })
      .populate('creator_id', 'name')
      .sort({ participant_count: -1 });
    res.json(challenges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new challenge (Organizers only)
router.post('/', [auth, requireOrganizer], async (req, res) => {
  try {
    const { title, description, target_metric, end_date } = req.body;

    const challenge = new Challenge({
      creator_id: req.user.id,
      title,
      description,
      target_metric,
      end_date,
    });

    await challenge.save();
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Join a challenge
router.put('/:id/join', auth, async (req, res) => {
  try {
    const existing = await ChallengeParticipant.findOne({
      challenge_id: req.params.id,
      user_id: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ msg: 'Already joined this challenge' });
    }

    const participant = new ChallengeParticipant({
      challenge_id: req.params.id,
      user_id: req.user.id,
    });

    await participant.save();

    await Challenge.findByIdAndUpdate(req.params.id, {
      $inc: { participant_count: 1 },
    });

    const challenge = await Challenge.findById(req.params.id);
    res.json(challenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Leave a challenge
router.put('/:id/leave', auth, async (req, res) => {
  try {
    await ChallengeParticipant.findOneAndDelete({
      challenge_id: req.params.id,
      user_id: req.user.id,
    });

    await Challenge.findByIdAndUpdate(req.params.id, {
      $inc: { participant_count: -1 },
    });

    res.json({ msg: 'Left challenge successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
