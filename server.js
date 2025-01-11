const dotenv = require('dotenv');
const mongoose = require('mongoose');

// handlling uncaught exception
process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
})


dotenv.config({ path: './config.env' });
const app = require('./app');

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT || 3000;
server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// how to handle unhandlled rejection --> we will make use of event listeners
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log("Unhandlled Rejection shutting down");
  server.close(() => {
    process.exit(1);
  });
})