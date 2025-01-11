const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const { STATUS } = require("../utils/constants");

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: STATUS.SUCCESS,
        data: {
            user: newUser
        }
    })
});

