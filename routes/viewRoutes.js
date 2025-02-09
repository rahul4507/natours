const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/', authController.protect, authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/sign-up', authController.isLoggedIn, viewsController.getSignUpForm);
// router.get('/singup', authController.isLoggedIn, viewsController.getForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/my-tours',
  authController.isLoggedIn,
  bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
