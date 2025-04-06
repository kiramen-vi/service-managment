const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceType: String,
  description: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  closureImage: String,
  createdAt: { type: Date, default: Date.now },
  closedAt: Date
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
