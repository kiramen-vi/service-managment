const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    minlength: [3, "Customer name must be at least 3 characters"],
    maxlength: [50, "Customer name cannot exceed 50 characters"],
  },
  serviceType: {
    type: String,
    enum: ["Plumbing", "Electrical", "Cleaning", "Painting"],
    required: [true, "Service type is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [5, "Description must be at least 5 characters"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
