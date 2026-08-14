const mongoose = require('mongoose');

const CompanyProfileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Company Profile'
  },
  description: {
    type: String,
    default: 'Download our complete company profile to learn more about our journey, achievements, and yearly performance.'
  },
  pdfUrl: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    default: 0
  },
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const CompanyProfile = mongoose.models.CompanyProfile || mongoose.model('CompanyProfile', CompanyProfileSchema);

module.exports = CompanyProfile;