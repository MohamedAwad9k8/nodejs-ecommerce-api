import { HttpStatusCode, ApiError } from '../utils/api-error.js';

const generateErrorOnDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const generateErrorOnProduction = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJWTInvalidSignature = () =>
  new ApiError(
    'Invalid token. Please log in again.',
    HttpStatusCode.UNAUTHORIZED
  );

const handleJWTExpired = () =>
  new ApiError(
    'Your token has expired. Please log in again.',
    HttpStatusCode.UNAUTHORIZED
  );

// Global Error Handling Middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    generateErrorOnDevelopment(err, res);
  } else {
    if (err.name === 'JsonWebTokenError') err = handleJWTInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJWTExpired();
    generateErrorOnProduction(err, res);
  }
};
