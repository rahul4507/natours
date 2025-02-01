const { STATUS } = require("../utils/constants");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const { roundFields } = require('../utils/aggregationUtils');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND Response
  res.status(200).json({
    status: STATUS.SUCCESS,
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError('No Tour find with that ID', 404))
  }
  res.status(200).json({ status: STATUS.SUCCESS, data: { tour } });
});



exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: STATUS.SUCCESS,
    data: { tour: newTour },
  });
});

exports.updateTour = catchAsync(async (req, res) => {

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: STATUS.SUCCESS, data: { tour } });

});

exports.deleteTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(new AppError('No Tour find with that ID', 404))
  }
  res.status(204).json({ status: STATUS.SUCCESS, data: null });
});

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
