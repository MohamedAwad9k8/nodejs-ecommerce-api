import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { router as categoryRouter } from "./routes/category.routes.js";
import { dbConnect } from "./config/database.js";

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

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
