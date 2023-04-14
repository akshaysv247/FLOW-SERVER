const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSchema',
      required: true,
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'song' }],
    imgURL: { type: String },
  },
  { timestamps: true },
);

const PlaylistModel = mongoose.model('Playlist', playlistSchema);
module.exports = PlaylistModel;
