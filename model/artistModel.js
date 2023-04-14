const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  songs: {
    type: [String],
    default: [],
  },
  likedSongs: {
    type: [String],
    default: [],
  },
  ImgUrl: {
    type: String,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // languages: {
  //   type: [String],
  //   default: [],
  // },
  // followers: {
  //   type: Array,
  //   default: [],
  // },
  // playlists: {
  //   type: [String],
  //   default: [],
  // },
}, {
  timestamps: true,
});

const artistModel = mongoose.model('ArtistSchema', ArtistSchema);
module.exports = artistModel;
