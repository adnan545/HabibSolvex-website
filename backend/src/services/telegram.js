const axios = require('axios');

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
    const response = await axios.post(url, {
      chat_id: chatId,
      photo: photoPath,
      caption: caption,
      parse_mode: 'HTML'
    });
    
    return { success: true, result: response.data };
  } catch (error) {
    console.error('❌ Telegram photo send error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = { sendTelegramMessage, sendTelegramPhoto };