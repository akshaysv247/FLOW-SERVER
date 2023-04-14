/* eslint-disable no-else-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { UserModel } = require('../model/userModel');
const artistModel = require('../model/artistModel');

module.exports = {
  getUserDetails: async (req, res) => {
    try {
      const user = await UserModel.find({ isAdmin: false });
      console.log(user);
      res.json({ users: user });
    } catch (error) {
      return res
        .status(200)
        .send({ message: error.message, success: false });
    }
  },
  blockUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
      // eslint-disable-next-line no-unused-expressions
      user.isBlocked === false ? user.isBlocked = true : user.isBlocked = false;
      await user.save();
      res.json({ status: 'success', message: 'user status has changed' });
    } catch (error) {
      return res.status(400).send({ message: error.message, success: false });
    }
  },
  getArtistDetails: async (req, res) => {
    console.log('jersey');
    try {
      console.log('dfsds');
      const artist = await artistModel.find();
      console.log(artist);
      res.json({ artists: artist });
    } catch (error) {
      console.log(error);
      return res
        .status(200)
        .send({ message: error.message, success: false });
    }
  },
  blockArtist: async (req, res) => {
    try {
      const artistId = req.params.id;
      const artist = await artistModel.findById(artistId);
      // eslint-disable-next-line no-unused-expressions
      artist.isBlocked === false ? artist.isBlocked = true : artist.isBlocked = false;
      await artist.save();
      res.json({ status: 'success', message: 'artist status has changed' });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: error.message, success: false });
    }
  },
  verifyArtist: async (req, res) => {
    try {
      const artistId = req.params.id;
      const artist = await artistModel.findById(artistId);
      // eslint-disable-next-line no-unused-expressions
      artist.isVerified === false ? artist.isVerified = true : artist.isVerified = false;
      await artist.save();
      res.json({ status: 'success', message: 'artist status has changed' });
    } catch (error) {
      return res.status(400).send({ message: error.message, success: false });
    }
  },
};
