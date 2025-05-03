import userModel from "../models/userModel.js";

const getWishlist = async (req, res) => {
  try {
    console.log("Starting getWishlist, req.userId:", req.userId);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const user = await userModel.findById(req.userId).select("wishlistData");
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Wishlist fetched for user:", req.userId, "wishlistData:", user.wishlistData);
    res.json({
      success: true,
      wishlistData: user.wishlistData || [],
    });
  } catch (error) {
    console.error("Get wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching wishlist" });
  }
};

const addToWishlist = async (req, res) => {
  try {
    console.log("Starting addToWishlist, req.userId:", req.userId, "Body:", req.body);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const user = await userModel.findById(req.userId);
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      { $addToSet: { wishlistData: itemId } },
      { new: true }
    ).select("wishlistData");

    console.log("Wishlist updated for user:", req.userId, "New wishlistData:", updatedUser.wishlistData);
    res.json({
      success: true,
      message: "Added to wishlist",
      wishlistData: updatedUser.wishlistData || [],
    });
  } catch (error) {
    console.error("Add to wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Error adding to wishlist" });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    console.log("Starting removeFromWishlist, req.userId:", req.userId, "Body:", req.body);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ success: false, message: "Item ID is required" });
    }

    const user = await userModel.findById(req.userId);
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.userId,
      { $pull: { wishlistData: itemId } },
      { new: true }
    ).select("wishlistData");

    console.log("Wishlist updated for user:", req.userId, "New wishlistData:", updatedUser.wishlistData);
    res.json({
      success: true,
      message: "Removed from wishlist",
      wishlistData: updatedUser.wishlistData || [],
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error.message);
    res.status(500).json({ success: false, message: "Error removing from wishlist" });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };