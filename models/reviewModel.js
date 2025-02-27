const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });


// Query Middleware
// Populate user and tour data when a review is queried
// reviewSchema.pre(/^find/, function (next) {
//     this.populate({ path: 'user', select: 'name photo' }).populate({ path: 'tour', select: 'name' });
//     next();
// });

reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name photo' });
    next();
});

// Static method to calculate average rating and number of reviews
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    }
    else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

// Calculate average rating after a review is saved
reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});

// Calculate average rating after a review is updated or deleted
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour);
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;