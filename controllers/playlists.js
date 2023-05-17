/* eslint-disable consistent-return */
const Playlist = require('../model/playlist');

exports.addNewPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const counted = await Playlist.findOne({ owner: id }).count();
    const title = `My Playlist # ${counted + 1}`;
    const playlist = new Playlist({
      name: title,
      owner: id,
    });
    await playlist.save();
    res.json({ success: true, message: 'playlist created successfully', playlist });
  } catch (error) {
    console.error(error.message);
    res.status(404).send({ message: error.message, success: false });
  }
};

exports.getMyPlaylists = async (req, res) => {
  const { id } = req.params;
  try {
    const myPlaylists = await Playlist.find({ owner: id });
    console.log(myPlaylists);
    res.json({ success: true, myPlaylists });
  } catch (error) {
    res.status(404).send({ message: error.message, success: false });
  }
};

exports.updateMyPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const updation = await Playlist.updateOne({ _id: id }, {
      $set: {
        imgURL: req.body.image,
        name: req.body.title,
        songs: req.body.songsId,
      },
    });
    if (updation) {
      res.json({ success: true, message: 'playlist updated successfully' });
    }
  } catch (error) {
    res.status(404).send({ message: error.message, success: false });
  }
};

exports.getSpecificPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const playlist = await Playlist.findById(id).populate('songs').populate('owner');
    res.json({ success: true, playlist });
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  const { id, songId } = req.params;
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: id },
      { $pull: { songs: songId } },
      { new: true },
    );
    if (playlist) {
      return res.json({ success: true });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  const { listId, songId } = req.params;
  try {
    const playlist = await Playlist.findOne({ _id: listId });
    if (!playlist.songs.includes(songId)) {
      const list = await Playlist.updateOne({ _id: listId }, { $push: { songs: songId } });
      if (list) {
        return res.json({ success: true, message: 'Song successfully added' });
      }
    }
    return res.json({ success: false, message: 'Song already exists in this playlist' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.deleteAPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const list = await Playlist.deleteOne({ _id: id });
    if (list) {
      return res.json({ success: true, message: 'Deleted Successfully' });
    }
    return res.json({ success: false, message: 'An Error occured' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
