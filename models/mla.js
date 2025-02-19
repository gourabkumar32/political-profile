const mongoose = require('mongoose');

const mlaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true },
  constituency: { type: String, required: true },
  party: { type: String, required: true },
  image: { type: String, default: 'default-mla.jpg' },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

module.exports = mongoose.model('MLA', mlaSchema);