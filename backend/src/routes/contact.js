const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/email');

// ============================================
// SUBMIT CONTACT FORM
// ============================================
router.post(
  '/submit',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').notEmpty().withMessage('Phone number is required').trim(),
    body('subject').notEmpty().withMessage('Subject is required').trim(),
    body('message').notEmpty().withMessage('Message is required').trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, phone, company, subject, message, inquiryType } = req.body;

      const contact = await Contact.create({
        name,
        email,
        phone,
        company,
        subject,
        message,
        inquiryType
      });

      const emailResult = await sendContactEmail({
        name,
        email,
        phone,
        company,
        subject,
        message,
        inquiryType
      });

      if (emailResult.success) {
        return res.status(201).json({
          success: true,
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: 'Message saved but email sending failed. We will contact you soon.'
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      return res.status(500).json({
        success: false,
        message: 'There was an error processing your request. Please try again.'
      });
    }
  }
);

// ============================================
// GET ALL SUBMISSIONS (Admin only - add auth later)
// ============================================
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Contact.find()
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;