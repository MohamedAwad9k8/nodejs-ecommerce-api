import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { router as categoryRouter } from "./routes/category.routes.js";
import { dbConnect } from "./config/database.js";
import { ApiError, HttpStatusCode } from "./utils/api-error.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";

// Load environment variables from config.env file
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
await dbConnect(process.env.MONGODB_URI);

// Initialize Express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRouter);

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

// Handling unhandled rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down the server due to Unhandled Rejection");
  });
  process.exit(1);
});
