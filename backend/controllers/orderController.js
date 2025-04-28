import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";

const placeOrder = async (req, res) => {
  console.log("Starting placeOrder (COD)");
  const { items, amount, address } = req.body;
  const userId = req.body.userId;

  console.log("COD Request Body:", JSON.stringify(req.body, null, 2));
  console.log("User ID from token:", userId);

  try {
    if (!items || !items.length || !amount || !address || !userId) {
      console.log("Missing fields:", { items, amount, address, userId });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    items.forEach((item, index) => {
      if (!item._id) {
        console.error(`Item at index ${index} missing _id:`, JSON.stringify(item, null, 2));
        throw new Error(`Item at index ${index} missing product ID`);
      }
      if (!item.name || !item.quantity || !item.price) {
        throw new Error(`Invalid item data at index ${index}: ${JSON.stringify(item)}`);
      }
    });

    if (!address.firstName || !address.lastName || !address.city || !address.country || !address.phone) {
      console.log("Invalid address:", address);
      return res.status(400).json({ success: false, message: "Incomplete address information" });
    }

    const orderData = {
      userId,
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
      date: new Date(),
      status: "Packing",
    };

    console.log("Saving COD order to MongoDB");
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log("COD Order saved:", savedOrder._id);

    console.log("Clearing user cart");
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed", orderId: savedOrder._id });
  } catch (error) {
    console.error("COD Error Details:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).json({ success: false, message: error.message || "Failed to place COD order" });
  }
};

const placeOrderPayStack = async (req, res) => {
  console.log("Starting placeOrderPayStack");
  const { email, amount, items, address } = req.body;
  const userId = req.body.userId;

  console.log("Paystack Request Body:", JSON.stringify(req.body, null, 2));
  console.log("User ID from token:", userId);

  try {
    if (!email || !amount || !items || !items.length || !address || !userId) {
      console.log("Missing fields:", { email, amount, items, address, userId });
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    items.forEach((item, index) => {
      if (!item._id) {
        console.error(`Item at index ${index} missing _id:`, JSON.stringify(item, null, 2));
        throw new Error(`Item at index ${index} missing product ID`);
      }
      if (!item.name || !item.quantity || !item.price) {
        throw new Error(`Invalid item data at index ${index}: ${JSON.stringify(item)}`);
      }
    });

    const orderData = {
      userId,
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
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.region || "",
        country: address.country || "",
        digitalAddress: address.digitalAddress || "",
        phone: address.phone || "",
      },
      paymentMethod: "Paystack",
      payment: false,
      paymentStatus: "pending",
      date: new Date(),
      status: "Packing",
    };

    console.log("Saving order to MongoDB");
    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder._id);

    const amountInKobo = Math.round(amount * 100);
    if (isNaN(amountInKobo) || amountInKobo < 100) {
      console.log("Invalid amount:", amountInKobo);
      return res.status(400).json({ success: false, message: "Invalid amount (must be >= 100 kobo)" });
    }

    console.log("Initializing Paystack transaction");
    console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY ? "Set" : "Missing");

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

    console.log("Paystack API Response:", JSON.stringify(response.data, null, 2));

    if (!response.data?.status || !response.data?.data?.authorization_url) {
      console.log("Invalid Paystack response:", response.data);
      throw new Error("Invalid response from Paystack");
    }

    res.json({
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.error("Paystack Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Transaction initialization failed",
    });
  }
};

const paystackCallback = async (req, res) => {
  const { reference } = req.query;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const orderId = paymentData.metadata.order_id || reference.replace("order_", "");
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentReference: paymentData.reference,
        paymentStatus: "completed",
        status: "Packing",
      });
      await userModel.findByIdAndUpdate(paymentData.metadata.user_id, { cartData: {} });
      res.redirect(`${process.env.FRONTEND_URL}/orders?payment=success`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/place-order?error=payment_failed`);
    }
  } catch (error) {
    console.error("Paystack Callback Error:", error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/place-order?error=verification_failed`);
  }
};

const verifyPayStack = async (req, res) => {
  const { reference } = req.params;
  const userId = req.body.userId;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === "success") {
      const orderId = paymentData.metadata.order_id || reference.replace("order_", "");
      const order = await orderModel.findById(orderId);
      if (!order || order.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: "Unauthorized access to order" });
      }
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        paymentReference: paymentData.reference,
        paymentStatus: "completed",
        status: "Packing",
      });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment verified successfully", orderId });
    } else {
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
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.error("All Orders Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const userOrders = async (req, res) => {
  console.log("Starting userOrders");
  try {
    const userId = req.body.userId;
    console.log("Fetching orders for userId:", userId);
    const orders = await orderModel.find({ userId });
    console.log("Orders found:", orders.length);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("User Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!["Packing", "Shipped", "Out for Delivery", "Delivered"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.json({ success: false, message: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.userId;

    console.log("Tracking order:", { orderId, userId });

    if (!orderId || !userId) {
      return res.status(400).json({ success: false, message: "Order ID and user ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid order ID format" });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("items.productId", "name image");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access to this order" });
    }

    res.json({
      success: true,
      order: {
        orderId: order._id,
        items: order.items.map((item) => ({
          productId: item.productId._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || "",
          image: item.image.length > 0 ? item.image : item.productId.image || [],
        })),
        amount: order.amount,
        address: order.address,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        paymentStatus: order.paymentStatus,
        date: order.date,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Track Order Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to track order" });
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