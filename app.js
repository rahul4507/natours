const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const PORT = 3000;

const app = express();

// 1) Middlewares
app.use(morgan('dev')); //-->>  // Middleware to log the request
app.use(express.json()); //-->>  // Middleware to parse the body of the request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
