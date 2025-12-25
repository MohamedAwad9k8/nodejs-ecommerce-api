import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { dbConnect } from './config/database.js';
import { ApiError, HttpStatusCode } from './utils/api-error.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { CategoryRouter } from './routes/category.routes.js';
import { SubCategoryRouter } from './routes/subCategory.routes.js';
import { BrandRouter } from './routes/brand.routes.js';
import { ProductRouter } from './routes/product.routes.js';

// Load environment variables from config.env file
dotenv.config({ path: './config.env' });

// Connect to MongoDB
dbConnect(process.env.MONGODB_URI);

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', CategoryRouter);
app.use('/api/v1/subcategories', SubCategoryRouter);
app.use('/api/v1/brands', BrandRouter);
app.use('/api/v1/products', ProductRouter);

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
