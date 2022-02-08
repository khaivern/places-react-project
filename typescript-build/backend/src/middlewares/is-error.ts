import { ErrorRequestHandler } from 'express';
import clearImage from '../util/clear-image';

// Error Handling Middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (req.file) {
    clearImage(req.file.filename);
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  const errorData = err.data || [];
  return res.status(status).json({
    message,
    errorData,
  });
};

export default errorHandler;
