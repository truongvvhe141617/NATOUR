const express = require('express');
const authController = require('../controllers/authorController');

const {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getSpecificBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getSpecificBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
