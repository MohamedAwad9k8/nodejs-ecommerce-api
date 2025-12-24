import { HttpStatusCode } from "../utils/api-error.js";

// Global Error Handling Middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    generateErrorOnDevelopment(err, res);
  } else {
    generateErrorOnProduction(err, res);
  }
};

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
