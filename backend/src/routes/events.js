const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const Event = require('../models/Event');
const { sendTelegramMessage } = require('../services/telegram');

// Format event message for Telegram
const formatEventMessage = (data) => {
  const { title, description, date, location, category } = data;
  
  return `
📢 <b>NEW EVENT POSTED!</b>
━━━━━━━━━━━━━━━━━━━━━━

📌 <b>Title:</b> ${title}
📂 <b>Category:</b> ${category || 'Event'}
📅 <b>Date:</b> ${date ? new Date(date).toLocaleDateString('en-IN') : 'TBD'}
📍 <b>Location:</b> ${location || 'TBD'}

📝 <b>Description:</b>
${description}

━━━━━━━━━━━━━━━━━━━━━━
🔗 View on website: ${process.env.CLIENT_URL || 'http://localhost:5173'}/events
🕐 ${new Date().toLocaleString('en-IN')}
  `;
};

// ===== GET ALL PUBLISHED EVENTS =====
router.get('/', async (req, res) => {
  try {
    console.log('📋 Fetching published events...');
    const events = await Event.find({ isPublished: true })
      .sort({ date: -1, createdAt: -1 });
    console.log(`✅ Found ${events.length} published events`);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== GET ALL EVENTS (ADMIN) =====
router.get('/admin', async (req, res) => {
  try {
    console.log('📋 Fetching all events for admin...');
    const events = await Event.find()
      .sort({ createdAt: -1 });
    console.log(`✅ Found ${events.length} events`);
    res.json({ success: true, data: events });
  } catch (error) {
    console.error('❌ Error fetching admin events:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== CREATE EVENT =====
const createEventHandler = async (req, res) => {
  try {
    console.log('📝 Creating event...');
    console.log('📝 Request body:', req.body);
    console.log('📝 Files:', req.files);

    const { title, description, date, location, category } = req.body;

    // Validate required fields
    if (!title || !description) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Process images
    let images = [];
    if (req.files && req.files.images) {
      images = req.files.images.map(file => `/uploads/${file.filename}`);
    }

    let files = [];
    if (req.files && req.files.files) {
      files = req.files.files.map(file => `/uploads/${file.filename}`);
    }

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      date: date ? new Date(date) : new Date(),
      location: location ? location.trim() : null,
      category: category || 'Event',
      images,
      files,
      isPublished: true
    };

    console.log('📝 Event data:', eventData);

    const event = await Event.create(eventData);
    console.log(`✅ Event created: ${event._id}`);

    // Send Telegram notification
    try {
      const telegramMessage = formatEventMessage({
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        category: event.category
      });
      await sendTelegramMessage(telegramMessage);
      console.log('📱 Telegram notification sent');
    } catch (telegramError) {
      console.error('⚠️ Telegram error:', telegramError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: event
    });

  } catch (error) {
    console.error('❌ Event creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
};

// Mount the create handler
router.post(
  '/create',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
  ]),
  createEventHandler
);

// Backward-compatible alias
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
  ]),
  createEventHandler
);

// ===== UPDATE EVENT =====
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    console.log(`📝 Updating event: ${id}`);
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    Object.assign(event, updates);
    await event.save();
    console.log(`✅ Event updated: ${id}`);
    res.json({ success: true, message: 'Event updated!', data: event });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DELETE EVENT =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting event: ${id}`);
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    await event.deleteOne();
    console.log(`✅ Event deleted: ${id}`);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== TOGGLE PUBLISH STATUS =====
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔄 Toggling event status: ${id}`);
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.isPublished = !event.isPublished;
    await event.save();
    console.log(`✅ Event status toggled: ${id} -> ${event.isPublished}`);
    res.json({ success: true, message: 'Status toggled', data: event });
  } catch (error) {
    console.error('❌ Toggle error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;