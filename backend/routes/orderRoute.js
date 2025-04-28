import express from "express";
import {
  allOrders,
  placeOrder,
  placeOrderPayStack,
  paystackCallback,
  updateStatus,
  userOrders,
  verifyPayStack,
  trackOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/authUser.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/paystack", authUser, placeOrderPayStack);

// Payment callback (unauthenticated)
orderRouter.get("/paystack/callback", paystackCallback);

// Payment verification
orderRouter.get("/verifypaystack/:reference", authUser, verifyPayStack);

// User routes
orderRouter.get("/userorders", authUser, userOrders);
orderRouter.get("/track/:orderId", authUser, trackOrder);

export default orderRouter;