const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendTelegramMessage } = require('../services/telegram');

// Format contact message for Telegram
const formatContactMessage = (data) => {
  const { name, email, phone, company, subject, message, inquiryType } = data;
  
  return `
📩 <b>NEW CONTACT FORM SUBMISSION</b>
━━━━━━━━━━━━━━━━━━━━━━

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📞 <b>Phone:</b> ${phone}
🏢 <b>Company:</b> ${company || 'N/A'}
📋 <b>Subject:</b> ${subject}
📌 <b>Inquiry Type:</b> ${inquiryType || 'General'}

📝 <b>Message:</b>
${message}

━━━━━━━━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString('en-IN')}
  `;
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, phone, company, subject, message, inquiryType } = req.body;

      console.log('💾 Saving contact to database...');
      const contact = await Contact.create({
        name,
        email,
        phone,
        company,
        subject,
        message,
        inquiryType,
        status: 'New'
      });
      console.log(`✅ Contact saved: ${contact._id}`);

      // Send to Telegram
      console.log('📱 Sending to Telegram...');
      const telegramMessage = formatContactMessage({
        name,
        email,
        phone,
        company,
        subject,
        message,
        inquiryType
      });
      
      const telegramResult = await sendTelegramMessage(telegramMessage);

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        telegramSent: telegramResult.success,
        data: contact
      });

    } catch (error) {
      console.error('❌ Contact form error:', error);
      return res.status(500).json({
        success: false,
        message: 'There was an error processing your request. Please try again.'
      });
    }
  }
);

// ===== GET ALL SUBMISSIONS =====
router.get('/submissions', async (req, res) => {
  try {
    console.log('📋 Fetching contact submissions...');
    const { status } = req.query;
    const filter = status ? { status } : {};
    const submissions = await Contact.find(filter)
      .sort({ createdAt: -1 });
    console.log(`✅ Found ${submissions.length} submissions`);
    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error('❌ Error fetching submissions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const updateContactStatus = async (req, res) => {
  try {
    const id = req.params.id || req.params.contactId;
    const { status } = req.body;
    
    console.log(`🔄 Updating contact status: ${id} -> ${status}`);
    
    // Validate status
    const validStatuses = ['New', 'Read', 'Replied', 'Archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    
    console.log(`✅ Contact status updated: ${id} -> ${status}`);
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('❌ Status update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== UPDATE SUBMISSION STATUS =====
router.patch('/:id/status', updateContactStatus);

// Backward-compatible aliases for older clients/deployments.
router.patch('/status/:id', updateContactStatus);
router.put('/:id/status', updateContactStatus);

module.exports = router;