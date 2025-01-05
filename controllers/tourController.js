const { STATUS } = require('../utils/constants');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, data: { tour: 'Updated tour' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: STATUS.SUCCESS, data: null });
};
