const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
//const bookingCtrlr = require('../controllers/bookingController');

const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
} = require('../controllers/viewController');

const router = express.Router();

router.use(viewController.alerts);

router.get('/', authController.isLoggedIn, getOverview);

router.get('/login', authController.isLoggedIn, getLoginForm);

router.get('/me', authController.protect, getAccount);

router.get('/my-tours', authController.protect, getMyTours);

router.post('/submit-user-data', authController.protect, updateUserData);

router.get('/tour/:slug', authController.isLoggedIn, getTour);

module.exports = router;
