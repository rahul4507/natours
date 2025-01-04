const express = require('express');
const fs = require('fs');

const router = express.Router();

const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: SUCCESS,
    requestAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }
  res.status(200).json({ status: SUCCESS, data: { tour } });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }

  res.status(200).json({ status: SUCCESS, data: { tour: 'Updated tour' } });
};

const deleteTour = (req, res) => {
  const tour = tours.find((el) => el.id === parseInt(req.params.id));

  if (!tour) {
    return res.status(404).json({ status: FAIL, message: 'Invalid ID' });
  }

  res.status(204).json({ status: SUCCESS, data: null });
};

// Tours
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
