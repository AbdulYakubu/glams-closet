import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    console.log("Starting addToCart, req.userId:", req.userId, "Body:", req.body);
    if (!req.userId) {
      console.error("No userId provided in addToCart");
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const { itemId, size } = req.body;
    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Item ID and size are required" });
    }

    const user = await userModel.findById(req.userId);
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      console.error("User not found for _id:", req.userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    if (!user.cartData[itemId]) {
      user.cartData[itemId] = {};
    }

    user.cartData[itemId][size] = (user.cartData[itemId][size] || 0) + 1;
    await user.save();

    console.log("Cart updated for user:", req.userId, "New cartData:", user.cartData);
    res.json({ success: true, message: "Added to cart", cartData: user.cartData });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

const updateCart = async (req, res) => {
  try {
    console.log("Starting updateCart, req.userId:", req.userId, "Body:", req.body);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const { itemId, size, quantity } = req.body;
    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Item ID, size, and quantity are required" });
    }

    const user = await userModel.findById(req.userId);
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.cartData) {
      user.cartData = {};
    }

    if (!user.cartData[itemId]) {
      user.cartData[itemId] = {};
    }

    if (quantity > 0) {
      user.cartData[itemId][size] = quantity;
    } else {
      delete user.cartData[itemId][size];
      if (Object.keys(user.cartData[itemId]).length === 0) {
        delete user.cartData[itemId];
      }
    }

    await user.save();
    console.log("Cart updated for user:", req.userId, "New cartData:", user.cartData);
    res.json({ success: true, message: "Cart updated", cartData: user.cartData });
  } catch (error) {
    console.error("Update cart error:", error.message);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

const getUserCart = async (req, res) => {
  try {
    console.log("Starting getUserCart, req.userId:", req.userId);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
    }

    const user = await userModel.findById(req.userId).select("cartData");
    console.log("User lookup result for _id:", req.userId, "User:", user ? user : "Not found");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("Cart fetched for user:", req.userId, "cartData:", user.cartData);
    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, updateCart, getUserCart };