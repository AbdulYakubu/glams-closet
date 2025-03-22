import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized: Please Login again." });
        }

        const token = authHeader.split(" ")[1];

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the decoded token contains the admin's email
        //console.log("Decoded Email:", token_decode.email);
       //console.log("Expected Email:", process.env.ADMIN_EMAIL);

        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authorized: Invalid credentials." });
        }

        // Attach the decoded token to the request object for use in other middleware/routes
        req.admin = token_decode;

        // Proceed to the next middleware/route
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error.message);

        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
        }

        // Generic error response
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export default adminAuth;