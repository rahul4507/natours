const { STATUS } = require('../utils/constants');
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel")
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory")
const multer = require('multer');
const sharp = require('sharp');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: STATUS.SUCCESS,
    data: null
  });
});

// Multer storage and file filter
const multerStorage = multer.memoryStorage(); // Store in memory for processing with Sharp

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo'); // Middleware to handle file upload

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Prevent updating password via this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400));
  }

  // 2) Filter out unwanted fields
  const filteredBody = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.body.email) filteredBody.email = req.body.email;

  // 3) Process photo if uploaded
  if (req.file) {
    const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500) // Resize to 500x500 pixels
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${filename}`);

    filteredBody.photo = filename;
  }

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
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

exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
exports.createUser = factory.createOne(User)
exports.deleteUser = factory.deleteOne(User)