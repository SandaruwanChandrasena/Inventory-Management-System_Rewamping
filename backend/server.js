import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import moduleRoutes from "./modules/index.js";

dotenv.config();

const app = express();

// Security
app.use(helmet());

// Request logging
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory Management System API is running",
  });
});

// Routes
app.use("/api", moduleRoutes);

// Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
