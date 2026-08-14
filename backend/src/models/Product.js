const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  tagline: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['sunflower', 'soybean', 'palm', 'ricebran', 'groundnut', 'industrial'],
    required: true
  },
  // Main product image (shown on products page)
  image: {
    type: String,
    required: true
  },
  // Gallery images (shown on detail page)
  gallery: {
    type: [String],
    default: []
  },
  specs: {
    type: [{
      label: String,
      value: String
    }],
    default: []
  },
  applications: {
    type: String,
    default: ''
  },
  benefits: {
    type: [String],
    default: []
  },
  packaging: {
    type: [String],
    default: []
  },
  nutritionalInfo: {
    type: Map,
    of: String,
    default: {}
  },
  badge: {
    type: String,
    enum: ['Best Seller', 'Popular', 'Industrial', 'Premium', 'Traditional', 'B2B', ''],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

module.exports = Product;