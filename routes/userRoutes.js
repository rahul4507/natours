const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Allow all the users to access these routes
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Protect all the routes after this middleware
router.use(authController.protect);

router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updateMyPassword').patch(authController.updatePassword);
router.route('/updateMe').patch(userController.uploadUserPhoto, userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

// Restrict all the routes after this middleware to only admin
router.use(authController.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .delete(userController.deleteAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

module.exports = router;
