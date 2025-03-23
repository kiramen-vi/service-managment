const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const technicianMiddleware = require("../middleware/technicianMiddleware"); 
const User = require("../models/User");

const router = express.Router();

// ✅ Get technician profile (earnings & availability)
router.get("/profile", authMiddleware, technicianMiddleware, async (req, res) => {
    try {
        const technician = await User.findById(req.user.id).select("-password");
        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }
        res.json(technician);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Update availability
router.put("/availability", authMiddleware, technicianMiddleware, async (req, res) => {
    try {
        const { availability } = req.body;

        if (typeof availability !== "boolean") {
            return res.status(400).json({ message: "Invalid availability value. Must be true or false." });
        }

        const technician = await User.findByIdAndUpdate(
            req.user.id,
            { availability },
            { new: true }
        ).select("-password");

        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        res.json({ message: "Availability updated successfully", technician });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
