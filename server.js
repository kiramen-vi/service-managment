const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const technicianRoutes = require("./src/routes/technicianRoutes");
const serviceRequestRoutes = require("./src/routes/serviceRequestRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");


dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);

// ✅ Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Stop the server if MongoDB connection fails
  }
};
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);               // Authentication Routes
app.use("/api/users", userRoutes);              // User (Client) Routes
app.use("/api/technicians", technicianRoutes);  // Technician Routes
app.use("/api/service-requests", serviceRequestRoutes); // Service Request Routes
app.use("/api/admin", adminRoutes);             // Admin Routes

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Service Management System API");
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
