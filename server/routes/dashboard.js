const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current date for time-based queries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Get task statistics
    const [
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      monthlyTasks,
      weeklyTasks,
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: "completed" }),
      Task.countDocuments({ user: userId, status: "pending" }),
      Task.countDocuments({ user: userId, status: "in-progress" }),
      Task.countDocuments({
        user: userId,
        createdAt: { $gte: startOfMonth },
      }),
      Task.countDocuments({
        user: userId,
        createdAt: { $gte: startOfWeek },
      }),
    ]);

    // Get recent tasks
    const recentTasks = await Task.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title status priority dueDate updatedAt");

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: userId,
      status: { $in: ["pending", "in-progress"] },
      dueDate: { $lt: new Date() },
    });

    // Calculate completion rate
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    // Get tasks by priority
    const tasksByPriority = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Get tasks by category
    const tasksByCategory = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks: pendingTasks + inProgressTasks,
      weeklyGoals: weeklyTasks,
      monthlyTasks,
      weeklyTasks,
      overdueTasks,
      completionRate: parseFloat(completionRate),
      recentTasks,
      tasksByPriority: tasksByPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      tasksByCategory: tasksByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      summary: {
        message: getMotivationalMessage(completionRate, overdueTasks),
        productivity: getProductivityLevel(completionRate),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get detailed analytics
// @access  Private
router.get("/analytics", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = "30" } = req.query; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get daily task completion data
    const dailyStats = await Task.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Average completion time
    const avgCompletionTime = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
          actualTime: { $exists: true, $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$actualTime" },
        },
      },
    ]);

    res.json({
      period: parseInt(period),
      dailyStats,
      averageCompletionTime: avgCompletionTime[0]?.avgTime || 0,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper functions
function getMotivationalMessage(completionRate, overdueTasks) {
  if (completionRate >= 80) {
    return "Excellent work! You're crushing your goals! 🎉";
  } else if (completionRate >= 60) {
    return "Great progress! Keep up the momentum! 💪";
  } else if (completionRate >= 40) {
    return "You're making steady progress. Stay focused! 🎯";
  } else if (overdueTasks > 5) {
    return "You have some overdue tasks. Let's tackle them! ⚡";
  } else {
    return "Every step forward counts. You've got this! 🌟";
  }
}

function getProductivityLevel(completionRate) {
  if (completionRate >= 80) return "high";
  if (completionRate >= 60) return "medium";
  if (completionRate >= 40) return "moderate";
  return "low";
}

module.exports = router;
