const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT | 3000;

const app = require('./app');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
