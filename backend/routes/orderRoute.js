import express from "express";
import {
  placeOrder,
  placeOrderPayStack,
  paystackCallback,
  verifyPayStack,
  allOrders,
  userOrders,
  updateStatus,
  trackOrder,
} from "../controllers/orderController.js";
import authUser from "../middleware/authUser.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/paystack", authUser, placeOrderPayStack);
orderRouter.get("/paystack/callback", paystackCallback);
orderRouter.get("/verify/:reference", authUser, verifyPayStack);
orderRouter.get("/all", authUser, allOrders);
orderRouter.get("/userorders", authUser, userOrders);
orderRouter.post("/status", authUser, updateStatus);
orderRouter.get("/track/:orderId", authUser, trackOrder);

export default orderRouter;