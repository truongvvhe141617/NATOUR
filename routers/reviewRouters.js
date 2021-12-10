const express = require('express');
const authController = require('./../controllers/authorController');
const {
  createReview,
  getAllReviews,
  getSpecificReview,
  updateReview,
  deleteReview,
  setTourUserIds,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(getAllReviews).post(authController.restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getSpecificReview)
  .patch(authController.restrictTo('admin', 'user'), updateReview)
  .delete(authController.restrictTo('admin', 'user'), deleteReview);

module.exports = router;
