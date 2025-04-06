const Service = require('../models/ServiceRequest');

// ✅ Client submits new service request
exports.submitService = async (req, res) => {
  try {
    const { serviceType, description } = req.body;

    const newService = new Service({
      client: req.user._id,
      serviceType,
      description,
      status: 'Pending',
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Client views their service requests
exports.getClientServices = async (req, res) => {
  try {
    const services = await Service.find({ client: req.user._id })
      .populate('technician', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Technician views assigned services
exports.getTechnicianServices = async (req, res) => {
  try {
    const services = await Service.find({ technician: req.user._id })
      .populate('client', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Technician closes service with image, rating, and feedback
exports.closeService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, feedback } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Closure image is required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.status = 'Completed';
    service.closedAt = new Date();
    service.rating = rating;
    service.feedback = feedback;
    service.closureImage = req.file.filename;

    await service.save();

    res.json({ message: 'Service closed successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin assigns a technician to a service
exports.assignTechnician = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { technicianId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.technician = technicianId;
    service.status = 'In Progress';

    await service.save();
    res.json({ message: 'Technician assigned successfully', service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
