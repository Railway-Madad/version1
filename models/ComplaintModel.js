const mongoose = require('mongoose');

const VALID_ISSUE_DOMAINS = [
  'Cleanliness',
  'Staff Behavior',
  'Catering',
  'Delay',
  'Facilities',
  'Other'
];

const complaintSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  pnr: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  issueDomain: {
    type: String,
    required: true,
    enum: VALID_ISSUE_DOMAINS,
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  },
  resolutionDetails: {
    type: String,
    default: ''
  },
  resolutionCategory: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
});

module.exports = mongoose.model('Complaint', complaintSchema);
