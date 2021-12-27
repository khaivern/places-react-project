const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const placeRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Accept, Authorization, Content-Type'
  );
  next();
});

app.use('/api/places', placeRoutes);
app.use('/api/users', userRoutes);

app.use(
  '/uploads/images',
  express.static(path.join(__dirname, 'uploads', 'images'))
);
app.use((req, res, next) => {
  const error = new HttpError('Could not found find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => console.log(err));
  }
  if (res.headerSent) {
    return next(err);
  }
  res.status(error.code || 500).json({
    message: error.message || 'An unknown error occured!',
  });
});

mongoose
  .connect('mongodb+srv://admin:1234@cluster0.sh85l.mongodb.net/places')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
