import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";
import dotenv from "dotenv";

dotenv.config();

const placeOrder = async (req, res) => {
  console.log("Starting placeOrder");
  const { items, amount, address, email, paymentMethod, pickupLocation } = req.body;
  const userId = req.userId;

  console.log("Place Order Request:", {
    userId,
    paymentMethod,
    body: JSON.stringify(req.body, null, 2),
  });

  try {
    if (!userId) {
      console.error("User ID is required");
      return res.status(401).json({ success: false, message: "User ID is required" });
    }

    if (!["COD", "Pickup"].includes(paymentMethod)) {
      console.error("Invalid paymentMethod:", paymentMethod);
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Must be 'COD' or 'Pickup'",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Items validation failed:", items);
      return res.status(400).json({
        success: false,
        message: "Items are required and must be a non-empty array",
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items:", items);
      return res.status(400).json({
        success: false,
        message: "Items are required and must be a non-empty array",
      });
    }

    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.error("Invalid amount:", amount);
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    // Validate address
    if (!address || typeof address !== "object") {
      console.error("Invalid address:", address);
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.error("Invalid or missing email:", email);
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    // Validate item fields
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item._id || !item.name || !item.quantity || !item.price) {
        console.error(`Invalid item at index ${i}:`, item);
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} missing required fields (_id, name, quantity, price)`,
        });
      }
      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        console.error(`Invalid quantity for item at index ${i}:`, item.quantity);
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} has invalid quantity`,
        });
      }
      if (typeof item.price !== "number" || item.price <= 0) {
        console.error(`Invalid price for item at index ${i}:`, item.price);
        return res.status(400).json({
          success: false,
          message: `Item at index ${i} has invalid price`,
        });
      }
    }

    // Validate address fields
    const requiredAddressFields = ["firstName", "lastName", "city", "country", "phone"];
    for (const field of requiredAddressFields) {
      if (!address[field]) {
        console.error("Missing address field:", field);
        return res.status(400).json({
          success: false,
          message: `Address ${field} is required`,
        });
      }
    }

    // Verify user existence
    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prepare order data
    const orderData = {
      userId: new mongoose.Types.ObjectId(userId),
      email,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "",
        image: Array.isArray(item.image) ? item.image : [item.image || ""],
      })),
      amount,
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street || "",
        city: address.city,
        state: address.region || "",
        country: address.country,
        digitalAddress: address.digitalAddress || "",
        phone: address.phone,
      },
      paymentMethod,
      payment: false,
      paymentStatus: "pending",
      status: paymentMethod === "Pickup" ? "Ready for Pickup" : "Packing",
      date: new Date(),
    };

    console.log(`Attempting to save ${paymentMethod} order:`, JSON.stringify(orderData, null, 2));
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log(`${paymentMethod} Order saved successfully:`, savedOrder._id);

    // Verify order in database
    const verifiedOrder = await orderModel.findById(savedOrder._id);
    if (!verifiedOrder) {
      console.error("Order not found after save:", savedOrder._id);
      return res.status(500).json({
        success: false,
        message: "Order save verification failed",
      });
    }
    console.log("Order verified in database:", verifiedOrder._id);

    // Clear user cart
    console.log("Clearing user cart for user:", userId);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cartData: {} },
      { new: true }
    );
    if (!updatedUser) {
      console.warn("Failed to clear cart for user:", userId);
    } else {
      console.log("User cart cleared successfully");
    }

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        to: email,
        orderId: savedOrder._id,
        items: savedOrder.items,
        amount: savedOrder.amount,
        address: savedOrder.address,
        paymentMethod: savedOrder.paymentMethod,
      });
      console.log("Order confirmation email sent to:", email);
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }

    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error(`${paymentMethod || "Place Order"} Error:`, {
      message: error.message,
      stack: error.stack,
      body: JSON.stringify(req.body, null, 2),
    zoology: true,
    });
    res.status(500).json({
      success: false,
      message: error.message || `Failed to place ${paymentMethod || "order"}`,
    });
  }
};

// The rest of the file remains unchanged
const placeOrderPayStack = async (req, res) => {
  console.log("Starting placeOrderPayStack");
  const { email, amount, items, address } = req.body;
  const userId = req.userId;

  console.log("Paystack Request:", { userId, body: JSON.stringify(req.body, null, 2) });

  try {
    // Validate userId
    if (!userId) {
      console.error("No userId provided");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    // Validate email with regex to ensure it's valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      console.error("Invalid or missing email:", email);
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    // Validate required fields
    if (!amount || !items || !items.length || !address) {
      console.error("Missing fields:", { email, amount, items, address });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate items
    for (const item of items) {
      if (!item._id || !item.name || !item.quantity || !item.price) {
        console.error("Invalid item format:", item);
        return res.status(400).json({ success: false, message: "Invalid item format" });
      }
    }

    // Validate address
    if (!address.firstName || !address.lastName || !address.city || !address.country || !address.phone) {
      console.error("Invalid address format:", address);
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderData = {
      userId: new mongoose.Types.ObjectId(userId),
      email,
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || "",
        image: Array.isArray(item.image) ? item.image : [item.image || ""],
      })),
      amount,
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street || "",
        city: address.city,
        state: address.region || "",
        country: address.country,
        digitalAddress: address.digitalAddress || "",
        phone: address.phone,
      },
      paymentMethod: "Paystack",
      payment: false,
      paymentStatus: "pending",
      status: "Packing",
      date: new Date(),
    };

    console.log("Attempting to save Paystack order:", JSON.stringify(orderData, null, 2));
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log("Paystack Order saved successfully:", savedOrder._id);

    // Initialize Paystack transaction
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert to kobo
        currency: "GHS",
        callback_url: `${process.env.FRONTEND_URL}/paystack/callback`,
        metadata: { order_id: savedOrder._id.toString() },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!paystackResponse.data.status) {
      console.error("Paystack initialization failed:", paystackResponse.data);
      await orderModel.findByIdAndDelete(savedOrder._id);
      return res.status(400).json({ success: false, message: "Payment initialization failed" });
    }

    console.log("Paystack transaction initialized:", paystackResponse.data.data.reference);
    res.json({
      success: true,
      authorization_url: paystackResponse.data.data.authorization_url,
      reference: paystackResponse.data.data.reference,
    });
  } catch (error) {
    console.error("Paystack Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      body: JSON.stringify(req.body, null, 2),
    });
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Transaction initialization failed",
    });
  }
};

// Paystack callback handler
const paystackCallback = async (req, res) => {
  console.log("Starting paystackCallback");
  const { reference } = req.query;

  try {
    if (!reference) {
      console.error("No reference provided");
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    console.log("Verifying Paystack transaction:", reference);
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    console.log("Paystack Verification Response:", response.data);

    if (!response.data.status || response.data.data.status !== "success") {
      console.error("Payment not successful:", response.data);
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    const orderId = response.data.data.metadata.order_id;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("Invalid orderId:", orderId);
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    console.log("Updating order:", orderId);
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        payment: true,
        paymentStatus: "completed",
        reference,
      },
      { new: true }
    );

    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.email) {
      try {
        await sendOrderConfirmationEmail({
          to: order.email,
          orderId: order._id,
          items: order.items,
          amount: order.amount,
          address: order.address,
          paymentMethod: order.paymentMethod,
        });
        console.log("Order confirmation email sent to:", order.email);
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }
    }

    console.log("Clearing user cart for user:", order.userId);
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} }, { new: true });

    return res.json({
      success: true,
      orderId,
      message: "Payment verified successfully",
      redirectUrl: `${process.env.FRONTEND_URL}/orders`,
    });
  } catch (error) {
    console.error("Callback Error:", error);
    return res.status(500).json({
      success: false,
      message: "Callback processing failed",
      error: error.message,
    });
  }
};

const verifyPayStack = async (req, res) => {
  const { reference } = req.params;
  const userId = req.userId;

  try {
    console.log("Verifying Paystack payment, reference:", reference, "userId:", userId);
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;
    console.log("Paystack verification response:", JSON.stringify(paymentData, null, 2));

    if (paymentData.status === "success") {
      const orderId = paymentData.metadata.order_id || reference.replace("order_", "");
      const order = await orderModel.findById(orderId);
      if (!order || order.userId.toString() !== userId) {
        console.error("Unauthorized access or order not found:", { orderId, userId });
        return res.status(403).json({ success: false, message: "Unauthorized access to order" });
      }
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentReference: paymentData.reference,
        paymentStatus: "completed",
        status: "Packing",
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      console.log("Payment verified, order updated:", orderId);
      res.json({ success: true, message: "Payment verified successfully", orderId });
    } else {
      console.log("Payment not successful, status:", paymentData.status);
      res.json({ success: false, message: "Payment not successful", status: paymentData.status });
    }
  } catch (error) {
    console.error("Paystack Verification Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};

const allOrders = async (req, res) => {
  try {
    console.log("Fetching all orders");
    const orders = await orderModel.find({}).sort({ date: -1 });
    console.log("All orders fetched:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("All Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const userOrders = async (req, res) => {
  console.log("Starting userOrders");
  const userId = req.userId;

  try {
    if (!userId) {
      console.error("No userId provided");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    console.log("Fetching orders for user:", userId);
    const orders = await orderModel.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ date: -1 });

    console.log(`Orders found: ${orders.length}`, JSON.stringify(orders, null, 2));
    res.json({ success: true, orders });
  } catch (error) {
    console.error("userOrders Error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log("Updating status for order:", orderId, "to:", status);
    if (!["Packing", "Shipped", "Out for Delivery", "Delivered", "Ready for Pickup", "Cancelled"].includes(status)) {
      console.error("Invalid status:", status);
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    console.log("Status updated:", order);
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

const trackOrder = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.userId;

  console.log("Tracking order:", { orderId, userId });

  try {
    if (!orderId || !userId) {
      console.error("Missing orderId or userId:", { orderId, userId });
      return res.status(400).json({ success: false, message: "Order ID and user ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.error("Invalid orderId format:", orderId);
      return res.status(400).json({ success: false, message: "Invalid order ID format" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId) {
      console.error("Unauthorized access:", { orderId, userId, orderUserId: order.userId });
      return res.status(403).json({ success: false, message: "Unauthorized access to this order" });
    }

    const orderDetails = {
      orderId: order._id,
      date: order.date,
      amount: order.amount,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      status: order.status,
      products: order.items || [],
      address: order.address,
      items: [],
    };

    if (Array.isArray(order.items)) {
      for (const item of order.items) {
        try {
          const product = await productModel.findById(item.productId);
          orderDetails.items.push({
            productId: item.productId,
            name: product ? product.name : item.name || "Unknown Item",
            image: product ? product.image || [] : item.image || [],
            price: item.price || (product ? product.price : 0),
            quantity: item.quantity || 1,
            size: item.size || "",
          });
        } catch (error) {
          console.warn(`Failed to fetch product ${item.productId}:`, error.message);
          orderDetails.items.push({
            productId: item.productId,
            name: item.name || "Unknown Item",
            image: item.image || [],
            price: item.price || 0,
            quantity: item.quantity || 1,
            size: item.size || "",
          });
        }
      }
    } else {
      console.warn("order.items is not an array or is undefined:", order.items);
      orderDetails.products = [];
    }

    console.log("Order details retrieved:", orderDetails);
    res.json({ success: true, order: orderDetails });
  } catch (error) {
    console.error("Track order error:", {
      message: error.message,
      stack: error.stack,
      orderId,
      userId,
    });
    res.status(500).json({ success: false, message: "Error tracking order" });
  }
};

export {
  placeOrder,
  placeOrderPayStack,
  paystackCallback,
  verifyPayStack,
  allOrders,
  userOrders,
  updateStatus,
  trackOrder,
};