import userModel from "../models/userModel.js";

//Controller function for add products to cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Check if required fields are provided
    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields (userId, itemId, or size)" });
    }

    // Find the user and check if they exist
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if it doesn't exist (optional, but good practice)
    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Update cart logic
    if (userData.cartData[itemId]) {
      if (userData.cartData[itemId][size]) {
        userData.cartData[itemId][size] += 1;
      } else {
        userData.cartData[itemId][size] = 1;
      }
    } else {
      userData.cartData[itemId] = {};
      userData.cartData[itemId][size] = 1;
    }

    // Save the updated user data
    await userModel.findByIdAndUpdate(userId, { cartData: userData.cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Controller function for update cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Controller function for getting user cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    const cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
