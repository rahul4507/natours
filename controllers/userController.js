const { STATUS } = require('../utils/constants');
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel")
const AppError = require("../utils/appError");


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: STATUS.ERROR, message: 'This route is not yet defined' });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next()
}

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: STATUS.SUCCESS,
    data: null
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {

  // 1) create a error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 2) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  // findByIdAndUpdate will not work as intended

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: { updatedUser }
  });

});

exports.getUsers = catchAsync(async (req, res, next) => {
  role = req.query.role;
  let condition = {};
  if (role) {
    condition = { role: role }
  }
  const users = await User.find(condition);
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, data: { users } });
});

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


