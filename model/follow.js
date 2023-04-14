const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ArtistSchema',
    index: true,
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userschema',
    index: true,
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure that the combination of follower and following is unique
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel = mongoose.model('Follow', followSchema);
module.exports = followModel;
