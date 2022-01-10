import { ErrorRequestHandler } from 'express';

// Error Handling Middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  const errorData = err.data || [];
  return res.status(status).json({
    message,
    errorData,
  });
};

export default errorHandler;
