const mongoose = require("mongoose");

/**
 * Journal Schema
 * Represents a journal entry in the database
 */
const JournalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    entry: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create index on user and date for faster queries
JournalSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("Journal", JournalSchema);
