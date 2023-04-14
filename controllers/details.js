/* eslint-disable consistent-return */
const { UserModel } = require('../model/userModel');
const ArtistModel = require('../model/artistModel');
const categoryModel = require('../model/categoryModel');

module.exports = {
  getProfile: async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await UserModel.findOne({ _id: id });
      console.log(profile);
      if (profile) {
        res.json({ profile, success: true });
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const profile = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      res.json(profile);
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  },
  getAllArtists: async (req, res) => {
    try {
      const data = await ArtistModel.find();
      if (data) {
        return res.status(200).send({ success: true, artists: data });
      }
      return res.status(200).send({ success: false, message: 'Artist not found' });
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  },
  getArtistProfile: async (req, res) => {
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
  },
  updateArtistProfile: async (req, res) => {
    const { id } = req.params;
    const { uri } = req.body;
    console.log(uri, id);
    try {
      const artist = await ArtistModel.findOneAndUpdate({ _id: id }, {
        $set: { ImgUrl: uri },
      });
      await artist.save();
      if (artist) {
        console.log(artist);
        return res.json({ message: 'Updated profile successful', success: true, artist });
      }
      return res.json({ success: false, message: 'There some issues with your profile updation' });
    } catch (err) {
      console.log(err);
      return res.status(404).send({ message: err.message });
    }
  },
  getCategory: async (req, res) => {
    try {
      const category = await categoryModel.find();
      if (category) {
        return res.json({ category, success: true });
      }
      return res.json({ success: false, message: 'No categories found.' });
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  },
};
