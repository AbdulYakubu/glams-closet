import express from "express";
import { registerUser, loginUser, adminLogin, getUserProfile, updateUserProfile, userOrders, refreshToken } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", adminLogin);
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);
router.get("/orders", authUser, userOrders);
router.post("/refresh-token", refreshToken);

export default router;