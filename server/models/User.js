const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'organizer', 'admin'],
    default: 'user'
  },
  team_name: { type: String, default: '' },
  city: { type: String },
  diet_type: { type: String },
  transport_habits: { type: String },
  total_eco_points: { type: Number, default: 0 },
  streak_days: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
