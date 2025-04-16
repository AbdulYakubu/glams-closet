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
        type: mongoose.Schema.Types.ObjectId,
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
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: false,
      },
      image: {
        type: [String],
        required: false,
        default: [],
      },
    },
  ],
  amount: {
    type: Number, // Stored in cedis
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
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    digitalAddress: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["Packing", "Shipped", "Out for Delivery", "Delivered"],
    default: "Packing",
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
    enum: ["pending", "completed"],
    default: "pending",
  },
  paymentReference: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
