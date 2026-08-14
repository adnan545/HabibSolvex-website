const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// ===== GET ALL PRODUCTS =====
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET SINGLE PRODUCT =====
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET ALL PRODUCTS (ADMIN) =====
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== CREATE OR UPDATE PRODUCT (ADMIN) =====
router.post(
  '/admin/update',
  verifyToken,
  isAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const productData = JSON.parse(req.body.productData);
      const { id } = productData;

      // Find existing product
      let product = await Product.findOne({ id });

      // Handle image uploads
      let imageUrl = product?.image || '';
      let galleryUrls = product?.gallery || [];

      if (req.files && req.files.image) {
        // Delete old image if exists
        if (product && product.image && !product.image.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '../..', product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imageUrl = `/uploads/products/${req.files.image[0].filename}`;
      }

      if (req.files && req.files.gallery) {
        // Delete old gallery images if they exist
        if (product && product.gallery && product.gallery.length > 0) {
          product.gallery.forEach(img => {
            if (!img.startsWith('http')) {
              const oldGalleryPath = path.join(__dirname, '../..', img);
              if (fs.existsSync(oldGalleryPath)) {
                fs.unlinkSync(oldGalleryPath);
              }
            }
          });
        }
        galleryUrls = req.files.gallery.map(file => `/uploads/products/${file.filename}`);
      }

      // Prepare product data
      const updateData = {
        id: productData.id,
        name: productData.name,
        tagline: productData.tagline || '',
        description: productData.description,
        category: productData.category,
        image: imageUrl || productData.image,
        gallery: galleryUrls.length > 0 ? galleryUrls : productData.gallery || [],
        specs: productData.specs || [],
        applications: productData.applications || '',
        benefits: productData.benefits || [],
        packaging: productData.packaging || [],
        nutritionalInfo: productData.nutritionalInfo || {},
        badge: productData.badge || '',
        isActive: productData.isActive !== undefined ? productData.isActive : true,
        order: productData.order || 0
      };

      if (product) {
        // Update existing
        Object.assign(product, updateData);
        await product.save();
      } else {
        // Create new
        product = new Product(updateData);
        await product.save();
      }

      res.json({
        success: true,
        message: product ? 'Product updated successfully!' : 'Product created successfully!',
        data: product
      });

    } catch (error) {
      console.error('Product update error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ===== DELETE PRODUCT (ADMIN) =====
router.delete(
  '/admin/:id',
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({ id });
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      // Delete images
      if (product.image && !product.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../..', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      if (product.gallery && product.gallery.length > 0) {
        product.gallery.forEach(img => {
          if (!img.startsWith('http')) {
            const galleryPath = path.join(__dirname, '../..', img);
            if (fs.existsSync(galleryPath)) {
              fs.unlinkSync(galleryPath);
            }
          }
        });
      }

      await product.deleteOne();

      res.json({
        success: true,
        message: 'Product deleted successfully!'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;