import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import axios from "axios";
import { sendOrderConfirmationEmail }  from "../utils/emailService.js";
import dotenv from "dotenv"
//const { sendOrderConfirmationEmail } = require("../services/emailService");

//require("dotenv").config();

const placeOrder = async (req, res) => {
  console.log("Starting placeOrder (COD)");
  const { items, amount, address, email } = req.body;
  const userId = req.userId;

  console.log("COD Request:", { userId, body: JSON.stringify(req.body, null, 2) });

  try {
    if (!userId) {
      console.error("No userId provided");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Invalid items:", items);
      return res.status(400).json({ success: false, message: "Items are required and must be a non-empty array" });
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.error("Invalid amount:", amount);
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    if (!address || typeof address !== "object") {
      console.error("Invalid address:", address);
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Validate items
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

    // Validate address
    const requiredAddressFields = ["firstName", "lastName", "city", "country", "phone"];
    for (const field of requiredAddressFields) {
      if (!address[field]) {
        console.error("Missing address field:", field);
        return res.status(400).json({ success: false, message: `Address ${field} is required` });
      }
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderData = {
      userId: new mongoose.Types.ObjectId(userId),
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
      paymentMethod: "COD",
      payment: false,
      paymentStatus: "pending",
      status: "Packing",
      date: new Date(),
    };

    console.log("Attempting to save COD order:", JSON.stringify(orderData, null, 2));
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log("COD Order saved successfully:", savedOrder._id);

    // Verify order in database
    const verifiedOrder = await orderModel.findById(savedOrder._id);
    if (!verifiedOrder) {
      console.error("Order not found after save:", savedOrder._id);
      return res.status(500).json({ success: false, message: "Order save verification failed" });
    }
    console.log("Order verified in database:", verifiedOrder._id);

    console.log("Clearing user cart for user:", userId);
    const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
    if (!updatedUser) {
      console.warn("Failed to clear cart for user:", userId);
    } else {
      console.log("User cart cleared successfully");
    }

    await sendOrderConfirmationEmail({
      to: email,
      orderId: savedOrder._id,
      items: savedOrder.items,
      amount: savedOrder.amount,
      address: savedOrder.address,
      paymentMethod: savedOrder.paymentMethod,
    });

    res.status(201).json({ success: true, orderId: savedOrder._id });
  } catch (error) {
    console.error("COD Error:", {
      message: error.message,
      stack: error.stack,
      body: JSON.stringify(req.body, null, 2),
    });
    res.status(500).json({ success: false, message: error.message || "Failed to place COD order" });
  }
};

const placeOrderPayStack = async (req, res) => {
  console.log("Starting placeOrderPayStack");
  const { email, amount, items, address } = req.body;
  const userId = req.userId;

  console.log("Paystack Request:", { userId, body: JSON.stringify(req.body, null, 2) });

  try {
    if (!userId) {
      console.error("No userId provided");
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId format:", userId);
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    if (!email || !amount || !items || !items.length || !address) {
      console.error("Missing fields:", { email, amount, items, address });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

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

    const requiredAddressFields = ["firstName", "lastName", "city", "country", "phone"];
    for (const field of requiredAddressFields) {
      if (!address[field]) {
        console.error("Missing address field:", field);
        return res.status(400).json({ success: false, message: `Address ${field} is required` });
      }
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const orderData = {
      userId: new mongoose.Types.ObjectId(userId),
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

    // Verify order in database
    const verifiedOrder = await orderModel.findById(savedOrder._id);
    if (!verifiedOrder) {
      console.error("Order not found after save:", savedOrder._id);
      return res.status(500).json({ success: false, message: "Order save verification failed" });
    }
    console.log("Order verified in database:", verifiedOrder._id);

    const amountInKobo = Math.round(amount * 100);
    if (isNaN(amountInKobo) || amountInKobo < 100) {
      console.error("Invalid amount:", amountInKobo);
      return res.status(400).json({ success: false, message: "Invalid amount (must be >= 100 kobo)" });
    }

    console.log("Initializing Paystack transaction");
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amountInKobo,
        reference: `order_${savedOrder._id}`,
        metadata: {
          order_id: savedOrder._id.toString(),
          user_id: userId,
        },
        callback_url: process.env.PAYSTACK_CALLBACK_URL || "http://localhost:4000/api/order/paystack/callback",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("Paystack Response:", response.data);

    if (!response.data?.status || !response.data?.data?.authorization_url) {
      console.error("Invalid Paystack response:", response.data);
      return res.status(500).json({ success: false, message: "Invalid response from Paystack" });
    }

    console.log("Clearing user cart for user:", userId);
    const updatedUser = await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
    if (!updatedUser) {
      console.warn("Failed to clear cart for user:", userId);
    } else {
      console.log("User cart cleared successfully");
    }

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      orderId: savedOrder._id,
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

    await sendOrderConfirmationEmail({
      to: order.email,
      orderId: order._id,
      items: order.items,
      amount: order.amount,
      address: order.address,
      paymentMethod: order.paymentMethod,
    });

    console.log("Clearing user cart for user:", order.userId);
    const updatedUser = await userModel.findByIdAndUpdate(order.userId, { cartData: {} }, { new: true });
    if (!updatedUser) {
      console.warn("Failed to clear cart for user:", order.userId);
    } else {
      console.log("User cart cleared successfully");
    }

    res.redirect(`${process.env.FRONTEND_URL}/orders?orderId=${orderId}`);
  } catch (error) {
    console.error("Callback Error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({ success: false, message: "Callback processing failed" });
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
    if (!["Packing", "Shipped", "Out for Delivery", "Delivered"].includes(status)) {
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