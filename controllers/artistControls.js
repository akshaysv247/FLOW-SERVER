/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ArtistModel = require('../model/artistModel');

// eslint-disable-next-line consistent-return
exports.artistSignup = async (req, res) => {
  try {
    const {
      name, email, phone, password,
    } = req.body;
    if (name && email && phone && password) {
      if (!validator.isEmail(email)) {
        return res.status(400).send({ message: 'Invalid email', success: false });
      }
      if (!validator.isStrongPassword(password)) {
        return res
          .status(400)
          .send({ message: 'Invalid password please check your password', success: false });
      }
      // eslint-disable-next-line object-shorthand
      const existArtist = await ArtistModel.findOne({ email: email });
      if (existArtist) {
        return res
          .status(400)
          .send({ message: 'Artist already exists', success: false });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);
        const newArtist = new ArtistModel({
          name,
          email,
          phone,
          password: hashedPassword,
        });
        await newArtist.save();
        return res
          .status(200)
          .send({ message: 'Signed in successfully', success: true });
      }
    } else {
      return res.status(400).send({ message: 'Please fill all the required fields', success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: `artistSignup ${error.message}`, success: false });
  }
};
// eslint-disable-next-line consistent-return
exports.artistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const artist = await ArtistModel.findOne({ email });
      if (artist) {
        const isMatch = await bcrypt.compare(password, artist.password);
        if (artist.isBlocked) {
          return res
            .status(200)
            .send({ message: 'You can not access this page', success: false });
        }
        if (isMatch) {
          // eslint-disable-next-line no-underscore-dangle
          const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
          });
          return res
            .status(201).send({
              message: 'Login successful', success: true, token, artist,
            });
        }
        return res.status(400).send({ message: 'Please enter the correct password', success: false });
      }
      return res
        .status(400)
        .send({ message: 'Artist not found', success: false });
    }
    return res.status(200).send({ message: 'Please fill all the required fields', success: false });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: `artistLogin ${error.message}`, success: false });
  }
};
exports.getAllArtists = async (req, res) => {
  try {
    const data = await ArtistModel.find().sort({ createdAt: -1 });
    if (data) {
      return res.status(200).send({ success: true, artists: data });
    }
    return res.status(200).send({ success: false, message: 'Artist not found' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
exports.getArtistProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findById(id);
    if (artist) {
      return res.json({ artist, success: true });
    }
    return res.json({ message: 'No artist found Please Login', success: false });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
exports.updateArtistProfile = async (req, res) => {
  const { id } = req.params;
  const { uri } = req.body;
  try {
    const artist = await ArtistModel.findOneAndUpdate({ _id: id }, {
      $set: { ImgUrl: uri },
    });
    await artist.save();
    const newArtist = await ArtistModel.findOne({ _id: id });
    if (newArtist) {
      return res.json({ message: 'Updated profile successful', success: true, artist: newArtist });
    }
    return res.json({ success: false, message: 'There some issues with your profile updation' });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: err.message });
  }
};
exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(req.body);
    const user = await ArtistModel.updateOne({ _id: id }, {
      $set: { name: req.body.name, email: req.body.email, ImgUrl: req.body.uploadedUrl },
    });
    console.log(user);
    const newUser = await ArtistModel.findOne({ _id: id });
    console.log(newUser);
    if (newUser) {
      return res.json({ message: 'Profile updated successfully', success: true, artist: newUser });
    }
    return res.json({ success: false, message: 'something went wrong while updating profile' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.likeSongs = async (req, res) => {
  const { artistId, trackId } = req.params;
  try {
    const user = await ArtistModel.findOne({ _id: artistId });
    const index = user.likedSongs.indexOf(trackId);
    if (index === -1) {
      user.likedSongs.push(trackId);
      await user.save();
      return res.json({ success: true, message: 'Liked the song' });
    } else {
      user.likedSongs.splice(index, 1);
      await user.save();
      return res.json({ success: false, message: 'song Removed from Liked songs' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.getLikedSongs = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await ArtistModel.findById(id).populate('likedSongs');
    const songs = user.likedSongs;
    if (songs.length > 0) {
      return res.json({ success: true, songs });
    } else {
      return res.json({ success: false, message: 'Empty' });
    }
  } catch (error) {
    console.error(error);
    return res.status(404).send({ message: error.message });
  }
};

exports.checkLiked = async (req, res) => {
  const { id, songId } = req.params;
  try {
    const user = await ArtistModel.findOne({ _id: id });
    if (user.likedSongs.includes(songId)) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.getSpecificArtist = async (req, res) => {
  const { id } = req.params;
  try {
    const artist = await ArtistModel.findOne({ _id: id });
    if (artist) {
      return res.json({ success: true, artist });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
