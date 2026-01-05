import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { dbConnect } from './config/database.js';
import { ApiError, HttpStatusCode } from './utils/api-error.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { mountRoutes } from './routes/index.js';

// define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Connect to MongoDB
dbConnect(process.env.MONGODB_URI);

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());
app.set('query parser', 'extended');
app.use(express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

// Handle unhandled routes
app.use((req, res, next) => {
  next(
    new ApiError(
      `Route does not exist: ${req.method} ${req.originalUrl}`,
      HttpStatusCode.BAD_REQUEST
    )
  );
});

// Global Error Handling Middleware for express
app.use(globalErrorHandler);

// Start the server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Make sure server is listening on port (port not in use)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Please use a different port.`
    );
  } else {
    console.error(`Server error: ${err}`);
  }
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});

// Handling unhandled rejections outside express
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error('Shutting down the server due to Unhandled Rejection');
  });
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
});
