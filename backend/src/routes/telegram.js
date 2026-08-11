const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { sendTelegramMessage, downloadImageAsBase64 } = require('../services/telegram');

// Temporary storage for image groups
const imageGroups = {};
const GROUP_TIMEOUT = 15000;

// ===== PARSE EVENT FROM TEXT WITH BETTER DATE HANDLING =====
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

  // Set defaults
  if (!event.category) event.category = 'Event';
  
  // ===== IMPROVED DATE HANDLING =====
  if (!event.date) {
    const now = new Date();
    event.date = now.toISOString();
  } else {
    try {
      // Try to parse the date
      let parsedDate = new Date(event.date);
      
      // If invalid, try common formats
      if (isNaN(parsedDate.getTime())) {
        // Try DD-MM-YYYY
        const parts = event.date.split(/[-/]/);
        if (parts.length === 3) {
          // Check if it's DD-MM-YYYY
          if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          } else if (parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
            // YYYY-MM-DD
            parsedDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          }
        }
        
        // If still invalid, use current date
        if (isNaN(parsedDate.getTime())) {
          console.log(`⚠️ Invalid date format: "${event.date}", using current date`);
          parsedDate = new Date();
        }
      }
      
      event.date = parsedDate.toISOString();
    } catch (error) {
      console.log(`⚠️ Error parsing date: "${event.date}", using current date`);
      event.date = new Date().toISOString();
    }
  }

  console.log('📝 Parsed event:', event);
  return event;
};

// ===== PROCESS IMAGE GROUP =====
async function processImageGroup(mediaGroupId) {
  try {
    const group = imageGroups[mediaGroupId];
    if (!group) return;
    
    console.log(`📦 Processing image group: ${mediaGroupId}`);
    console.log(`📦 Images: ${group.images.length}`);
    
    if (!group.eventData || !group.eventData.title) {
      const errorMsg = group.images.length > 0 
        ? `❌ <b>Invalid Event Format</b>\n\nYou sent ${group.images.length} image(s) but no event details in the caption.\n\nPlease send again with:\n<b>NEW EVENT</b>\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event`
        : `❌ <b>No Event Details</b>`;
      
      await sendTelegramMessage(errorMsg, group.chatId);
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
      `✅ <b>EVENT CREATED WITH ${group.images.length} IMAGES!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Images:</b> ✅ ${group.images.length} saved in MongoDB\n\n🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View on Website →</a>`,
      group.chatId
    );
    
    delete imageGroups[mediaGroupId];
    
  } catch (error) {
    console.error('❌ Error processing image group:', error);
    delete imageGroups[mediaGroupId];
  }
}

// ===== TELEGRAM WEBHOOK =====
router.post('/webhook', async (req, res) => {
  try {
    console.log('📩 Telegram webhook received');
    const body = req.body;
    
    if (!body.message) {
      return res.sendStatus(200);
    }

    const chatId = body.message.chat.id;
    const text = body.message.text || '';
    const caption = body.message.caption || '';
    const from = body.message.from;

    console.log(`📩 From ${from?.first_name || 'Unknown'}: ${text || caption || '📷 Image'}`);

    // ===== HANDLE IMAGES =====
    if (body.message.photo) {
      console.log('📷 Image received!');
      
      const photo = body.message.photo[body.message.photo.length - 1];
      const fileId = photo.file_id;
      const captionText = body.message.caption || '';
      const mediaGroupId = body.message.media_group_id;
      
      // Parse event data from caption
      const eventData = parseEventFromText(captionText);
      
      // If no title, send error
      if (!eventData.title) {
        await sendTelegramMessage(
          `❌ <b>Invalid Event Format</b>\n\nPlease include event details in the caption.\n\n<b>Example:</b>\nNEW EVENT\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event\n\n📅 <b>Date formats accepted:</b>\n• 2026-03-15 (YYYY-MM-DD)\n• 15-03-2026 (DD-MM-YYYY)`,
          chatId
        );
        return res.sendStatus(200);
      }

      // ===== DOWNLOAD IMAGE =====
      console.log('📥 Downloading image as Base64...');
      const base64Image = await downloadImageAsBase64(fileId);
      
      // If image download fails, create event without image
      if (!base64Image) {
        console.log('⚠️ Image download failed. Creating event without image.');
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
          `✅ <b>EVENT CREATED!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Image:</b> ❌ Could not download image\n\n🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View on Website →</a>`,
          chatId
        );
        return res.sendStatus(200);
      }
      
      // ===== MULTIPLE IMAGES (GROUP) =====
      if (mediaGroupId) {
        console.log(`📷 Adding to group: ${mediaGroupId}`);
        
        if (!imageGroups[mediaGroupId]) {
          imageGroups[mediaGroupId] = {
            images: [],
            eventData: eventData,
            chatId: chatId,
            from: from,
            createdAt: Date.now()
          };
        }
        
        imageGroups[mediaGroupId].images.push(base64Image);
        
        if (!imageGroups[mediaGroupId].timer) {
          imageGroups[mediaGroupId].timer = setTimeout(async () => {
            await processImageGroup(mediaGroupId);
          }, GROUP_TIMEOUT);
          console.log(`⏰ Timer set for group: ${mediaGroupId}`);
        }
        
        return res.sendStatus(200);
      }
      
      // ===== SINGLE IMAGE =====
      const event = await Event.create({
        title: eventData.title,
        description: eventData.description || 'Event from Telegram',
        date: new Date(eventData.date) || new Date(),
        location: eventData.location || 'TBD',
        category: eventData.category || 'Event',
        images: [base64Image],
        files: [],
        isPublished: true
      });

      console.log('✅ Event created with image:', event._id);

      await sendTelegramMessage(
        `✅ <b>EVENT CREATED WITH IMAGE!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n🖼️ <b>Image:</b> ✅ Saved in MongoDB\n\n🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View on Website →</a>`,
        chatId
      );

      return res.sendStatus(200);
    }

    // ===== TEXT MESSAGES =====
    const isEventCommand = text.toLowerCase().includes('new event') || 
                          text.toLowerCase().includes('event:') ||
                          text.includes('EVENT');

    // /help or /start
    if (text === '/help' || text === '/start') {
      await sendTelegramMessage(
        `🤖 <b>Habib Solvex Bot</b>\n\n<i>To create an event:</i>\nSend:\n<b>NEW EVENT</b>\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event\n\n📅 <b>Date formats accepted:</b>\n• 2026-03-15 (YYYY-MM-DD)\n• 15-03-2026 (DD-MM-YYYY)\n\n<i>Commands:</i>\n/events - View all events\n/help - Show this message`,
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
        message += `🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View all →</a>`;
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
          date: new Date(eventData.date) || new Date(),
          location: eventData.location,
          category: eventData.category,
          images: [],
          files: [],
          isPublished: true
        });

        await sendTelegramMessage(
          `✅ <b>EVENT CREATED!</b>\n\n📌 ${event.title}\n📅 ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 ${event.location}\n\n🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View on Website →</a>`,
          chatId
        );
      } else {
        await sendTelegramMessage(
          `❌ <b>Invalid format</b>\n\nUse:\n/event Title | Description | Date | Location | Category\n\n📅 <b>Date format:</b> 2026-03-15 or 15-03-2026`,
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
          `❌ <b>Invalid Event Format</b>\n\nPlease send:\nNEW EVENT\nTitle: Event Name\nDescription: Event description\nDate: 2026-03-15\nLocation: City, Country\nCategory: Event\n\n📅 <b>Date formats accepted:</b>\n• 2026-03-15 (YYYY-MM-DD)\n• 15-03-2026 (DD-MM-YYYY)`,
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
        `✅ <b>EVENT CREATED!</b>\n━━━━━━━━━━━━━━━━━━━━━━\n\n📌 <b>Title:</b> ${event.title}\n📂 <b>Category:</b> ${event.category}\n📅 <b>Date:</b> ${new Date(event.date).toLocaleDateString('en-IN')}\n📍 <b>Location:</b> ${event.location || 'TBD'}\n\n🔗 <a href="${process.env.CLIENT_URL || 'https://habib-solvex-website.vercel.app'}/events">View on Website →</a>`,
        chatId
      );

      return res.sendStatus(200);
    }

    // Unknown message
    if (text.startsWith('/')) {
      await sendTelegramMessage(`❌ Unknown command. Send /help for options.`, chatId);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    console.error('❌ Stack:', error.stack);
    
    // Send error message to user
    try {
      const chatId = req.body?.message?.chat?.id;
      if (chatId) {
        await sendTelegramMessage(
          `❌ <b>Error creating event</b>\n\n${error.message}\n\nPlease try again with the correct format.`,
          chatId
        );
      }
    } catch (e) {
      console.error('❌ Failed to send error message:', e);
    }
    
    res.sendStatus(500);
  }
});

// Cleanup old groups
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