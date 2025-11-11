const express = require("express");
const { body, query } = require("express-validator");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const validateRequest = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get(
  "/",
  [
    auth,
    query("status")
      .optional()
      .isIn(["pending", "in-progress", "completed", "cancelled"]),
    query("priority").optional().isIn(["low", "medium", "high", "urgent"]),
    query("category")
      .optional()
      .isIn(["personal", "work", "health", "learning", "other"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const {
        status,
        priority,
        category,
        page = 1,
        limit = 10,
        sort = "-createdAt",
      } = req.query;

      // Build filter
      const filter = { user: req.user._id };
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (category) filter.category = category;

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get tasks
      const tasks = await Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count
      const total = await Task.countDocuments(filter);

      res.json({
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post(
  "/",
  [
    auth,
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot be more than 500 characters"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority level"),
    body("category")
      .optional()
      .isIn(["personal", "work", "health", "learning", "other"])
      .withMessage("Invalid category"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("estimatedTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        user: req.user._id,
      };

      const task = new Task(taskData);
      await task.save();

      res.status(201).json({
        message: "Task created successfully",
        task,
      });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put(
  "/:id",
  [
    auth,
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description cannot be more than 500 characters"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed", "cancelled"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority level"),
    body("category")
      .optional()
      .isIn(["personal", "work", "health", "learning", "other"])
      .withMessage("Invalid category"),
    body("dueDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid due date format"),
    body("estimatedTime")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Estimated time must be a positive integer"),
    body("actualTime")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Actual time must be a non-negative integer"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({
        message: "Task updated successfully",
        task,
      });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
