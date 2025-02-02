const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { STATUS } = require('../utils/constants');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(204).json({
        status: STATUS.SUCCESS,
        data: null
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate

        (req.params.id, req.body
            , {
                new: true,
                runValidators: true
            });
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
        status: STATUS.SUCCESS,
        data: { doc }
    });
});

exports.createOne = Model => catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: STATUS.SUCCESS,
        data: { doc }
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
        status: STATUS.SUCCESS,
        data: { doc }
    });
});


exports.getAll = Model => catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query;

    // SEND Response
    res.status(200).json({
        status: STATUS.SUCCESS,
        requestAt: req.requestTime,
        results: docs.length,
        data: { docs },
    });
});


