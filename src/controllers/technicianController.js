const Service = require('../models/ServiceRequest');

// @desc    Get all assigned services for technician
// @route   GET /api/technician/assigned
// @access  Private (Technician only)
exports.getAssignedServices = async (req, res) => {
  try {
    const services = await Service.find({
      technician: req.user._id,
      status: { $in: ['Assigned', 'In Progress'] },
    }).populate('client', 'name email');

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching assigned services:', error);
    res.status(500).json({ message: 'Failed to fetch assigned services' });
  }
};

// @desc    Get completed services with feedback for technician
// @route   GET /api/technician/completed
// @access  Private (Technician only)
exports.getCompletedServices = async (req, res) => {
  try {
    const services = await Service.find({
      technician: req.user._id,
      status: 'Completed',
    }).populate('client', 'name email');

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching completed services:', error);
    res.status(500).json({ message: 'Failed to fetch completed services' });
  }
};
