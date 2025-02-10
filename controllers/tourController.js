const { STATUS } = require("../utils/constants");
const multer = require('multer');
const sharp = require('sharp');
const Tour = require("../models/tourModel");
const { roundFields } = require('../utils/aggregationUtils');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory")


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

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  // 1) Cover Image
  if (req.files.imageCover) {
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);
  }
  // 2) other images
  if (req.files.images) {
    req.body.images = []
    await Promise.all(req.files.images.map(async (file, i) => {

      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }))


  }
  next();
});

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

exports.getToursWithin = catchAsync(async (req, res, next) => {

  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(new AppError("Please provide latitude and longitude in the format lat,lng.", 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: STATUS.SUCCESS,
    results: tours.length,
    data: {
      data: tours
    }
  });

});

exports.getDistances = catchAsync(async (req, res, next) => {

  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  if (!lat || !lng) {
    return next(new AppError("Please provide latitude and longitude in the format lat,lng.", 400));
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance",
        distanceMultiplier: unit === "mi" ? 0.000621371 : 0.001
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: STATUS.SUCCESS,
    data: {
      data: distances
    }
  });

});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: "reviews" });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

