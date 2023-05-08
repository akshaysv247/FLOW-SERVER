const router = require('express').Router();
const authentication = require('../middlewares/jwtAuthentication');
const { adminLogin } = require('../controllers/authController');
const {
  getUserDetails,
  blockUser,
  getArtistDetails,
  blockArtist,
  verifyArtist,
} = require('../controllers/adminControls');
const {
  addSong, getAllSongs, deleteSongAsAdmin, hideSongAsAdmin, getAllHiddenSongs,
} = require('../controllers/song');
const {
  addCategory, getAllCategories, getExactCategoryAsAdmin, editCategory, deleteCategory,
} = require('../controllers/category');
const { getReports } = require('../controllers/copyrights');

router.post('/login', adminLogin);

router.get('/user-details', authentication, getUserDetails);

router.put('/user-block/:id', authentication, blockUser);

router.get('/artist-details', getArtistDetails);

router.put('/artist-block/:id', authentication, blockArtist);

router.put('/artist-verify/:id', authentication, verifyArtist);

router.post('/add-new-track', authentication, addSong);

router.get('/get-all-tracks', authentication, getAllSongs);

router.get('/get-category', authentication, getAllCategories);

router.post('/add-category', authentication, addCategory);

router.delete('/delete-song/:id', authentication, deleteSongAsAdmin);

router.put('/hide-song/:id', authentication, hideSongAsAdmin);

router.get('/get-exact-category/:id', authentication, getExactCategoryAsAdmin);

router.put('/edit-category/:id', authentication, editCategory);

router.delete('/delete-category/:id', authentication, deleteCategory);

router.get('/get-copyrights', authentication, getReports);

router.get('/get-all-hidden-songs', authentication, getAllHiddenSongs);

router.get('/get-chart-dets', authentication);

module.exports = router;
