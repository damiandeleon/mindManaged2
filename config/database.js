const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/mind_managed2";

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    console.log(
      "Attempting to connect to MongoDB:",
      mongoURI.replace(/\/\/.*@/, "//***:***@")
    );

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
