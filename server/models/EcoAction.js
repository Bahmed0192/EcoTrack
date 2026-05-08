const mongoose = require('mongoose');

const EcoActionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  co2_saved: { type: Number, required: true },
  points_earned: { type: Number, required: true },
  logged_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EcoAction', EcoActionSchema);
