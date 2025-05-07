import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₵";
  const delivery_charges = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const CART_STORAGE_KEY = 'cart_items';
  const WISHLIST_STORAGE_KEY = 'wishlist_items';

  const loadCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : {};
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
      return {};
    }
  };

  const saveCartToStorage = (cart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  };

  const loadWishlistFromStorage = () => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Failed to load wishlist from storage:", error);
      return [];
    }
  };

  const saveWishlistToStorage = (wishlist) => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to storage:", error);
    }
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ShowSearch, setShowSearch] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [cartItems, setCartItems] = useState(loadCartFromStorage());
  const [wishlistItems, setWishlistItems] = useState(loadWishlistFromStorage());
  const [userLocation, setUserLocation] = useState("");

  const shippingRates = {
    Local: { fee: 10, freeThreshold: 200 },
    Regional: { fee: 25, freeThreshold: 300 },
    International: { fee: 60, freeThreshold: 500 },
  };

  const convertPrice = (price) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return `${currency}${numericPrice.toFixed(2)}`;
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        setCartItems(loadCartFromStorage());
      }
      if (e.key === WISHLIST_STORAGE_KEY) {
        setWishlistItems(loadWishlistFromStorage());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateQuantity = (itemId, size, newQuantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      const sizeKey = String(size);
      
      if (!updatedCart[itemId]) updatedCart[itemId] = {};
      
      if (newQuantity > 0) {
        updatedCart[itemId][sizeKey] = newQuantity;
      } else {
        delete updatedCart[itemId][sizeKey];
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
      }
      
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const addToCart = async (itemId, options = {}) => {
    const size = typeof options.size === 'object' ? options.size.size || options.size : options.size;
    
    if (!size) {
      toast.error("Please select a size first");
      return;
    }

    const sizeKey = String(size);

    setCartItems(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemId]) {
        updatedCart[itemId][sizeKey] = (updatedCart[itemId][sizeKey] || 0) + 1;
      } else {
        updatedCart[itemId] = { [sizeKey]: 1 };
      }
      saveCartToStorage(updatedCart);
      return updatedCart;
    });

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size: sizeKey },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to cart!");
      } catch (error) {
        console.error("Add to cart error:", error);
        handleAuthError(error);
      }
    }
  };

  const updateWishlist = async (itemId) => {
    setWishlistItems((prevWishlist) => {
      const updatedWishlist = [...prevWishlist];
      const index = updatedWishlist.indexOf(itemId);

      if (index === -1) {
        updatedWishlist.push(itemId);
      } else {
        updatedWishlist.splice(index, 1);
      }

      saveWishlistToStorage(updatedWishlist);
      return updatedWishlist;
    });

    if (token) {
      try {
        const endpoint = wishlistItems.includes(itemId)
          ? `${backendUrl}/api/wishlist/remove`
          : `${backendUrl}/api/wishlist/add`;
        await axios.post(
          endpoint,
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(wishlistItems.includes(itemId) ? "Removed from wishlist!" : "Added to wishlist!");
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const handleAuthError = (error) => {
    console.error("API error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    if (error.response?.status === 401 || error.response?.data?.message === "User not found") {
      toast.error("Session expired or user not found. Please login again.");
      logout();
    } else if (error.response?.status !== 404) {
      toast.error(error.response?.data?.message || "Failed to update data");
    }
  };

  const getWishlistCount = () => wishlistItems.length;

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        totalCount += cartItems[items][item];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const product = products.find((p) => p._id === itemId);
        if (product) totalAmount += product.price * cartItems[itemId][size];
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserWishlist = async () => {
    if (token) {
      try {
        const response = await axios.get(`${backendUrl}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          const backendWishlist = response.data.wishlist || [];
          setWishlistItems(backendWishlist);
          saveWishlistToStorage(backendWishlist);
        }
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const getUserCart = async () => {
    if (token) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          const backendCart = response.data.cartData || {};
          setCartItems(backendCart);
          saveCartToStorage(backendCart);
        }
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });
      if (response.data.success) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to login");
      throw error;
    }
  };

  const logout = (clearCart = false) => {
    setToken("");
    localStorage.removeItem("token");
    
    if (clearCart) {
      setCartItems({});
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    
    setWishlistItems([]);
    localStorage.removeItem(WISHLIST_STORAGE_KEY);
    
    navigate("/login");
    toast.info("Logged out successfully");
  };

  const placeOrder = async ({
    items,
    amount,
    address,
    email,
    paymentMethod,
  }) => {
    try {
      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return { success: false };
      }

      const payload = { items, amount, address, email, paymentMethod }; // Include paymentMethod
      const endpoint =
        paymentMethod === "Paystack"
          ? "/api/order/paystack"
          : "/api/order/place";

      const response = await axios.post(`${backendUrl}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        if (paymentMethod === "Paystack") {
          window.location.href = response.data.authorization_url;
          return { success: true, isRedirect: true };
        } else {
          toast.success("Order placed! Confirmation email sent.");
          setCartItems({});
          saveCartToStorage({});
          return { success: true, orderId: response.data.orderId };
        }
      } else {
        toast.error(response.data.message || "Failed to place order");
        return { success: false };
      }
    } catch (error) {
      console.error("Place Order Error:", {
        message: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Error placing order");
      return { success: false };
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
    }
    getProductsData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserCart();
      getUserWishlist();
    }
  }, [token]);

  const value = {
    currency,
    delivery_charges,
    navigate,
    products,
    setProducts,
    loading,
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
    getCartAmount,
    backendUrl,
    login,
    logout,
    userLocation,
    setUserLocation,
    shippingRates,
    convertPrice,
    placeOrder,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;