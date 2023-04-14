const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: { type: String, required: true },
    songURL: { type: String, required: true },
    imgURL: { type: String, required: true },
    language: { type: String, required: true },
    category: { type: String, required: true },
    IsHide: { type: Boolean, default: false },
    album: { type: String },
  },
  {
    timestamps: true,
  },
);

const SongModel = mongoose.model('song', SongSchema);
module.exports = SongModel;
