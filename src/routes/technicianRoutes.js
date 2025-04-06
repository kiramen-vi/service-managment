const express = require('express');
const {
  getAssignedServices,
  getCompletedServices,
} = require('../controllers/technicianController');
const { protect } = require('../middleware/authMiddleware');
const { isTechnician } = require('../middleware/technicianMiddleware');

const router = express.Router();

// Technician: View assigned service requests
router.get('/assigned', protect, isTechnician, getAssignedServices);

// Technician: View completed services with feedback
router.get('/completed', protect, isTechnician, getCompletedServices);

module.exports = router;
