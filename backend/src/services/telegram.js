const axios = require('axios');

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

// ===== DOWNLOAD IMAGE AS BASE64 =====
const downloadImageAsBase64 = async (fileId) => {
  try {
    if (!botToken) {
      console.log('⚠️ No bot token for image download');
      return null;
    }

    console.log(`📷 Downloading image: ${fileId}`);

    // Get file path from Telegram
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
    );
    
    if (!fileResponse.data.ok) {
      console.log('❌ Telegram file response error:', fileResponse.data);
      return null;
    }
    
    const filePath = fileResponse.data.result.file_path;
    console.log(`📷 File path: ${filePath}`);
    
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
    
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    console.log(`✅ Image downloaded: ${dataUrl.length} characters`);
    
    return dataUrl;
    
  } catch (error) {
    console.error('❌ Image download error:', error.message);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', error.response.data);
    }
    return null;
  }
};

module.exports = { sendTelegramMessage, downloadImageAsBase64 };