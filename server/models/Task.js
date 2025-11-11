const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "cancelled"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  category: {
    type: String,
    enum: ["personal", "work", "health", "learning", "other"],
    default: "personal",
  },
  dueDate: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  estimatedTime: {
    type: Number, // in minutes
    min: [1, "Estimated time must be at least 1 minute"],
  },
  actualTime: {
    type: Number, // in minutes
    min: [0, "Actual time cannot be negative"],
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: [30, "Tag cannot be more than 30 characters"],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Set completedAt when status changes to completed
  if (
    this.isModified("status") &&
    this.status === "completed" &&
    !this.completedAt
  ) {
    this.completedAt = Date.now();
  }

  next();
});

// Index for better query performance
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Task", TaskSchema);
