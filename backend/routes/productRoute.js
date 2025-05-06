import express from "express";
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Add product (admin only)
router.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

// Remove product (admin only)
router.post("/remove", adminAuth, removeProduct);

// Get single product (no admin restriction, adjust if needed)
router.post("/single", singleProduct);

// Get product list (no admin restriction, adjust if needed)
router.post("/list", listProduct);

export default router;