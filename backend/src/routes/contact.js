const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/email');

// ===== TEST ROUTE =====
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Contact route is working!',
    timestamp: new Date().toISOString()
  });
});

// ===== SUBMIT CONTACT FORM =====
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
    console.log('📩 Contact form submission received');
    console.log('📩 Request body:', req.body);
    console.log('📩 Headers:', req.headers.origin);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    try {
      const { name, email, phone, company, subject, message, inquiryType } = req.body;

      // Save to database
      console.log('💾 Saving to database...');
      const contact = await Contact.create({
        name,
        email,
        phone,
        company,
        subject,
        message,
        inquiryType
      });
      console.log('✅ Contact saved, ID:', contact._id);

      // Send emails
      console.log('📧 Sending emails...');
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
        console.log('✅ Emails sent successfully');
        return res.status(201).json({
          success: true,
          message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.'
        });
      } else {
        console.log('⚠️ Email sending failed:', emailResult.error);
        return res.status(201).json({
          success: true,
          message: 'Your message has been received. We will contact you soon.',
          emailWarning: 'Email notification failed, but your message is saved.'
        });
      }
    } catch (error) {
      console.error('❌ Contact form error:', error);
      return res.status(500).json({
        success: false,
        message: 'There was an error processing your request. Please try again.'
      });
    }
  }
);

// ===== GET SUBMISSIONS =====
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Contact.find()
      .sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;