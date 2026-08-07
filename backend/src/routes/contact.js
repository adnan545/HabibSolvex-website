const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/email');

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
    console.log('Request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    try {
      const { name, email, phone, company, subject, message, inquiryType } = req.body;

      // 1. Save to database
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
      console.log('✅ Contact saved:', contact._id);

      // 2. Try to send email
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

      // 3. Return success even if email fails (message is saved)
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
      console.error('Stack trace:', error.stack);
      
      // Check if it's a database error
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error: ' + error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'There was an error processing your request. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

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