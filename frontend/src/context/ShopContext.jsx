import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { products as initialProducts } from '../assets/assets/data';
import { toast } from 'react-toastify';

// Create the context
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "GHS";
  const delivery_charges = 10;
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [ShowSearch, setShowSearch] = useState(true);
  const [token, setToken] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);

  // update cart quantity
  const updateQuantity = (itemId, size, newQuantity) => {
    setCartItems(prevCart => {
      const updatedCart = { ...prevCart };

      if (!updatedCart[itemId]) {
        updatedCart[itemId] = {};
      }

      if (newQuantity > 0) {
        updatedCart[itemId][size] = newQuantity;
      } else {
        delete updatedCart[itemId][size]; // Remove size entry if quantity is 0
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId]; // Remove item if no sizes left
        }
      }

      return updatedCart;
    });

    // ✅ Remove from wishlist if it exists
    setWishlistItems((prevWishlist) => {
      if (prevWishlist.includes(itemId)) {
        //toast.info("Item removed from wishlist as it was added to cart");
        return prevWishlist.filter(id => id !== itemId);
      }
      return prevWishlist;
    });
  };

  // Add to cart
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Please select a size first");
      return;
    }
    updateQuantity(itemId, size, (cartItems[itemId]?.[size] || 0) + 1);
  };

  // Get Cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalCount += cartItems[items][item];
        }
      }
    }
    return totalCount;
  };

  // Get Cart total amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const product = products.find((p) => p._id === itemId);
        if (product) {
          totalAmount += product.price * cartItems[itemId][size];
        }
      }
    }
    return totalAmount;
  };

  // Add/Remove from Wishlist
  const updateWishlist = (itemId) => {
    setWishlistItems(prevWishlist => {
      if (prevWishlist.includes(itemId)) {
        //toast.info("Item removed from wishlist");
        return prevWishlist.filter(id => id !== itemId);
      } else {
        //toast.success("Item added to wishlist");
        return [...prevWishlist, itemId];
      }
    });
  };

  // Get Wishlist count
  const getWishlistCount = () => wishlistItems.length;

  // Context value
  const value = {
    currency,
    delivery_charges,
    navigate,
    products,
    setProducts,
    token,
    setToken,
    search,
    setSearch,
    ShowSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity, 
    getCartCount,
    wishlistItems,
    setWishlistItems,
    updateWishlist,
    getWishlistCount,
    getCartAmount
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;