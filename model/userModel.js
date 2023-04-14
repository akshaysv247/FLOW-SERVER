const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  likedSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song',
  }],
  ImgUrl: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const UserModel = mongoose.model('UserSchema', UserSchema);
module.exports = { UserModel };
