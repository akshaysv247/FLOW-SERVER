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
    console.log(playlist);
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
  console.log(id, 'id');
  try {
    const playlist = await Playlist.findById(id).populate('songs').populate('owner');
    console.log(playlist, 'playlist');
    res.json({ success: true, playlist });
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};
