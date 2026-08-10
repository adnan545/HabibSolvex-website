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
🔗 View on website: ${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events
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

// Backward-compatible alias for admin list endpoint.
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const createEventHandler = async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    console.log('📝 Creating event:', { title, description, date, location, category });

    const images = req.files?.images
      ? req.files.images.map(file => `/uploads/${file.filename}`)
      : [];

    const files = req.files?.files
      ? req.files.files.map(file => `/uploads/${file.filename}`)
      : [];

    const event = await Event.create({
      title,
      description,
      date: date || new Date(),
      location,
      category: category || 'Event',
      images,
      files,
      isPublished: true
    });

    console.log(`✅ Event created: ${event._id}`);

    try {
      const telegramMessage = formatEventMessage({
        title,
        description,
        date,
        location,
        category
      });
      await sendTelegramMessage(telegramMessage);
      console.log('📱 Telegram notification sent');
    } catch (telegramError) {
      console.error('⚠️ Telegram error:', telegramError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: event
    });
  } catch (error) {
    console.error('❌ Event creation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
};

// ===== CREATE EVENT =====
router.post(
  '/create',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
  ]),
  createEventHandler
);

// Backward-compatible alias for REST-style event creation.
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
  ]),
  createEventHandler
);

const updateEventHandler = async (req, res) => {
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
};

// ===== UPDATE EVENT =====
router.put('/:id', updateEventHandler);

// Backward-compatible alias for update.
router.put('/update/:id', updateEventHandler);

const deleteEventHandler = async (req, res) => {
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
};

// ===== DELETE EVENT =====
router.delete('/:id', deleteEventHandler);

// Backward-compatible alias for delete.
router.delete('/delete/:id', deleteEventHandler);

const toggleEventHandler = async (req, res) => {
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
};

// ===== TOGGLE PUBLISH STATUS =====
router.patch('/:id/toggle', toggleEventHandler);

// Backward-compatible alias for toggle.
router.patch('/toggle/:id', toggleEventHandler);

module.exports = router;