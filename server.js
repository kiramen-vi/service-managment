// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your React frontend dev URL (Vite default)
  credentials: true
}));
app.use(express.json());

// Serve uploaded images (closure images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/services', require('./src/routes/serviceRoutes'));
app.use('/api/technicians', require('./src/routes/technicianRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));
app.use('/api/feedback', require('./src/routes/feedbackRoutes'));

// Deployment setup
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, '/client/dist'))); // for Vite build
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'))
  );
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
