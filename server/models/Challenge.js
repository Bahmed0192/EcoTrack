const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  target_metric: { type: String, required: true },
  end_date: { type: Date, required: true },
  participant_count: { type: Number, default: 0 },
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
