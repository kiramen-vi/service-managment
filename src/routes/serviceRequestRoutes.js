const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const authMiddleware = require("../middleware/authMiddleware");

// Function to handle errors
const handleErrors = (res, error, message) => {
  console.error(`${message}:`, error);
  res.status(400).json({ message, error: error.message });
};

// ✅ Create a new service request
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newRequest = new ServiceRequest({
      ...req.body,
      userId: req.user.id,
      status: "pending", // Ensure new requests have a status
    });

    await newRequest.save();
    res.status(201).json({ message: "Service request created successfully", data: newRequest });
  } catch (error) {
    handleErrors(res, error, "Error creating service request");
  }
});

// ✅ Get all service requests
router.get("/", authMiddleware, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "client") filter = { userId: req.user.id };
    if (req.user.role === "technician") filter = { providerId: req.user.id };

    const requests = await ServiceRequest.find(filter);
    res.status(200).json(requests);
  } catch (error) {
    handleErrors(res, error, "Error fetching service requests");
  }
});

// ✅ Get a single service request by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Service request not found" });

    res.status(200).json(request);
  } catch (error) {
    handleErrors(res, error, "Error fetching service request");
  }
});

// ✅ Update a service request
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedRequest = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRequest) return res.status(404).json({ message: "Service request not found" });

    res.status(200).json({ message: "Service request updated successfully", data: updatedRequest });
  } catch (error) {
    handleErrors(res, error, "Error updating service request");
  }
});

// ✅ Delete a service request (only admin or original user can delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Service request not found" });

    if (req.user.role !== "admin" && request.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this request" });
    }

    await ServiceRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service request deleted successfully" });
  } catch (error) {
    handleErrors(res, error, "Error deleting service request");
  }
});

// ✅ Accept a service request (only for technicians)
router.put("/:id/accept", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "technician") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Service request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    // Check if the technician is available
    const technicianRequests = await ServiceRequest.find({
      providerId: req.user.id,
      status: "accepted",
    });

    if (technicianRequests.length > 0) {
      return res.status(400).json({ message: "You already have an accepted request" });
    }

    request.status = "accepted";
    request.providerId = req.user.id;
    await request.save();

    res.json({ message: "Service request accepted", request });
  } catch (error) {
    handleErrors(res, error, "Error accepting service request");
  }
});

// ✅ Reject a service request (only for technicians)
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "technician") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let request = await ServiceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Service request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Service request rejected", request });
  } catch (error) {
    handleErrors(res, error, "Error rejecting service request");
  }
});

module.exports = router;
