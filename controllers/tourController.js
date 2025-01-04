const fs = require('fs');

const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: SUCCESS,
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }
  res.status(200).json({ status: SUCCESS, data: { tour } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({ status: SUCCESS, data: { tour: newTour } });
    }
  );
};

exports.updateTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }

  res.status(200).json({ status: SUCCESS, data: { tour: 'Updated tour' } });
};

exports.deleteTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }

  res.status(204).json({ status: SUCCESS, data: null });
};
