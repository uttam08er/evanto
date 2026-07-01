const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_FROM,  
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendVerificationEmail = async (email, name, token) => {
  const transporter = createTransporter();

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Evanto" <${process.env.EMAIL_FROM}>`, 
    to: email,                       
    subject: "Verify Your Evanto Account",      
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7c3aed; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Evanto</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hi ${name}! Welcome to Evanto 🎊</h2>
          <p>Please verify your email address to start booking amazing venues.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background: #7c3aed; color: white; padding: 14px 30px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666;">This link expires in 24 hours.</p>
          <p style="color: #666;">If you didn't register, ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, name, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Evanto" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Evanto Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7c3aed; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Evanto</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #ef4444; color: white; padding: 14px 30px; 
                      text-decoration: none; border-radius: 8px; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #666;">This link expires in 10 minutes.</p>
          <p style="color: #666; font-weight: bold;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendBookingConfirmationEmail = async (email, name, bookingDetails) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Evanto" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Booking Confirmed! - ${bookingDetails.venueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #7c3aed; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Evanto</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #22c55e;">✅ Booking Confirmed!</h2>
          <p>Hi ${name}, your booking has been confirmed!</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666;">Venue:</td>
                  <td style="padding: 8px 0; font-weight: bold;">${bookingDetails.venueName}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Event:</td>
                  <td style="padding: 8px 0;">${bookingDetails.eventType}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Date:</td>
                  <td style="padding: 8px 0;">${new Date(bookingDetails.bookingDate).toDateString()}</td></tr>
              <tr><td style="padding: 8px 0; color: #666;">Guests:</td>
                  <td style="padding: 8px 0;">${bookingDetails.guestCount}</td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-weight: bold;">Total Paid:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #7c3aed;">₹${bookingDetails.totalPrice}</td></tr>
            </table>
          </div>
          
          <p>We hope you have a wonderful event! 🎊</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail,
};
