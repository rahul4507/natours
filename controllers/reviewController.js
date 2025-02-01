const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { STATUS } = require('../utils/constants');

// Get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: STATUS.SUCCESS,
        results: reviews.length,
        data: {
            reviews
        }
    });
});

// Get a single review
exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status: STATUS.SUCCESS,
        data: {
            review
        }
    });
});

// Create a new review
exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: STATUS.SUCCESS,
        data: {
            review: newReview
        }
    });
});

// Update a review
exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status: STATUS.SUCCESS,
        data: {
            review
        }
    });
});

// Delete a review
exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(204).json({
        status: STATUS.SUCCESS,
        data: null
    });
});

// Middleware to set tour and user IDs
exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

// Get reviews for a specific tour
exports.getReviewsForTour = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ tour: req.params.tourId });

    res.status(200).json({
        status: STATUS.SUCCESS,
        results: reviews.length,
        data: {
            reviews
        }
    });
});