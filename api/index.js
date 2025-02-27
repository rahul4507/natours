// api/index.js
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('../app');

module.exports = app;
