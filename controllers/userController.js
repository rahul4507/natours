const { STATUS } = require('../utils/constants');
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel")

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.getUsers = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, message: 'User Deleted successfully!' });
});

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  const result = await User.deleteMany({});

  if (result.deletedCount === 0) {
    return next(new AppError('No users found to delete', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'All users have been deleted successfully',
    data: { deletedCount: result.deletedCount },
  });
});


