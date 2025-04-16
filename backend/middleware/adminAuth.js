import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    console.log("adminAuth - Received Token:", req.headers.token?.slice(0, 20) + "...");
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("adminAuth - Decoded:", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized as admin" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("adminAuth Error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;