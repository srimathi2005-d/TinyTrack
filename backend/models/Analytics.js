const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet', 'unknown'],
    default: 'unknown',
  },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
