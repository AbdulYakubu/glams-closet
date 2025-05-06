import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create email transporter based on environment
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && process.env.SENDGRID_API_KEY) {
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
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

// Generate HTML template for order confirmation email
const generateOrderEmailTemplate = ({ orderId, items, amount, address, paymentMethod }) => {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.size || "N/A"}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">GHS ${item.price.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #333;">Order Confirmation - Glam Closet</h2>
      <p style="color: #555;">Thank you for your order! Below are the details of your purchase.</p>
      <h3 style="color: #333;">Order #${orderId}</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Size</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <p style="color: #555;"><strong>Total Amount:</strong> GHS ${amount.toFixed(2)}</p>
      <p style="color: #555;"><strong>Payment Method:</strong> ${paymentMethod}</p>
      <h3 style="color: #333;">Shipping Address</h3>
      <p style="color: #555;">
        ${address.firstName} ${address.lastName}<br />
        ${address.street ? address.street + "<br />" : ""}
        ${address.city}, ${address.state ? address.state + "," : ""} ${address.country}<br />
        ${address.digitalAddress ? "Digital Address: " + address.digitalAddress + "<br />" : ""}
        Phone: ${address.phone}
      </p>
      <p style="color: #555;">We'll notify you when your order ships. Thank you for shopping with Glam Closet!</p>
      <p style="color: #555; text-align: center;">
        <a href="${process.env.FRONTEND_URL}/orders" style="color: #007bff; text-decoration: none;">View Order Details</a>
      </p>
    </div>
  `;
};

// Generate HTML template for welcome email
const generateWelcomeEmailTemplate = ({ name }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #333;">Welcome to Glam Closet, ${name}!</h2>
      <p style="color: #555;">We're thrilled to have you with us. Explore our latest collections and enjoy a seamless shopping experience.</p>
      <p style="color: #555; text-align: center;">
        <a href="${process.env.FRONTEND_URL}/collection" style="color: #007bff; text-decoration: none;">Start Shopping</a>
      </p>
    </div>
  `;
};

// Generate HTML template for cart reminder email
const generateCartReminderEmailTemplate = ({ name, cartItems }) => {
  const itemList = cartItems
    .map((item) => `<li style="color: #555;">${item.name} - GHS ${item.price.toFixed(2)}</li>`)
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #333;">Don't Forget Your Cart, ${name}!</h2>
      <p style="color: #555;">You left some items in your cart. Complete your purchase now!</p>
      <ul style="color: #555; padding-left: 20px;">
        ${itemList}
      </ul>
      <p style="color: #555; text-align: center;">
        <a href="${process.env.FRONTEND_URL}/cart" style="color: #007bff; text-decoration: none;">Return to Cart</a>
      </p>
    </div>
  `;
};

// Generate HTML template for password reset email
const generatePasswordResetEmailTemplate = ({ name, resetUrl }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p style="color: #555;">Hello ${name},</p>
      <p style="color: #555;">You requested a password reset for your Glam Closet account. Click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </p>
      <p style="color: #555;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
      <p style="color: #555;">Best regards,<br>The Glam Closet Team</p>
    </div>
  `;
};

// Send email with retry logic
const sendEmail = async ({ to, subject, text, html }, retries = 3) => {
  // Validate 'to' field to prevent "No recipients defined" error
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!to || !emailRegex.test(to)) {
    console.error("Invalid or missing recipient email:", to);
    throw new Error("Valid recipient email is required");
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Glam Closet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  console.log("Sending email with mailOptions:", {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
  });

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
const sendOrderConfirmationEmail = async ({ to, orderId, items, amount, address, paymentMethod }) => {
  const subject = `Order Confirmation - #${orderId}`;
  const text = `Your order #${orderId} has been placed successfully. Total: GHS ${amount.toFixed(2)}.`;
  const html = generateOrderEmailTemplate({ orderId, items, amount, address, paymentMethod });

  return await sendEmail({ to, subject, text, html });
};

// Send welcome email
const sendWelcomeEmail = async ({ to, name }) => {
  const subject = "Welcome to Glam Closet!";
  const text = `Welcome, ${name}! Explore our latest collections at Glam Closet.`;
  const html = generateWelcomeEmailTemplate({ name });

  return await sendEmail({ to, subject, text, html });
};

// Send cart reminder email
const sendCartReminderEmail = async ({ to, name, cartItems }) => {
  const subject = "Your Glam Closet Cart Awaits!";
  const text = `Hi ${name}, you left items in your cart. Complete your purchase now!`;
  const html = generateCartReminderEmailTemplate({ name, cartItems });

  return await sendEmail({ to, subject, text, html });
};

// Send password reset email
const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const subject = "Password Reset Request";
  const text = `Hello ${name},\n\nYou requested a password reset. Click the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`;
  const html = generatePasswordResetEmailTemplate({ name, resetUrl });

  return await sendEmail({ to, subject, text, html });
};

export { sendOrderConfirmationEmail, sendWelcomeEmail, sendCartReminderEmail, sendPasswordResetEmail };