//const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

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
          <p>© ${new Date().getFullYear()} Your Shop Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send order confirmation email with retry logic
const sendOrderConfirmationEmail = async (options, retries = 3) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Glam Closet" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: `Order Confirmation - Order #${options.orderId}`,
    text: `Your order #${options.orderId} has been placed successfully. Total: ₵${options.amount.toFixed(
      2
    )}. View details at ${process.env.FRONTEND_URL}/orders`,
    html: generateOrderEmailTemplate(options),
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

export default sendOrderConfirmationEmail;