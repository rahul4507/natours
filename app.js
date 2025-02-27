// app.js
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Initialize Express app
const app = express();

// Set trust proxy so that rate limit can correctly read the X-Forwarded-For header.
// This is especially important if your app is behind a proxy or load balancer.
app.set('trust proxy', 1);

// Setup MongoDB connection caching logic
const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  // If already connected, skip reconnection.
  if (mongoose.connection.readyState === 1) {
    console.log('DB already connected');
    return;
  }
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB connection successful!');
  } catch (err) {
    console.error('DB connection error:', err);
  }
};

connectDB();

// Import routes, error handlers, etc.
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandller = require('./controllers/errorController');

// Set Pug as the view engine and set views directory
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Enable CORS for all origins
app.use(cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

// Set security HTTP headers
app.use(helmet());

// Limit requests from the same API
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compress all responses
app.use(compression());

// Test middleware: add request time to the request object
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Set Content Security Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://api.mapbox.com https://cdn.jsdelivr.net https://js.stripe.com 'unsafe-inline' 'unsafe-eval'; worker-src 'self' blob:; child-src 'self' blob: https://js.stripe.com;"
  );
  next();
});

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandller);

module.exports = app;
