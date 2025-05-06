import express from "express";
import { registerUser, loginUser, adminLogin, getUserProfile, resetPassword, updateUserProfile, userOrders, refreshToken, requestPasswordReset } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", adminLogin);
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);
router.get("/orders", authUser, userOrders);
router.post("/refresh-token", refreshToken);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;