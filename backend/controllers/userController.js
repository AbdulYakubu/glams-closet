import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Debug: Verify model name
console.log("Imported userModel name:", userModel.modelName);

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    console.log("Register attempt:", { firstName, lastName, email });
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ firstName, lastName, email, password: hashedPassword });
    await user.save();
    console.log("User registered:", user._id);

    res.json({ success: true, user: { firstName, lastName, email } });
  } catch (error) {
    console.error("Register error:", error);
    let message = error.message;
    if (error.name === "ValidationError") {
      message = Object.values(error.errors).map((err) => err.message).join(", ");
    }
    res.status(500).json({ success: false, message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt:", { email });
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ success: false, message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.isAdmin ? "admin" : "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    console.log("Login successful for user:", user._id, "Token:", token, "RefreshToken:", refreshToken);

    res.json({ success: true, token, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Admin login attempt:", { email });
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ success: false, message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    if (!user.isAdmin) {
      console.log("User is not admin:", email);
      return res.status(401).json({ success: false, message: "Not an admin" });
    }

    const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    console.log("Admin login successful for user:", user._id, "Token:", token, "RefreshToken:", refreshToken);

    res.json({ success: true, token, refreshToken, user: { firstName: user.firstName, lastName: user.lastName, email } });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    console.log("Refresh token attempt:", { refreshToken: refreshToken ? "Provided" : "Missing" });
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log("Refresh token decoded:", decoded);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      console.log("User not found for refresh token:", decoded.id);
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
    const newToken = jwt.sign(
      { id: user._id, role: user.isAdmin ? "admin" : "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    console.log("Refresh token successful for user:", user._id, "NewToken:", newToken, "NewRefreshToken:", newRefreshToken);
    res.json({ success: true, token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Refresh token error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

const userOrders = async (req, res) => {
  console.log("Starting userOrders, req.userId:", req.userId);
  try {
    const userId = req.userId;
    if (!userId) {
      console.error("userId is undefined, req.userId:", req.userId);
      return res.status(401).json({ success: false, message: "User ID not found" });
    }

    console.log("Fetching orders for userId:", userId);
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    console.log("Orders found:", orders.length, orders);

    res.json({ success: true, orders });
  } catch (error) {
    console.error("User Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    console.log("getUserProfile called, req.userId:", req.userId);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const user = await userModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const firstName = user.firstName || (user.name ? user.name.split(" ")[0] : "Unknown");
    const lastName = user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "Unknown");

    res.json({
      success: true,
      user: {
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          digitalAddress: "",
          country: "Ghana",
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log("updateUserProfile called, req.userId:", req.userId, "Update data:", req.body);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const { firstName, lastName, email, phone, address } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ success: false, message: "First name, last name, and email are required" });
    }

    if (address && (!address.street || !address.city || !address.state)) {
      return res.status(400).json({ success: false, message: "Street, city, and state are required for address" });
    }

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        email,
        phone: phone || "",
        address: address || {
          street: "",
          city: "",
          state: "",
          digitalAddress: "",
          country: "Ghana",
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, userOrders, refreshToken };