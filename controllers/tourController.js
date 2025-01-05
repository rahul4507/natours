const { STATUS } = require('../utils/constants');
const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    // BUILD Query
    // 1A) Filtering
    const queryFilters = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryFilters[element];
    });

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryFilters);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2 Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdBy');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    // 4)Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    // Execute Query
    const tours = await query;

    // SEND Response
    res.status(200).json({
      status: STATUS.SUCCESS,
      requestAt: req.requestTime,
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: STATUS.SUCCESS, data: { tour } });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: STATUS.SUCCESS,
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: STATUS.SUCCESS, data: { tour } });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: STATUS.SUCCESS, data: null });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};
