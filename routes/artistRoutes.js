const express = require('express');

const router = express.Router();

const authentication = require('../middlewares/jwtAuthentication');

const { artistSignup, artistLogin } = require('../controllers/artistAuthentication');
const {
  addSongAsArtist, getAllSongsOfAnArtist, getCommonSongs, getAllFeeds,
} = require('../controllers/song');
const {
  getArtistProfile, updateProfile, updateArtistProfile, getCategory,
} = require('../controllers/details');

router.post('/signup', artistSignup);
router.post('/login', artistLogin);
router.post('/addtrack/:id', addSongAsArtist);
router.get('/get-all-tracks/:id', authentication, getAllSongsOfAnArtist);
router.get('/get-profile/:id', authentication, getArtistProfile);
router.post('/upload-picture/:id', authentication, updateArtistProfile);
router.put('/update-profile/:id', authentication, updateProfile);
router.get('/get-category', authentication, getCategory);
router.get('/get-common-songs', authentication, getCommonSongs);
router.get('/feeds', authentication, getAllFeeds);

module.exports = router;
