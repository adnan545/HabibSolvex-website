const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { Event } = require('../models');

router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { isPublished: true },
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/admin', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  '/create',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'files', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const { title, description, date, location, category } = req.body;

      const images = req.files.images 
        ? req.files.images.map(file => `/uploads/${file.filename}`) 
        : [];
      
      const files = req.files.files 
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

      res.status(201).json({
        success: true,
        message: 'Event created successfully!',
        data: event
      });
    } catch (error) {
      console.error('Event creation error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    
    await event.update(updates);
    res.json({ success: true, message: 'Event updated!', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    await event.destroy();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    event.isPublished = !event.isPublished;
    await event.save();
    res.json({ success: true, message: 'Status toggled', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;