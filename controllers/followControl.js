/* eslint-disable consistent-return */
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
