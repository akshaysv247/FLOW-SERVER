const express = require('express');

const router = express.Router();
const authentication = require('../middlewares/jwtAuthentication');
const {
  userLogin, userSignup, resetPassword, validateUser, getPhone,
} = require('../controllers/authController');
const {
  getAllArtists, getSpecificArtist,
} = require('../controllers/artistControls');
const {
  getAllSongs, getAllFeeds, search, getCommonSongs, getAllSongsOfAnArtist,
} = require('../controllers/song');
const {
  likeSongs, getLikedSongs, checkLiked, uploadProfilePic, updateProfile, getProfile,
} = require('../controllers/userControlls');
const {
  addNewPlaylist, getMyPlaylists, updateMyPlaylist,
  getSpecificPlaylist, removeSongFromPlaylist, addSongToPlaylist, deleteAPlaylist,
} = require('../controllers/playlists');
const { followArtist, isfollowing, unFollowing } = require('../controllers/followControl');
const { AddReport } = require('../controllers/copyrights');

router.post('/login', userLogin);
router.post('/signup', userSignup);
router.get('/get-phone/:email', getPhone);
router.post('/reset-password', resetPassword);
router.get('/validate/:id', validateUser);

router.get('/get-profile/:id', authentication, getProfile);
router.post('/upload-picture/:id', authentication, uploadProfilePic);
router.put('/update-profile/:id', authentication, updateProfile);

router.get('/get-all-tracks', authentication, getAllSongs);
router.get('/get-all-artist', authentication, getAllArtists);

router.get('/get-common-songs/:id/:songId', authentication, getCommonSongs);

router.get('/feeds', authentication, getAllFeeds);
router.post('/search', authentication, search);
router.get('/get-specific-artist/:id', authentication, getSpecificArtist);
router.get('/get-all-tracks-of-artist/:id', authentication, getAllSongsOfAnArtist);

router.put('/like-song/:userId/:trackId', authentication, likeSongs);
router.get('/get-liked-songs/:id', authentication, getLikedSongs);
router.get('/check-liked/:id/:songId', authentication, checkLiked);

router.post('/add-new-playlist/:id', authentication, addNewPlaylist);
router.get('/get-my-playlists/:id', authentication, getMyPlaylists);
router.get('/get-songs-for-playlist', authentication, getAllSongs);
router.put('/update-playlist/:id', authentication, updateMyPlaylist);
router.get('/get-specific-playlist/:id', authentication, getSpecificPlaylist);
router.put('/remove-song-from-playlist/:id/:songId', authentication, removeSongFromPlaylist);
router.put('/add-song-to-playlist/:listId/:songId', authentication, addSongToPlaylist);
router.delete('/delete-playlist/:id', authentication, deleteAPlaylist);
router.post('/report-song/:id/:songId', authentication, AddReport);

router.post('/follow-artist/:id/:artistId', authentication, followArtist);
router.delete('/unfollow-artist/:id/:artistId', authentication, unFollowing);
router.get('/is-following/:id/:artistId', authentication, isfollowing);

module.exports = router;
