const axios = require('axios');
const fs = require('fs');
const path = require('path');

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Send message using direct API call
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

// Send photo
const sendTelegramPhoto = async (photoPath, caption) => {
  if (!botToken || !chatId) {
    console.log('📱 Telegram photo (simulated):', caption);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    
    // Check if photo is a URL or local file
    let photo;
    if (photoPath.startsWith('http')) {
      photo = photoPath;
    } else {
      // Local file - read and send
      const filePath = path.join(__dirname, '../..', photoPath);
      if (fs.existsSync(filePath)) {
        photo = fs.createReadStream(filePath);
      } else {
        photo = photoPath;
      }
    }

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', photo);
    if (caption) {
      formData.append('caption', caption);
      formData.append('parse_mode', 'HTML');
    }

    const response = await axios.post(url, formData, {
      headers: formData.getHeaders ? formData.getHeaders() : {}
    });
    
    return { success: true, result: response.data };
  } catch (error) {
    console.error('❌ Telegram photo send error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Download image from Telegram
const downloadTelegramImage = async (fileId, fileName) => {
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
    
    // Download the file
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    });

    // Save to uploads directory
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `telegram-${uniqueSuffix}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/uploads/${filename}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Image download error:', error.message);
    return null;
  }
};

module.exports = { sendTelegramMessage, sendTelegramPhoto, downloadTelegramImage };