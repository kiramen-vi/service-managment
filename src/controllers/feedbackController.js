const Feedback = require('../models/FeedBack');
const Service = require('../models/ServiceRequest');

// Submit feedback (Client)
const submitFeedback = async (req, res) => {
  const { serviceId, rating, feedback } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const fb = await Feedback.create({
      service: serviceId,
      client: req.user._id,
      technician: service.technician,
      rating,
      feedback,
    });

    res.status(201).json(fb);
  } catch (err) {
    console.error('Error in submitFeedback:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get feedback for logged-in technician
const getTechnicianFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ technician: req.user._id });
    res.json(feedback);
  } catch (err) {
    console.error('Error in getTechnicianFeedback:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitFeedback,
  getTechnicianFeedback,
};
