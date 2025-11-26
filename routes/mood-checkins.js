const express = require("express");
const MoodCheckIn = require("../models/MoodCheckIn");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/mood-checkins
// @desc    Create a new mood check-in
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { mood, datetime } = req.body;

    // Validate required fields
    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    // Validate mood value
    const validMoods = ["great", "okay", "not_great"];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: "Invalid mood value" });
    }

    // Create new mood check-in
    const moodCheckIn = new MoodCheckIn({
      user: req.user._id,
      datetime: datetime || new Date(),
      mood,
    });

    await moodCheckIn.save();

    res.status(201).json(moodCheckIn);
  } catch (error) {
    console.error("Error creating mood check-in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/mood-checkins
// @desc    Get all mood check-ins for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const moodCheckIns = await MoodCheckIn.find({ user: req.user._id })
      .sort({ datetime: -1 }) // Sort by datetime, newest first
      .limit(parseInt(limit))
      .select("datetime mood createdAt");

    res.json(moodCheckIns);
  } catch (error) {
    console.error("Error fetching mood check-ins:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/mood-checkins/:id
// @desc    Get a single mood check-in by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const moodCheckIn = await MoodCheckIn.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!moodCheckIn) {
      return res.status(404).json({ message: "Mood check-in not found" });
    }

    res.json(moodCheckIn);
  } catch (error) {
    console.error("Error fetching mood check-in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/mood-checkins/:id
// @desc    Delete a mood check-in
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const moodCheckIn = await MoodCheckIn.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!moodCheckIn) {
      return res.status(404).json({ message: "Mood check-in not found" });
    }

    res.json({ message: "Mood check-in deleted successfully" });
  } catch (error) {
    console.error("Error deleting mood check-in:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
