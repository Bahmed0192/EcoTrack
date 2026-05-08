const mongoose = require('mongoose');

const ChallengeParticipantSchema = new mongoose.Schema({
  challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joined_at: { type: Date, default: Date.now },
  contribution_value: { type: Number, default: 0 },
});

module.exports = mongoose.model('ChallengeParticipant', ChallengeParticipantSchema);
