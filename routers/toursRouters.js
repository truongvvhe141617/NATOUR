const express = require('express');
const authController = require('../controllers/authorController');
const reviewRouter = require('../routers/reviewRouters');

// Importing using destructuring
const {
  getAllTours,
  createTour,
  getSpecificTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require(`./../controllers/tourController`);

// Routers will only be runned when it matches url
const router = express.Router();

router.use('/:id/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getSpecificTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
