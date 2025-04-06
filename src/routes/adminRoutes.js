const express = require('express');
const router = express.Router();
const {
  getDashboardData,
  createTechnician,
  createClient,
  deleteTechnician,
  deleteClient,
} = require('../controllers/adminController'); // double check this path

const { protect, isAdmin } = require('../middleware/authMiddleware');

// TEMP: Debug to confirm import
console.log('getDashboardData is:', getDashboardData); // should print a function

router.get('/dashboard', protect, isAdmin, getDashboardData);
router.post('/create-technician', protect, isAdmin, createTechnician);
router.post('/create-client', protect, isAdmin, createClient);
router.delete('/delete-technician/:id', protect, isAdmin, deleteTechnician);
router.delete('/delete-client/:id', protect, isAdmin, deleteClient);

module.exports = router;
