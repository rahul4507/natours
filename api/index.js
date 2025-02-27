// api/index.js
const dotenv = require('dotenv');

// Load environment variables from config.env
dotenv.config({ path: './config.env' });

const app = require('../app');

// IMPORTANT: Do not call app.listen() – Vercel handles invocation for you.
module.exports = app;
