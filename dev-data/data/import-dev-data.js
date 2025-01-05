const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

dotenv.config();

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('DB connection error:', err));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// import data into database

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data created successfully');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted successfully');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData()
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0); // Exit with success code 0
    })
    .catch((err) => {
      console.error('Import failed:', err);
      process.exit(1); // Exit with error code 1
    });
} else if (process.argv[2] === '--delete') {
  deleteData()
    .then(() => {
      console.log('Delete completed successfully');
      process.exit(0); // Exit with success code 0
    })
    .catch((err) => {
      console.error('Delete failed:', err);
      process.exit(1); // Exit with error code 1
    });
}
