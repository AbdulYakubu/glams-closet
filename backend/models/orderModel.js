import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Changed from String to ObjectId
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        default: "",
      },
      image: {
        type: [String],
        default: [],
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      required: true,
    },
    digitalAddress: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Paystack"],
  },
  payment: {
    type: Boolean,
    default: false,
  },
  paymentStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "completed", "failed"],
  },
  reference: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "Packing",
    enum: ["Packing", "Shipped", "Delivered", "Cancelled"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;