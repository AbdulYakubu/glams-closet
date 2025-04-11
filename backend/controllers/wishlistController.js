// wishlistController.js

import userModel from '../models/userModel.js';

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find user by userId
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add item to wishlist using MongoDB's $addToSet to avoid duplicates
    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { wishlistData: itemId },
    });

    return res.json({ success: true, message: "Added to Wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Find user by userId
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove item from wishlist using MongoDB's $pull operator
    await userModel.findByIdAndUpdate(userId, {
      $pull: { wishlistData: itemId },
    });

    return res.json({ success: true, message: "Removed from Wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user by userId
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Retrieve wishlist data
    const wishlist = userData.wishlistData || [];

    return res.json({ success: true, wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};