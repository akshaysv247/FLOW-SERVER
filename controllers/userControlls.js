/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const { UserModel } = require('../model/userModel');

exports.likeSongs = async (req, res) => {
  console.log('ethiii');
  const { userId, trackId } = req.params;
  console.log(trackId, userId);
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

exports.uploadProfilePic = async (req, res) => {
  const { id } = req.params;
  const { uri } = req.body;
  try {
    const user = await UserModel.findOneAndUpdate({ _id: id }, {
      $set: { ImgUrl: uri },
    });
    console.log(user);
    await user.save();
    if (user) {
      return res.json({ message: 'Updated profile successfully', success: true, user });
    }
    return res.json({ success: false, message: 'There some issues with your profile updation' });
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};
