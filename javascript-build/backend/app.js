const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.use(
  '/uploads/images',
  express.static(path.join(process.cwd(), 'uploads', 'images'))
);

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use(express.static(path.join('public')));

// app.use((req, res, next) => {
//   const error = new HttpError('Could not find route', 404);
//   throw error;
// });

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => console.log(err));
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || 'Something went wrong',
    data: error.data || [],
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sh85l.mongodb.net/${process.env.DB_NAME}`
  )
  .then((res) => app.listen(process.env.PORT || 5000))
  .catch((err) => console.log(err));
