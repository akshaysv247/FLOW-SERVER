const express = require('express');

const router = express.Router();

const authentication = require('../middlewares/jwtAuthentication');

const {
  artistSignup, artistLogin, getArtistProfile, updateArtistProfile,
  updateProfile, checkLiked, getLikedSongs, likeSongs,
} = require('../controllers/artistControls');
const {
  addNewPlaylist, getMyPlaylists, updateMyPlaylist, getSpecificPlaylist,
} = require('../controllers/playlists');
const {
  addSongAsArtist, getAllSongsOfAnArtist, getCommonSongs,
  getAllFeeds, getAllSongs, getHiddenSongsOfArtist,
} = require('../controllers/song');
const { getAllCategories } = require('../controllers/category');
const { getFollowers } = require('../controllers/followControl');

router.post('/signup', artistSignup);
router.post('/login', artistLogin);

router.post('/add-track/:id', addSongAsArtist);
router.get('/get-all-tracks/:id', authentication, getAllSongsOfAnArtist);
router.get('/get-hidden-songs-of-artist/:id', authentication, getHiddenSongsOfArtist);
router.get('/get-followers/:id', authentication, getFollowers);

router.get('/get-profile/:id', authentication, getArtistProfile);
router.post('/upload-picture/:id', authentication, updateArtistProfile);
router.put('/update-profile/:id', authentication, updateProfile);

router.put('/like-song/:artistId/:trackId', authentication, likeSongs);
router.get('/get-liked-songs/:id', authentication, getLikedSongs);
router.get('/check-liked/:id/:songId', authentication, checkLiked);

router.post('/add-new-playlist/:id', authentication, addNewPlaylist);
router.get('/get-my-playlists/:id', authentication, getMyPlaylists);
router.get('/get-songs-for-playlist', authentication, getAllSongs);
router.put('/update-playlist/:id', authentication, updateMyPlaylist);
router.get('/get-specific-playlist/:id', authentication, getSpecificPlaylist);

router.get('/get-category', authentication, getAllCategories);
router.get('/get-common-songs', authentication, getCommonSongs);
router.get('/feeds', authentication, getAllFeeds);

module.exports = router;
