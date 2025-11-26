const mongoose = require("mongoose");

/**
 * MoodCheckIn Schema
 * Represents a mental health check-in entry in the database
 */
const MoodCheckInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mood: {
      type: String,
      required: true,
      enum: ["great", "okay", "not_great"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create index on user and datetime for faster queries
MoodCheckInSchema.index({ user: 1, datetime: -1 });

module.exports = mongoose.model("MoodCheckIn", MoodCheckInSchema);
