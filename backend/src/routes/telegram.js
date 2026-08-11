const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { sendTelegramMessage, downloadTelegramImage } = require('../services/telegram');

// Temporary storage for image groups
const imageGroups = {};
const GROUP_TIMEOUT = 10000; // 10 seconds to collect all images

// ===== PARSE EVENT FROM TEXT =====
const parseEventFromText = (text) => {
  const lines = text.split('\n').map(line => line.trim());
  const event = {};

  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const keyTrimmed = key.trim().toLowerCase();
      const value = valueParts.join(':').trim();
      
      if (keyTrimmed === 'title') event.title = value;
      else if (keyTrimmed === 'description') event.description = value;
      else if (keyTrimmed === 'date') event.date = value;
      else if (keyTrimmed === 'location') event.location = value;
      else if (keyTrimmed === 'category') event.category = value;
    }
  }

  if (!event.category) event.category = 'Event';
  if (!event.date) {
    const now = new Date();
    event.date = now.toISOString().split('T')[0];
  }

  return event;
};

// ===== TELEGRAM WEBHOOK =====
router.post('/webhook', async (req, res) => {
  try {
    console.log('📩 Telegram webhook received');
    const body = req.body;
    
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text || '';
      const caption = body.message.caption || '';
      const from = body.message.from;
      const messageId = body.message.message_id;

      console.log(`📩 From ${from?.first_name || 'Unknown'}: ${text || caption || '📷 Image'}`);

      // ===== HANDLE IMAGES =====
      if (body.message.photo) {
        const photo = body.message.photo[body.message.photo.length - 1];
        const fileId = photo.file_id;
        const captionText = body.message.caption || '';
        
        // Check if this is part of a media group (album)
        const mediaGroupId = body.message.media_group_id;
        
        if (mediaGroupId) {
          console.log(`📷 Image from group: ${mediaGroupId}`);
          
          // Initialize group if not exists
          if (!imageGroups[mediaGroupId]) {
            imageGroups[mediaGroupId] = {
              images: [],
              caption: captionText,
              chatId: chatId,
              from: from,
              messageIds: [],
              createdAt: Date.now()
            };
          }
          
          // Add image to group
          const imagePath = await downloadTelegramImage(fileId, `event-${Date.now()}.jpg`);
          if (imagePath) {
            imageGroups[mediaGroupId].images.push(imagePath);
          }
          imageGroups[mediaGroupId].messageIds.push(messageId);
          
          // If this is the first image with caption, store it
          if (captionText && !imageGroups[mediaGroupId].eventData) {
            const eventData = parseEventFromText(captionText);
            if (eventData.title) {
              imageGroups[mediaGroupId].eventData = eventData;
            }
          }
          
          // Set timeout to process the group
          if (!imageGroups[mediaGroupId].timer) {
            imageGroups[mediaGroupId].timer = setTimeout(async () => {
              await processImageGroup(mediaGroupId);
            }, GROUP_TIMEOUT);
          }
          
          return res.sendStatus(200);
        }
        
        // ===== SINGLE IMAGE (no media group) =====
        // Parse event from caption
        const eventData = parseEventFromText(captionText);
        
        if (!eventData.title) {
          await sendTelegramMessage(
            `❌ <b>Invalid Event Format</b>\n\nPlease include event details in the caption.\n\n<b>Format:</b>\nNEW EVENT\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event`,
            chatId
          );
          return res.sendStatus(200);
        }

        // Download image
        console.log('📥 Downloading image from Telegram...');
        const imagePath = await downloadTelegramImage(fileId, `event-${Date.now()}.jpg`);
        
        // Create event with image
        const event = await Event.create({
          title: eventData.title,
          description: eventData.description || 'Event from Telegram',
          date: new Date(eventData.date) || new Date(),
          location: eventData.location || 'TBD',
          category: eventData.category || 'Event',
          images: imagePath ? [imagePath] : [],
          files: [],
          isPublished: true
        });

        console.log('✅ Event created with image:', event._id);

        await sendTelegramMessage(
          `✅ <b>EVENT CREATED WITH IMAGE!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Image:</b> ✅ Uploaded\n\n🔗 <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events">View on Website →</a>`,
          chatId
        );

        return res.sendStatus(200);
      }

      // ===== HANDLE TEXT MESSAGES =====
      const isEventCommand = text.toLowerCase().includes('new event') || 
                            text.toLowerCase().includes('event:') ||
                            text.includes('EVENT');

      // /help or /start
      if (text === '/help' || text === '/start') {
        await sendTelegramMessage(
          `🤖 <b>Habib Solvex Bot</b>\n\n<i>To create an event with images:</i>\n1. Send multiple photos at once\n2. Add caption with event details on the FIRST photo\n\n<b>Caption Format:</b>\nNEW EVENT\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event\n\n<i>Or send text only:</i>\n/event Title | Description | Date | Location | Category\n\n<i>Commands:</i>\n/events - View all events\n/help - Show this message`,
          chatId
        );
        return res.sendStatus(200);
      }

      // /events
      if (text === '/events') {
        const events = await Event.find({ isPublished: true })
          .sort({ date: -1 })
          .limit(5);
        
        if (events.length === 0) {
          await sendTelegramMessage(`📋 <b>No events found</b>`, chatId);
        } else {
          let message = `📋 <b>Latest Events</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;
          events.forEach((e, i) => {
            message += `${i + 1}. <b>${e.title}</b>\n`;
            message += `   📅 ${new Date(e.date).toLocaleDateString('en-IN')}\n`;
            message += `   📍 ${e.location || 'TBD'}\n`;
            message += `   📂 ${e.category}\n`;
            message += `   🖼️ ${e.images && e.images.length > 0 ? `✅ ${e.images.length} image(s)` : '❌ No image'}\n\n`;
          });
          message += `🔗 <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events">View all →</a>`;
          await sendTelegramMessage(message, chatId);
        }
        return res.sendStatus(200);
      }

      // /event command
      if (text.startsWith('/event')) {
        const parts = text.replace('/event', '').trim().split('|');
        if (parts.length >= 2) {
          const eventData = {
            title: parts[0].trim(),
            description: parts[1]?.trim() || 'Event from Telegram',
            date: parts[2]?.trim() || new Date().toISOString().split('T')[0],
            location: parts[3]?.trim() || 'TBD',
            category: parts[4]?.trim() || 'Event'
          };

          const event = await Event.create({
            title: eventData.title,
            description: eventData.description,
            date: new Date(eventData.date),
            location: eventData.location,
            category: eventData.category,
            images: [],
            files: [],
            isPublished: true
          });

          await sendTelegramMessage(
            `✅ <b>EVENT CREATED!</b>\n\n📌 ${event.title}\n📅 ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 ${event.location}\n🖼️ No image\n\n🔗 <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events">View on Website →</a>`,
            chatId
          );
        } else {
          await sendTelegramMessage(
            `❌ <b>Invalid format</b>\n\nUse:\n/event Title | Description | Date | Location | Category`,
            chatId
          );
        }
        return res.sendStatus(200);
      }

      // NEW EVENT text
      if (isEventCommand) {
        const eventData = parseEventFromText(text);
        
        if (!eventData.title) {
          await sendTelegramMessage(
            `❌ <b>Invalid Event Format</b>\n\nPlease send:\nNEW EVENT\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event\n\n<i>Or send photos with caption!</i>`,
            chatId
          );
          return res.sendStatus(200);
        }

        const event = await Event.create({
          title: eventData.title,
          description: eventData.description || 'Event from Telegram',
          date: new Date(eventData.date) || new Date(),
          location: eventData.location || 'TBD',
          category: eventData.category || 'Event',
          images: [],
          files: [],
          isPublished: true
        });

        await sendTelegramMessage(
          `✅ <b>EVENT CREATED!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Image:</b> ❌ No image\n\nℹ️ <i>To add images, send photos with caption next time.</i>\n\n🔗 <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events">View on Website →</a>`,
          chatId
        );

        return res.sendStatus(200);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    res.sendStatus(500);
  }
});

// ===== PROCESS IMAGE GROUP =====
async function processImageGroup(mediaGroupId) {
  try {
    const group = imageGroups[mediaGroupId];
    if (!group) return;
    
    console.log(`📦 Processing image group: ${mediaGroupId}`);
    console.log(`📦 Images: ${group.images.length}`);
    
    // Check if we have event data
    if (!group.eventData || !group.eventData.title) {
      // No valid event data, send error message
      const errorMsg = group.images.length > 0 
        ? `❌ <b>Invalid Event Format</b>\n\nYou sent ${group.images.length} image(s) but no event details in the caption.\n\nPlease send again with:\n<b>NEW EVENT</b>\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event`
        : `❌ <b>No Event Details</b>\n\nPlease send with caption containing event details.`;
      
      await sendTelegramMessage(errorMsg, group.chatId);
      
      // Clean up
      delete imageGroups[mediaGroupId];
      return;
    }
    
    // Create event with all images
    const event = await Event.create({
      title: group.eventData.title,
      description: group.eventData.description || 'Event from Telegram',
      date: new Date(group.eventData.date) || new Date(),
      location: group.eventData.location || 'TBD',
      category: group.eventData.category || 'Event',
      images: group.images,
      files: [],
      isPublished: true
    });
    
    console.log(`✅ Event created with ${group.images.length} images:`, event._id);
    
    await sendTelegramMessage(
      `✅ <b>EVENT CREATED WITH ${group.images.length} IMAGES!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Images:</b> ✅ ${group.images.length} uploaded\n\n🔗 <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events">View on Website →</a>`,
      group.chatId
    );
    
    // Clean up
    delete imageGroups[mediaGroupId];
    
  } catch (error) {
    console.error('❌ Error processing image group:', error);
    // Clean up on error
    delete imageGroups[mediaGroupId];
  }
}

// Cleanup old groups periodically (every 30 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [id, group] of Object.entries(imageGroups)) {
    if (now - group.createdAt > 30000) {
      console.log(`🧹 Cleaning up old group: ${id}`);
      delete imageGroups[id];
    }
  }
}, 30000);

module.exports = router;