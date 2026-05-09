const mongoose = require('mongoose');

const ActionCacheSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  co2_saved: {
    type: Number,
    required: true
  },
  points_earned: {
    type: Number,
    required: true
  },
  tip: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActionCache', ActionCacheSchema);
