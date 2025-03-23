const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Basic user details
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" }, // Optional phone number
    profilePicture: { type: String, default: "" }, // Profile picture URL

    // User role (client, technician, or admin)
    role: { 
      type: String, 
      enum: ["client", "technician", "admin"], 
      default: "client" 
    },

    // Technician-specific fields
    earnings: { type: Number, default: 0 }, 
    availability: { type: Boolean, default: true },
    specialization: { type: String, default: "" }, // Technician's expertise (optional)

    // Soft delete feature
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
