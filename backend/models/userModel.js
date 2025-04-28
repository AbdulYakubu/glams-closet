import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      region: { type: String, default: "" },
      digitalAddress: { type: String, default: "" },
      country: { type: String, default: "Ghana" },
    },
    cartData: { type: Object, default: {} },
    wishlistData: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;