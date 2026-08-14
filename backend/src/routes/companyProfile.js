const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CompanyProfile = require('../models/CompanyProfile');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/company-profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `company-profile-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// ===== GET COMPANY PROFILE (Public) =====
router.get('/', async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ isPublished: true })
      .sort({ createdAt: -1 });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ===== GET ALL PROFILES (Admin) =====
router.get('/admin', verifyToken, isAdmin, async (req, res) => {
  try {
    const profiles = await CompanyProfile.find()
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ===== UPLOAD COMPANY PROFILE (Admin) =====
router.post(
  '/upload',
  verifyToken,
  isAdmin,
  upload.single('pdf'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No PDF file uploaded'
        });
      }

      const { title, description, year } = req.body;
      
      // Unpublish old profiles
      await CompanyProfile.updateMany(
        { isPublished: true },
        { isPublished: false }
      );

      const profile = new CompanyProfile({
        title: title || 'Company Profile',
        description: description || 'Download our complete company profile to learn more about our journey, achievements, and yearly performance.',
        pdfUrl: `/uploads/company-profiles/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        year: year || new Date().getFullYear(),
        isPublished: true,
        lastUpdated: new Date()
      });

      await profile.save();

      res.status(201).json({
        success: true,
        message: 'Company profile uploaded successfully!',
        data: profile
      });
    } catch (error) {
      console.error('Upload error:', error);
      
      // Clean up uploaded file if there was an error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ===== UPDATE PROFILE (Admin) =====
router.put(
  '/:id',
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, year, isPublished } = req.body;
      
      const profile = await CompanyProfile.findById(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      if (title) profile.title = title;
      if (description) profile.description = description;
      if (year) profile.year = year;
      if (isPublished !== undefined) {
        profile.isPublished = isPublished;
        if (isPublished) {
          // Unpublish all others
          await CompanyProfile.updateMany(
            { _id: { $ne: id }, isPublished: true },
            { isPublished: false }
          );
        }
      }
      profile.lastUpdated = new Date();

      await profile.save();

      res.json({
        success: true,
        message: 'Profile updated successfully!',
        data: profile
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ===== DELETE PROFILE (Admin) =====
router.delete(
  '/:id',
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const profile = await CompanyProfile.findById(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      // Delete the file
      const filePath = path.join(__dirname, '../..', profile.pdfUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await profile.deleteOne();

      res.json({
        success: true,
        message: 'Profile deleted successfully!'
      });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ===== INCREMENT DOWNLOAD COUNT =====
router.post(
  '/:id/download',
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const profile = await CompanyProfile.findById(id);
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'Profile not found'
        });
      }

      profile.downloadCount += 1;
      await profile.save();

      res.json({
        success: true,
        data: { downloadCount: profile.downloadCount }
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