/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const moment = require('moment');
const Follow = require('../model/follow');

exports.followArtist = async (req, res) => {
  const { id, artistId } = req.params;
  try {
    const newFollowing = new Follow({
      follower: artistId,
      following: id,
    });
    await newFollowing.save();
    if (newFollowing) {
      return res.json({ success: true, message: 'Following Artist successfully' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

exports.unFollowing = async (req, res) => {
  const { id, artistId } = req.params;
  try {
    const unFollowing = await Follow.deleteOne({
      follower: artistId,
      following: id,
    });
    console.log(unFollowing);
    if (unFollowing) {
      return res.json({ success: true, message: 'Unfollowing Artist successfully' });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

exports.isfollowing = async (req, res) => {
  const { id, artistId } = req.params;
  try {
    const following = await Follow.findOne({
      follower: artistId,
      following: id,
    });
    if (following) {
      return res.json({ success: true, message: 'Following' });
    // eslint-disable-next-line no-else-return
    } else {
      return res.json({ success: false, message: 'Not following' });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  const { id } = req.params;
  try {
    const followers = await Follow.find({ follower: id });
    if (followers) {
      return res.json({ followers, success: true });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

exports.artistChart = async (req, res) => {
  const currentDate = new Date();
  const fiveWeeksAgo = new Date(currentDate.getTime() - (5 * 7 * 24 * 60 * 60 * 1000));

  console.log(fiveWeeksAgo);
  const { id } = req.params;
  const weekNumber = moment(fiveWeeksAgo).week();
  const data = [{ _id: weekNumber + 1 }, { _id: weekNumber + 2 }, { _id: weekNumber + 3 }, { _id: weekNumber + 4 }, { _id: weekNumber + 5 }];
  try {
    const followers = await Follow.aggregate([
      { $match: { follower: mongoose.Types.ObjectId(id) } },
      { $match: { createdAt: { $gt: fiveWeeksAgo } } },
      {
        $group: {
          _id: { $week: '$createdAt' },
          followers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const weeks = ['5th Week', '4th Week', '3rd Week', '2nd Week', '1st Week'];
    for (let i = 0; i < data.length; i++) {
      const el = followers.find((element) => element._id === data[i]._id);
      if (el) {
        data[i].followers = el.followers;
      } else {
        data[i].followers = 0;
      }
      data[i].name = weeks[i];
    }
    res.status(200).json({ data });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};
