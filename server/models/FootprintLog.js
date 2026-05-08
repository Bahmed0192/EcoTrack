const mongoose = require('mongoose');

const FootprintLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transport_co2: { type: Number, required: true },
  energy_co2: { type: Number, required: true },
  diet_co2: { type: Number, required: true },
  shopping_co2: { type: Number, required: true },
  total_co2: { type: Number, required: true },
  logged_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FootprintLog', FootprintLogSchema);
