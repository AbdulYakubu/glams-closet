import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import authUser from "../middleware/authUser.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.get("/", authUser, getWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);

export default wishlistRouter;