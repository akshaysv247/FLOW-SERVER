/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const { UserModel } = require('../model/userModel');

exports.likeSongs = async (req, res) => {
  const { userId, trackId } = req.params;
  try {
    const user = await UserModel.findOne({ _id: userId });
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
    const user = await UserModel.findById(id).populate('likedSongs');
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
    const user = await UserModel.findOne({ _id: id });
    if (user.likedSongs.includes(songId)) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const profile = await UserModel.findOne({ _id: id });
    if (profile) {
      res.json({ profile, success: true });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  const { id } = req.params;
  const { uri } = req.body;
  try {
    const user = await UserModel.findOneAndUpdate({ _id: id }, {
      $set: { ImgUrl: uri },
    });
    await user.save();
    if (user) {
      return res.json({ message: 'Updated profile successfully', success: true, user });
    }
    return res.json({ success: false, message: 'There some issues with your profile updation' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.updateOne({ _id: id }, {
      $set: { name: req.body.name, email: req.body.email },
    });
    await user.save();
    if (user) {
      return res.json({ message: 'Profile updated successfully', success: true, user });
    }
    return res.json({ success: false, message: 'something went wrong while updating profile' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
