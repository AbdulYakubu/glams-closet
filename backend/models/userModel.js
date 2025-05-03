import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    digitalAddress: { type: String },
    country: { type: String, default: "Ghana" },
  },
  cartData: { type: Object, default: {} },
  wishlistData: { type: Array, default: [] },
  date: { type: Date, default: Date.now },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;