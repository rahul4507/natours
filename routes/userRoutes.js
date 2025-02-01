const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/updateMyPassword').patch(authController.protect, authController.updatePassword);


router.route('/updateMe').patch(authController.protect, userController.updateMe);
router.route('/deleteMe').delete(authController.protect, userController.deleteMe);

router.route('/me').get(authController.protect, userController.getMe);

// Protect all routes after this middleware
// router.use(authController.protect);

router.route('/').get(userController.getUsers).post(userController.createUser).delete(userController.deleteAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
