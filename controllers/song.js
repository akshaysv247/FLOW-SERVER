/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const song = require('../model/songModel');
const Category = require('../model/categoryModel');
const ArtistModel = require('../model/artistModel');
const playlistsModel = require('../model/playlist');

exports.addSong = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.body.selectedCat });
    const newSong = song({
      name: req.body.datas.songName,
      songURL: req.body.audio,
      artist: req.body.datas.artistName,
      category: category._id,
      imgURL: req.body.img,
      language: req.body.language,
    });
    const savedSong = await newSong.save();
    const Artist = await ArtistModel.findOneAndUpdate({ name: req.body.artistName }, {
      $push: { songs: savedSong._id },
    });
    await Artist.save();
    return res.json({ success: true, message: 'song added successfully' });
  } catch (error) {
    return res.status(404).send({ message: error.message, success: false });
  }
};

exports.addSongAsArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findOne({ _id: id });
    const category = await Category.findOne({ name: req.body.selectedCat });
    if (artist.isVerified) {
      const newSong = song({
        name: req.body.datas.songName,
        songURL: req.body.audio,
        artist: req.body.name,
        artistId: artist._id,
        category: category._id,
        imgURL: req.body.img,
        language: req.body.language,
        album: req.body.datas.albumName,
      });
      const savedSong = await newSong.save();
      artist.songs.push(savedSong._id);
      await artist.save();
      return res.json({ message: 'Song Added Successfully', success: true });
    } else {
      return res.json({ message: 'You are not verified as an artist...!', success: false });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message, success: false });
  }
};

exports.getAllSongs = async (req, res) => {
  try {
    const data = await song.find({ IsHide: false }).sort({ createdAt: -1 });
    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      return res.json({ success: false, message: 'Songs not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.getAllSongsforArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const Artist = await ArtistModel.findById(id);
    const data = await song.find({ artist: Artist.name });
    console.log(data);
    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      return res.json({ success: false, message: 'Songs not found' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.getAllSongsOfAnArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const Artist = await ArtistModel.findById(id);
    const data = await song.find({ $and: [{ artist: Artist.name }, { IsHide: false }] });
    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      return res.json({ success: false, message: 'Songs not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.getHiddenSongsOfArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const Artist = await ArtistModel.findById(id);
    const data = await song.find({ artist: Artist.name, IsHide: true });
    if (data) {
      return res.json({ success: true, songs: data });
    } else {
      return res.json({ success: false, message: 'Songs not found' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.getAllHiddenSongs = async (req, res) => {
  try {
    const hidden = await song.find({ IsHide: true });
    if (hidden) {
      return res.json({ success: true, data: hidden });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.getCommonSongs = async (req, res) => {
  const { id, songId } = req.params;
  try {
    const songs = await song.find({ _id: { $ne: songId }, category: id });
    if (songs) {
      return res.json({ songs, success: true });
    } else {
      return res.json({ message: 'Failed to find the next song for you', success: false });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.getAllFeeds = async (req, res) => {
  // eslint-disable-next-line prefer-const
  let today = new Date().toISOString().slice(0, 10);
  try {
    const songs = await song.find({ createdAt: today });
    console.log(songs);
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.search = async (req, res) => {
  const { role, track } = req.body;
  try {
    if (role === 'Tracks') {
      const tracks = await song.find({ name: { $regex: track, $options: 'i' } });
      res.json({ success: true, tracks });
    } else if (role === 'Artist') {
      const artists = await ArtistModel.find({ name: { $regex: track, $options: 'i' } });
      res.json({ success: true, artists });
    } else {
      const playlists = await playlistsModel.find({ name: { $regex: track, $options: 'i' } });
      res.json({ success: true, playlists });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.deleteSongAsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSong = await song.deleteOne({ _id: id });
    if (deletedSong) {
      return res.json({ success: true, message: 'Song is Successfully deleted' });
    } else {
      return res.json({ success: false, message: 'Cannot delete this song' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.hideSongAsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const hideSong = await song.findOne({ _id: id });
    if (hideSong.IsHide) {
      hideSong.IsHide = false;
      await hideSong.save();
      return res.json({ success: false, message: 'Song is visible' });
    } else {
      hideSong.IsHide = true;
      await hideSong.save();
      return res.json({ success: true, message: 'Song is now hidden' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
exports.hideSongAsArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const hideSong = await song.findOne({ _id: id });
    if (hideSong.IsHide) {
      hideSong.IsHide = false;
      await hideSong.save();
      return res.json({ success: false, message: 'Song is visible' });
    } else {
      hideSong.IsHide = true;
      await hideSong.save();
      return res.json({ success: true, message: 'Song is now hidden' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.deleteSongAsArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSong = await song.deleteOne({ _id: id });
    if (deletedSong) {
      return res.json({ success: true, message: 'Song is Successfully deleted' });
    } else {
      return res.json({ success: false, message: 'Cannot delete this song' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};
