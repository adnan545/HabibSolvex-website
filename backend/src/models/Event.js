const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    trim: true,
    default: null
  },
  category: {
    type: String,
    enum: ['Event', 'Publication', 'News', 'Announcement'],
    default: 'Event'
  },
  images: {
    type: [String],
    default: []
  },
  files: {
    type: [String],
    default: []
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

module.exports = Event;