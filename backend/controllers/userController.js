import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ firstName, lastName, email, password: hashedPassword });
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.isAdmin ? "admin" : "user" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)) || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials or not an admin",
      });
    }

    const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token, user });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    console.log("req.body.userId:", req.body.userId); // Debug
    if (!req.body.userId) {
      return res.status(400).json({ success: false, message: "User ID not provided" });
    }

    const user = await userModel.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Handle schema mismatch for old user documents
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
          region: "",
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

export { registerUser, loginUser, adminLogin, getUserProfile };