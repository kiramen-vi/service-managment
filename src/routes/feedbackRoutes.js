const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  submitFeedback,
  getTechnicianFeedback,
} = require('../controllers/feedbackController');

// Client: Submit feedback
router.post('/', protect, submitFeedback);

// Technician: View their feedback
router.get('/technician', protect, getTechnicianFeedback);

module.exports = router;
