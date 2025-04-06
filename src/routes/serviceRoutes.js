const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const {
  submitService,
  getClientServices,
  getTechnicianServices,
  closeService,
  assignTechnician, // ✅ Added
} = require('../controllers/serviceController');

// ✅ Client submits a new service request
router.post('/', protect, submitService);

// ✅ Client views their submitted services
router.get('/myservices', protect, getClientServices);

// ✅ Technician views assigned services
router.get('/assigned', protect, getTechnicianServices);

// ✅ Technician closes a service (upload image + feedback + rating)
router.post('/close/:serviceId', protect, upload.single('closureImage'), closeService);

// ✅ Admin assigns a technician to a service
router.put('/:id/assign', protect, assignTechnician); // ✅ Added

module.exports = router;
