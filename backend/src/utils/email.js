const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpSecure = process.env.SMTP_SECURE === 'true';

// Prefer explicit SMTP settings, but keep Gmail-compatible defaults for existing deployments.
const isEmailConfigured = Boolean(emailUser && emailPass);

let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  transporter.verify()
    .then(() => {
      console.log(`📧 Email service configured via ${smtpHost}:${smtpPort}`);
    })
    .catch((error) => {
      console.error('❌ Email transporter verification failed:', error.message);
    });
} else {
  console.log('⚠️ Email not configured - contact emails will not be sent');
}

const sendContactEmail = async (contactData) => {
  const { name, email, phone, company, subject, message, inquiryType } = contactData;

  // If email is not configured, return a clear failure so the caller can surface it.
  if (!isEmailConfigured || !transporter) {
    console.log('📧 Email not sent (config missing):');
    console.log(`  To: ${emailUser || 'admin@example.com'}`);
    console.log(`  From: ${email}`);
    console.log(`  Subject: New Contact Form Submission: ${subject}`);
    console.log(`  Message: ${message.substring(0, 200)}...`);
    return { success: false, error: 'Email service is not configured on the server.' };
  }

  // Admin email
  const adminMailOptions = {
    from: `Habib Solvex <${emailUser}>`,
    to: emailUser,
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #fcf9f2; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e8d5a3; }
          .header { border-bottom: 3px solid #c49a2c; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { color: #0a3d3a; margin: 0; }
          .header span { color: #c49a2c; }
          .field { margin-bottom: 15px; }
          .label { font-weight: 600; color: #0a3d3a; display: block; margin-bottom: 3px; }
          .value { color: #1e2b2a; padding: 8px 12px; background: #f8f6f0; border-radius: 6px; }
          .message-box { background: #f8f6f0; padding: 15px; border-radius: 8px; border-left: 4px solid #c49a2c; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0d8c8; color: #6b7a76; font-size: 13px; text-align: center; }
          .badge { display: inline-block; background: #e8d5a3; color: #0a3d3a; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Habib<span>Solvex</span></h1><p style="color: #6b7a76; margin: 5px 0 0;">New Contact Form Submission</p></div>
          <div class="field"><span class="label">Name</span><div class="value">${name}</div></div>
          <div class="field"><span class="label">Email</span><div class="value">${email}</div></div>
          <div class="field"><span class="label">Phone</span><div class="value">${phone}</div></div>
          <div class="field"><span class="label">Company</span><div class="value">${company || 'N/A'}</div></div>
          <div class="field"><span class="label">Subject</span><div class="value">${subject}</div></div>
          <div class="field"><span class="label">Inquiry Type</span><div class="value"><span class="badge">${inquiryType || 'General'}</span></div></div>
          <div class="field"><span class="label">Message</span><div class="message-box">${message}</div></div>
          <div class="footer"><p>This message was sent from the Habib Solvex website contact form.</p></div>
        </div>
      </body>
      </html>
    `
  };

  // User auto-reply
  const userMailOptions = {
    from: `Habib Solvex <${emailUser}>`,
    to: email,
    subject: 'Thank you for contacting Habib Solvex',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #fcf9f2; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 12px; border: 1px solid #e8d5a3; }
          .header { border-bottom: 3px solid #c49a2c; padding-bottom: 15px; margin-bottom: 20px; }
          .header h1 { color: #0a3d3a; margin: 0; }
          .header span { color: #c49a2c; }
          .thank-you { color: #0a3d3a; font-size: 20px; margin: 20px 0; }
          .message-box { background: #f8f6f0; padding: 20px; border-radius: 8px; border-left: 4px solid #c49a2c; margin: 20px 0; }
          .signature { margin-top: 25px; }
          .signature h4 { color: #0a3d3a; margin: 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0d8c8; color: #6b7a76; font-size: 13px; text-align: center; }
          .contact-links { display: flex; gap: 20px; justify-content: center; margin: 15px 0; }
          .contact-links a { color: #0a3d3a; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Habib<span>Solvex</span></h1></div>
          <div class="thank-you">Thank You, ${name}!</div>
          <p>We have received your inquiry regarding <strong>${inquiryType || 'our products'}</strong>.</p>
          <div class="message-box">
            <p style="margin: 0;"><strong>What happens next?</strong></p>
            <p style="margin: 8px 0 0;">Our team will review your inquiry and get back to you within 24 business hours.</p>
          </div>
          <div class="contact-links">
            <a href="tel:+919731314007">📞 +91 9731314007</a>
            <a href="mailto:habibsolvex@gmail.com">✉️ habibsolvex@gmail.com</a>
          </div>
          <div class="signature"><h4>Warm Regards,</h4><p style="margin: 5px 0 0; color: #0a3d3a; font-weight: 600;">Team Habib Solvex</p></div>
          <div class="footer"><p>This is an automated response. Please do not reply to this email.</p></div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendContactEmail };