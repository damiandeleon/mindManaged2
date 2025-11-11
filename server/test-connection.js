const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log(
      "Connection string:",
      process.env.MONGODB_URI?.replace(/\/\/.*@/, "//***:***@")
    );

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
    console.log("Connected to:", conn.connection.host);
    console.log("Database:", conn.connection.name);

    await mongoose.connection.close();
    console.log("Connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();
