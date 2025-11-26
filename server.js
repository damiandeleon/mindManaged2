const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");
const dashboardRoutes = require("./routes/dashboard");
const medicationsRoutes = require("./routes/medications");
const journalsRoutes = require("./routes/journals");
const moodCheckInsRoutes = require("./routes/mood-checkins");

const app = express();

// Connect to database
connectDB().catch((err) => {
  console.error("Failed to connect to database:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.log(
      "💡 Make sure MongoDB is running on your system or update MONGODB_URI in .env file"
    );
  }
});

// Trust proxy if behind a reverse proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(helmet());

// Rate limiting - only apply in production or if needed
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    skip: (req) => {
      // Skip rate limiting for health check
      return req.path === "/api/health";
    },
  });
  app.use("/api/", limiter);
}

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/medications", medicationsRoutes);
app.use("/api/journals", journalsRoutes);
app.use("/api/mood-checkins", moodCheckInsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mind Managed 2 API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mind_managed2")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
