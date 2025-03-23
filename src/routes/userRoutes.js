const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create a new service request
router.post("/requests", authMiddleware, async (req, res) => {
  try {
    const newRequest = new ServiceRequest({
      ...req.body,
      userId: req.user.id,
      status: "pending",
    });

    await newRequest.save();
    res.status(201).json({ message: "Service request created successfully", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating service request", error: error.message });
  }
});

// ✅ Get service requests for logged-in client
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ userId: req.user.id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
});

module.exports = router;
