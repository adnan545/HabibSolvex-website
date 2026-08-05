const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: null
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  inquiryType: {
    type: String,
    enum: ['General Inquiry', 'Sales Inquiry', 'Export Inquiry', 'Distributor Program', 'Bulk Order', 'Become Dealer'],
    default: 'General Inquiry'
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Replied', 'Archived'],
    default: 'New'
  }
}, {
  timestamps: true
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

module.exports = Contact;