const express = require('express');
const router = express.Router();

const { getAllUsers } = require('../controllers/userController');

// Debug line (optional)
console.log('getAllUsers is:', getAllUsers); // Should NOT be undefined

// Fixed route
router.get('/', getAllUsers);

module.exports = router;
