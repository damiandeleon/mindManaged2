const express = require("express");
const Journal = require("../models/Journal");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/journals
// @desc    Create a new journal entry
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { date, title, entry } = req.body;

    // Validate required fields
    if (!title || !entry) {
      return res.status(400).json({ message: "Title and entry are required" });
    }

    // Create new journal entry
    const journal = new Journal({
      user: req.user._id,
      date: date || new Date(),
      title,
      entry,
    });

    await journal.save();

    res.status(201).json(journal);
  } catch (error) {
    console.error("Error creating journal entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/journals
// @desc    Get all journal entries for the logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id })
      .sort({ date: -1 }) // Sort by date, newest first
      .select("date title entry createdAt updatedAt");

    res.json(journals);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/journals/:id
// @desc    Get a single journal entry by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.json(journal);
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update a journal entry
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { date, title, entry } = req.body;

    // Find journal entry
    let journal = await Journal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    // Update fields
    if (date !== undefined) journal.date = date;
    if (title !== undefined) journal.title = title;
    if (entry !== undefined) journal.entry = entry;

    await journal.save();

    res.json(journal);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete a journal entry
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!journal) {
      return res.status(404).json({ message: "Journal entry not found" });
    }

    res.json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
