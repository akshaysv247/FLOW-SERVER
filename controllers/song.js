/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const song = require('../model/songModel');
const Category = require('../model/categoryModel');
const ArtistModel = require('../model/artistModel');
const playlistsModel = require('../model/playlist');

exports.addSong = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log(savedSong, 'saved');
    const Artist = await ArtistModel.findOneAndUpdate({ name: req.body.artistName }, {
      $push: { songs: savedSong._id },
    });
    await Artist.save();
    console.log(Artist, 'art');

    return res.json({ success: true, message: 'song added successfully' });
  } catch (error) {
    return res.status(404).send({ message: error.message, success: false });
  }
};

exports.addSongAsArtist = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(req.body, 'body');
    const artist = await ArtistModel.findOne({ _id: id });
    const category = await Category.findOne({ name: req.body.selectedCat });
    console.log(category, artist, 'thinkgs');
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
      console.log(savedSong, 'saved');
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
    const data = await song.find();
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

exports.getAllSongsOfAnArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const Artist = await ArtistModel.findById(id);
    const data = await song.find({ artist: Artist.name });
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
  // const { id } = req.params;
  // eslint-disable-next-line prefer-const
  let today = new Date().toISOString().slice(0, 10);
  console.log(today);
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
      console.log('cvcvc', req.body);
      const tracks = await song.find({ name: { $regex: track, $options: 'i' } });
      res.json({ success: true, tracks });
      console.log(tracks);
    } else if (role === 'Artist') {
      console.log('ethii');
      const artists = await ArtistModel.find({ name: { $regex: track, $options: 'i' } });
      res.json({ success: true, artists });
    } else {
      console.log('ivdeee');
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
    const deletedSong = await song.deleteOne({ id });
    console.log(deletedSong);
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
    const hidden = await song.findOneAndUpdate({ _id: id }, { $set: { hidden: true } });
    if (hidden) {
      return res.json({ success: true, message: 'Song is Successfully hidden' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.deleteSongAsAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSong = await song.deleteOne({ _id: id });
    console.log(deletedSong, 'dele5ted');
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
