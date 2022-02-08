// general imports
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// optimizer imports
import helmet from 'helmet';
import compression from 'compression';

// internal imports
import fileUpload from './middlewares/file-upload';
import errorHandler from './middlewares/is-error';
import userRoutes from './routes/user';
import placesRoutes from './routes/places';
import HttpError from './models/http-error';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const app = express();

// static files
app.use('/images', express.static(path.join(__dirname, '/images')));

// CORS middleware
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// parsing middleware
app.use(bodyParser.json());
app.use(fileUpload.single('image'));
// app.use(helmet());
// app.use(compression);

// routes
app.use('/auth', userRoutes);
app.use('/feed', placesRoutes);

// catch-all
app.use((req, res, next)=> {
  throw new HttpError('No matching route found', 404);
})

// err middleware
app.use(errorHandler);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.sh85l.mongodb.net/${process.env.MONGO_DEFAULT_DB}`
  )
  .then((result) => app.listen(process.env.PORT || 8000))
  .catch((err) => console.log(err));
