const fs = require('fs');
const { STATUS } = require('./../utils/constants');

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: STATUS.FAIL, message: 'Invalid ID' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: STATUS.FAIL, message: 'Missing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: STATUS.SUCCESS,
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));
  res.status(200).json({ status: STATUS.SUCCESS, data: { tour } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: STATUS.SUCCESS, data: { tour: newTour } });
    }
  );
};

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: STATUS.SUCCESS, data: { tour: 'Updated tour' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: STATUS.SUCCESS, data: null });
};
