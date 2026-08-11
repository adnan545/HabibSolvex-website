const axios = require('axios');
const fs = require('fs');
const path = require('path');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Send message
const sendTelegramMessage = async (message, options = {}) => {
  if (!botToken || !chatId) {
    console.log('📱 Telegram message (simulated):', message);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      ...options
    });
    
    console.log('✅ Telegram message sent:', response.data.result?.message_id);
    return { success: true, result: response.data };
  } catch (error) {
    console.error('❌ Telegram send error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// ===== DOWNLOAD IMAGE AND CONVERT TO BASE64 =====
const downloadImageAsBase64 = async (fileId) => {
  try {
    if (!botToken) {
      console.log('⚠️ No bot token for image download');
      return null;
    }

    // Get file path from Telegram
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    );
    
    const filePath = fileResponse.data.result.file_path;
    
    // Download the file as buffer
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'arraybuffer'
    });

    // Convert to Base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    
    // Determine MIME type from file extension
    const ext = filePath.split('.').pop().toLowerCase();
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      bmp: 'image/bmp'
    };
    const mimeType = mimeTypes[ext] || 'image/jpeg';
    
    // Return as data URL
    return `data:${mimeType};base64,${base64Image}`;
    
  } catch (error) {
    console.error('❌ Image download error:', error.message);
    return null;
  }
};

module.exports = { sendTelegramMessage, downloadImageAsBase64 };