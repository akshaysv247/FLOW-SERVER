const mongoose = require('mongoose');

const CopyrightSchema = new mongoose.Schema({
  song: {
    type: mongoose.Types.ObjectId,
    ref: 'song',
    required: true,
  },
  complaint: [{
    report: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  }],
});

const Copyright = mongoose.model('Copyright', CopyrightSchema);

module.exports = Copyright;
