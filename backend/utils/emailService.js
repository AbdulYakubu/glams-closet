import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure Nodemailer transporter based on environment
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction && process.env.SENDGRID_API_KEY) {
    // SendGrid configuration for production
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Gmail configuration for development
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

// Generate HTML email template for order confirmation
const generateOrderEmailTemplate = ({ orderId, items, amount, address, paymentMethod }) => {
  const itemList = items
    .map(
      (item) => `
        <li>
          <strong>${item.name}</strong> (Size: ${item.size})<br>
          Quantity: ${item.quantity} | Price: ₵${item.price.toFixed(2)}
        </li>
      `
    )
    .join("");

  const addressDetails = `
    ${address.firstName} ${address.lastName}<br>
    ${address.street ? address.street + "<br>" : ""}
    ${address.city}, ${address.region ? address.region + ", " : ""}${address.country}<br>
    ${address.digitalAddress ? "GPS: " + address.digitalAddress + "<br>" : ""}
    Phone: ${address.phone}
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #4f46e5; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; text-align: center; color: #777; }
        a { color: #4f46e5; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Order Confirmation</h2>
        </div>
        <div class="content">
          <p>Dear ${address.firstName},</p>
          <p>Thank you for your order! Your order has been successfully placed.</p>
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₵${amount.toFixed(2)}</p>
          <h3>Items</h3>
          <ul>${itemList}</ul>
          <h3>Shipping Address</h3>
          <p>${addressDetails}</p>
          <p>You can track your order status <a href="${process.env.FRONTEND_URL}/orders">here</a>.</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          <p>© ${new Date().getFullYear()} Glam Closet. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate HTML email template for welcome email
const generateWelcomeEmailTemplate = ({ name }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #4f46e5; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .footer { margin-top: 20px; text-align: center; color: #777; }
        a { color: #4f46e5; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Welcome to Glam Closet!</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Welcome to Glam Closet! We're thrilled to have you with us.</p>
          <p>Start exploring our collection and find your perfect style. Visit our shop <a href="${process.env.FRONTEND_URL}/shop">here</a>.</p>
          <p>Happy shopping!</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          <p>© ${new Date().getFullYear()} Glam Closet. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate HTML email template for cart reminder
const generateCartReminderEmailTemplate = ({ name, items }) => {
  const itemList = items
    .map(
      (item) => `
        <li>
          <strong>${item.name}</strong> (Size: ${item.size})<br>
          Quantity: ${item.quantity} | Price: ₵${item.price.toFixed(2)}
        </li>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #4f46e5; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 10px; }
        .footer { margin-top: 20px; text-align: center; color: #777; }
        a { color: #4f46e5; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Items Waiting in Your Cart!</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We noticed you added some great items to your cart. Don't miss out!</p>
          <h3>Your Cart Items</h3>
          <ul>${itemList}</ul>
          <p>Complete your purchase now by visiting your cart <a href="${process.env.FRONTEND_URL}/cart">here</a>.</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
          <p>© ${new Date().getFullYear()} Glam Closet. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email with retry logic
const sendEmail = async ({ to, subject, text, html }, retries = 3) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Glam Closet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  for (let i = 0; i < retries; i++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error(`Email attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error("All email attempts failed:", error);
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (options) => {
  return sendEmail({
    to: options.to,
    subject: `Order Confirmation - Order #${options.orderId}`,
    text: `Your order #${options.orderId} has been placed successfully. Total: ₵${options.amount.toFixed(
      2
    )}. View details at ${process.env.FRONTEND_URL}/orders`,
    html: generateOrderEmailTemplate(options),
  });
};

// Send welcome email
const sendWelcomeEmail = async ({ to, name }) => {
  return sendEmail({
    to,
    subject: "Welcome to Glam Closet!",
    text: `Welcome, ${name}! Start shopping at ${process.env.FRONTEND_URL}/shop`,
    html: generateWelcomeEmailTemplate({ name }),
  });
};

// Send cart reminder email
const sendCartReminderEmail = async ({ to, name, items }) => {
  return sendEmail({
    to,
    subject: "Your Cart is Waiting!",
    text: `Hi ${name}, you have items in your cart. Complete your purchase at ${process.env.FRONTEND_URL}/cart`,
    html: generateCartReminderEmailTemplate({ name, items }),
  });
};

export  { sendOrderConfirmationEmail, sendWelcomeEmail, sendCartReminderEmail };