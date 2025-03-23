const express = require("express");
const Feedback = require("../models/FeedBack");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ✅ Submit Feedback (Client → Technician)
 * Only logged-in clients can give feedback to a technician.
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { technicianId, rating, comment } = req.body;

    // Only clients can submit feedback
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can give feedback" });
    }

    // Create a new feedback entry
    const feedback = new Feedback({
      technicianId,
      clientId: req.user.id,
      rating,
      comment
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback", error: error.message });
  }
});

/**
 * ✅ Get All Feedback for a Technician
 * Anyone can view feedback for a specific technician.
 */
router.get("/:technicianId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ technicianId: req.params.technicianId }).populate("clientId", "name");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
});

/**
 * ✅ Get My Feedback (Technicians Only)
 * A technician can see all feedback they have received.
 */
router.get("/my-feedback", authMiddleware, async (req, res) => {
  try {
    // Only technicians can view their feedback
    if (req.user.role !== "technician") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find feedback where technicianId matches logged-in user
    const feedbacks = await Feedback.find({ technicianId: req.user.id }).populate("clientId", "name");

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
});

module.exports = router;
