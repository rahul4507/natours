const { STATUS } = require('../utils/constants');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // BUILD Query
    const queryFilters = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryFilters[element];
    });

    console.log(queryFilters);
    const query = Tour.find(queryFilters);
    
    // {difficulty:"easy", }
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
