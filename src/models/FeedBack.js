const mongoose = require("mongoose");

// Define the Feedback schema
const FeedbackSchema = new mongoose.Schema({
  technicianId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create the Feedback model
const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
