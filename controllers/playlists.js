/* eslint-disable consistent-return */
const Playlist = require('../model/playlist');

exports.addNewPlaylist = async (req, res) => {
  const { id } = req.params;
  try {
    const counted = await Playlist.findOne({ owner: id }).count();
    const title = `My Playlist # ${counted + 1}`;
    console.log(counted);
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
    res.json({ success: true, myPlaylists });
  } catch (error) {
    res.status(404).send({ message: error.message, success: false });
  }
};

exports.updateMyPlaylist = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  try {
    const updation = await Playlist.updateOne({ _id: id }, {
      $set: {
        imgURL: req.body.image,
        name: req.body.title,
        songs: req.body.songsId,
      },
    });
    console.log(updation, 'updation');
    res.json({ success: true, message: 'playlist updated successfully' });
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
    const playlist = await Playlist.findOne({ _id: id });
    const index = playlist.songs.indexOf(songId);
    if (playlist.songs.includes(songId)) {
      playlist.songs.splice(index, 1);
      await playlist.save();
    }
    // console.log(playlist, songId);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  const { listId, songId } = req.params;
  try {
    const playlist = await Playlist.findOne({ _id: listId });
    if (playlist.songs.includes(songId)) {
      return res.json({ success: false, message: 'Song already exists in this playlist' });
    }
    const list = await Playlist.updateOne({ _id: listId }, { $push: { songs: songId } });
    console.log(list, 'list');
    return res.json({ success: true, message: 'Song successfully added' });
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
