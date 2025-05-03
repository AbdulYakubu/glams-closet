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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ShowSearch, setShowSearch] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
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

  const updateQuantity = (itemId, size, newQuantity) => {
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      if (!updatedCart[itemId]) updatedCart[itemId] = {};
      if (newQuantity > 0) {
        updatedCart[itemId][size] = newQuantity;
      } else {
        delete updatedCart[itemId][size];
        if (Object.keys(updatedCart[itemId]).length === 0) {
          delete updatedCart[itemId];
        }
      }
      return updatedCart;
    });
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size first");
      return;
    }

    const updatedCart = { ...cartItems };
    if (updatedCart[itemId]) {
      updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;
    } else {
      updatedCart[itemId] = { [size]: 1 };
    }
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/cart/add`,
          { itemId, size },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Added to cart!");
      } catch (error) {
        console.error("Add to cart error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          logout();
        } else if (error.response?.data?.message === "User not found") {
          toast.error("User account not found. Please log in again.");
          logout();
        } else {
          toast.error(error.response?.data?.message || "Failed to add to cart");
        }
      }
    }
  };

  const updateWishlist = async (itemId) => {
    const updatedWishlist = [...wishlistItems];
    const index = updatedWishlist.indexOf(itemId);

    if (index === -1) {
      updatedWishlist.push(itemId);
      setWishlistItems(updatedWishlist);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/wishlist/add`,
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Added to wishlist!");
        } catch (error) {
          handleAuthError(error);
        }
      }
    } else {
      updatedWishlist.splice(index, 1);
      setWishlistItems(updatedWishlist);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/wishlist/remove`,
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.info("Removed from wishlist.");
        } catch (error) {
          handleAuthError(error);
        }
      }
    }
  };

  const handleAuthError = (error) => {
    console.error("API error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      token: token,
    });
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      logout();
    } else if (error.response?.data?.message === "User not found") {
      toast.error("User account not found. Please log in again.");
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
      const response = await axios.get(`${backendUrl}/api/product/list`);
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
          setWishlistItems(response.data.wishlist || []);
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
          setCartItems(response.data.cartData || {});
        }
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
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

  const logout = () => {
    setToken("");
    setCartItems({});
    setWishlistItems([]);
    localStorage.removeItem("token");
    navigate("/login");
    toast.info("Logged out successfully");
  };

  const placeOrder = async ({ items, amount, address, email, paymentMethod }) => {
    try {
      if (!token) {
        toast.error("Please login to place an order");
        navigate("/login");
        return { success: false };
      }

      const payload = { items, amount, address, email };
      const endpoint = paymentMethod === "Paystack" 
        ? "/api/order/paystack" 
        : "/api/order/place";

      const response = await axios.post(`${backendUrl}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        if (paymentMethod === "Paystack") {
          // Redirect to PayStack payment URL
          window.location.href = response.data.authorization_url;
          return { success: true, isRedirect: true };
        } else {
          // COD order placed
          toast.success("Order placed! Confirmation email sent.");
          setCartItems({});
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

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;