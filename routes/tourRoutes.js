const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authController.restrictTo(['admin', 'lead-guide']), tourController.deleteTour);


router.route('/:tourId/reviews')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect, authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
