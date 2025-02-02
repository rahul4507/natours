const { STATUS } = require("../utils/constants");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const { roundFields } = require('../utils/aggregationUtils');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory")

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getTourStats = catchAsync(async (req, res) => {
  const field = req.query.field
  const stats = await Tour.aggregate([
    {
      $addFields: {
        ratingsAverageNumeric: { $toDouble: "$ratingsAverage" } // Convert ratingsAverage to number
      }
    },
    {
      $match: { ratingsAverageNumeric: { $gte: 4.5 } } // Filter tours with ratings >= 4.5
    },
    {
      $group: {
        _id: `$${field}`,
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverageNumeric" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: { minPrice: 1 }
    },
    roundFields(["avgRating", "avgPrice", "minPrice", "maxPrice"])
  ]);

  res.status(200).json({
    status: "success",
    results: stats.length,
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = parseInt(req.params.year, 10);
  if (isNaN(year)) {
    return res.status(400).json({
      status: STATUS.FAIL,
      message: "Invalid year parameter. Please provide a valid year."
    });
  }

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates"
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 6
    }
  ]);

  res.status(200).json({
    status: "success",
    results: plan.length,
    data: {
      plan
    }
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);