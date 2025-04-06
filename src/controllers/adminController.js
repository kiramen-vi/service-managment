const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Feedback = require('../models/FeedBack');

// @desc    Get admin dashboard data (all users, services, feedbacks)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardData = async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' });
    const technicians = await User.find({ role: 'technician' });

    const serviceRequests = await ServiceRequest.find()
      .populate('client', 'name email')
      .populate('technician', 'name email');

    const feedbacks = await Feedback.find()
      .populate('client', 'name email')
      .populate('technician', 'name email')
      .populate('service', 'serviceType status');

    res.json({
      clients,
      technicians,
      serviceRequests,
      feedbacks
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Other controller methods remain unchanged...

const createTechnician = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newTechnician = await User.create({ name, email, password, role: 'technician' });

    res.status(201).json({ message: 'Technician created', technician: newTechnician });
  } catch (error) {
    console.error('Error in createTechnician:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createClient = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newClient = await User.create({ name, email, password, role: 'client' });

    res.status(201).json({ message: 'Client created', client: newClient });
  } catch (error) {
    console.error('Error in createClient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTechnician = async (req, res) => {
  try {
    const technician = await User.findOneAndDelete({ _id: req.params.id, role: 'technician' });

    if (!technician) return res.status(404).json({ message: 'Technician not found' });

    res.json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTechnician:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await User.findOneAndDelete({ _id: req.params.id, role: 'client' });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error in deleteClient:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardData,
  createTechnician,
  createClient,
  deleteTechnician,
  deleteClient
};
