const express = require('express');
const fs = require('fs');

const PORT = 3000;
const API_BASE_URL = '/api/v1';
const SUCCESS = 'success';
const FAIL = 'fail';

const app = express();
app.use(express.json()); //-->>  // Middleware to parse the body of the request

tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: SUCCESS, results: tours.length, data: { tours } });
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

app.get(`${API_BASE_URL}/tours`, getAllTours);
app.get(`${API_BASE_URL}/tours/:id`, getTour);
app.post(`${API_BASE_URL}/tours`, createTour);
app.patch(`${API_BASE_URL}/tours/:id`, updateTour);
app.delete(`${API_BASE_URL}/tours/:id`, deleteTour);

app.route(`${API_BASE_URL}/tours`).get(getAllTours).post(createTour);
app
  .route(`${API_BASE_URL}/tours/:id`)
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
