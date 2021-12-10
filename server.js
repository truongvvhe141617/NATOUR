const mongoose = require('mongoose');
const dotenv = require('dotenv');
const APP = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Shutting down program...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection stablished!'));

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Shutting down program...');
  server.close(() => {
    process.exit(1);
  });
});
//SERVER START
const post = process.env.POST || 3000;
const server = APP.listen(post, () => {
  console.log(`<--- App running on ${process.env.NODE_ENV} (Port: ${post}) --->`);
});
