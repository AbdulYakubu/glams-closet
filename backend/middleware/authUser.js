import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const authUser = async (req, res, next) => {
  console.log("Starting authUser middleware");
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    console.log("Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      console.error("Invalid userId in token:", decoded.id);
      return res.status(401).json({ success: false, message: "Invalid user ID in token" });
    }

    console.log("Token verified, userId:", decoded.id);
    req.userId = decoded.id; // String representation of ObjectId
    next();
  } catch (error) {
    console.error("Token verification error:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authUser;