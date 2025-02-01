const { promisify } = require('util')
const JWT = require('jsonwebtoken');
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { STATUS } = require("../utils/constants");

const signToken = id => {
    return JWT.sign(
        { id: id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: STATUS.SUCCESS,
        token,
        data: {
            user: newUser,
        }
    })
});

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: STATUS.SUCCESS,
        token
    })
}

exports.protect = catchAsync(async (req, res, next) => {
    // 1) extract the token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return next(new AppError('You are not logged in please login to access', 401))
    }

    // 2) verify token
    const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded)

    // 3) check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist', 401))
    }

    // 4) check if user changed password after the token was issued
    currentUser.changedPasswordAfter(decoded.iat);
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again', 401))
    }

    // Grant access to protected route
    req.user = currentUser;
    next()
})