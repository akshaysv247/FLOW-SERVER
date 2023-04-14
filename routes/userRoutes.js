const express = require('express');

const router = express.Router();
const authentication = require('../middlewares/jwtAuthentication');
const {
  userLogin, userSignup, resetPassword, validateUser,
} = require('../controllers/authController');
const {
  getProfile,
  updateProfile,
  getAllArtists,
} = require('../controllers/details');
const { getAllSongs, getAllFeeds, search } = require('../controllers/song');
const { likeSongs, getLikedSongs, checkLiked, uploadProfilePic } = require('../controllers/userControlls');
const {
  addNewPlaylist, getMyPlaylists, updateMyPlaylist, getSpecificPlaylist,
} = require('../controllers/playlists');
const { followArtist, isfollowing, unFollowing } = require('../controllers/followControl');

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.post('/reset-password', resetPassword);
router.get('/validate/:id', validateUser);

router.get('/get-profile/:id', authentication, getProfile);
router.post('/upload-picture/:id', authentication, uploadProfilePic);
router.put('/update-profile/:id', authentication, updateProfile);
router.get('/get-all-tracks', authentication, getAllSongs);
router.get('/get-all-artist', authentication, getAllArtists);
router.get('/feeds', authentication, getAllFeeds);
router.post('/search', authentication, search);
router.put('/like-song/:userId/:trackId', authentication, likeSongs);
router.get('/get-liked-songs/:id', authentication, getLikedSongs);
router.post('/add-new-playlist/:id', authentication, addNewPlaylist);
router.get('/get-my-playlists/:id', authentication, getMyPlaylists);
router.get('/get-songs-for-playlist', authentication, getAllSongs);
router.put('/update-playlist/:id', authentication, updateMyPlaylist);
router.get('/check-liked/:id/:songId', authentication, checkLiked);
router.get('/get-specific-playlist/:id', authentication, getSpecificPlaylist);
router.post('/follow-artist/:id/:artistId', authentication, followArtist);
router.delete('/unfollow-artist/:id/:artistId', authentication, unFollowing);
router.get('/is-following/:id/:artistId', authentication, isfollowing);

module.exports = router;
