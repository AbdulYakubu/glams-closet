import React, { useContext, useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaMoneyBillWave, FaCreditCard, FaMapMarkerAlt, FaUser, FaEnvelope, FaPhone, FaHome } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import ConfirmationModal from "../components/ConfirmationModal";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const PlaceOrder = () => {
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_charges,
    products,
    backendUrl,
    currency,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("checkoutFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          firstName: "Zinabu",
          lastName: "Abdul Rhman",
          email: "zinab@gmail.com",
          street: "",
          city: "",
          region: "",
          digitalAddress: "",
          country: "Ghana",
          phone: "0542271847",
        };
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Debug re-renders
  useEffect(() => {
    console.log("PlaceOrder re-rendered");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("CartItems:", JSON.stringify(cartItems, null, 2));
    console.log("Products:", JSON.stringify(products, null, 2));
    console.log("FormData:", formData);
  }, [cartItems, products, token, formData]);

  // Save form data to localStorage
  useEffect(() => {
    localStorage.setItem("checkoutFormData", JSON.stringify(formData));
  }, [formData]);

  // Validate individual field
  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+233|0)[235]\d{8}$/;
    const errors = {};

    if (name === "firstName" && !value.trim()) errors.firstName = "First name is required";
    if (name === "lastName" && !value.trim()) errors.lastName = "Last name is required";
    if (name === "email" && value && !emailRegex.test(value)) errors.email = "Valid email is required";
    if (name === "phone" && !phoneRegex.test(value))
      errors.phone = "Valid Ghanaian phone number required (e.g., 0542271847)";
    if (name === "city" && !value.trim()) errors.city = "City is required";
    if (name === "country" && !value.trim()) errors.country = "Country is required";

    return errors;
  };

  // Validate entire form
  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(?:\+233|0)[235]\d{8}$/;

    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Valid Ghanaian phone number required (e.g., 0542271847)";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsFormValid(valid);
    console.log("Form validation:", { isValid: valid, errors: newErrors });
    return valid;
  }, [formData]);

  // Debounced validation
  const debouncedValidate = useMemo(
    () => debounce((name, value) => {
      const fieldErrors = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      validateForm();
    }, 300),
    [validateForm]
  );

  const onChangeHandler = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      debouncedValidate(name, value);
    },
    [debouncedValidate]
  );

  const prepareOrderItems = useMemo(() => {
    return () => {
      if (!cartItems || !products?.length) {
        console.error("Cart or product data missing", { cartItems, products });
        toast.error("Cart or product data is missing");
        return [];
      }

      let orderItems = [];
      for (const productId in cartItems) {
        if (!cartItems.hasOwnProperty(productId)) continue;
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            const itemInfo = products.find((product) => product._id === productId);
            if (!itemInfo) {
              console.error(`Product not found for ID ${productId}`);
              toast.error(`Product ID ${productId} not found`);
              continue;
            }
            orderItems.push({
              _id: itemInfo._id,
              name: itemInfo.name,
              quantity: Number(cartItems[productId][size]),
              price: Number(itemInfo.price),
              size,
              image: Array.isArray(itemInfo.image) ? itemInfo.image[0] : itemInfo.image || "",
            });
          }
        }
      }
      if (!orderItems.length) {
        console.error("No valid items in cart");
        toast.error("No valid items in cart");
      } else {
        console.log("Prepared order items:", JSON.stringify(orderItems, null, 2));
      }
      return orderItems;
    };
  }, [cartItems, products]);

  const placeOrder = useCallback(
    async (method) => {
      const items = prepareOrderItems();
      const amount = Number(getCartAmount()) + Number(delivery_charges);

      if (!items.length || !amount || isNaN(amount) || amount <= 0) {
        console.error("Invalid order data", { items, amount, cartItems, products });
        toast.error("Cart is empty or amount is invalid");
        throw new Error("Invalid cart data");
      }

      if (!token) {
        console.error("No token provided");
        toast.error("Please login to place an order");
        navigate("/login");
        setPaymentLoading(false);
        return;
      }

      const payload = {
        email: formData.email || "zinab@gmail.com",
        address: formData,
        items,
        amount,
      };

      console.log("Sending order request:", {
        url: `${backendUrl}/api/order/${method === "paystack" ? "paystack" : "place"}`,
        payload: JSON.stringify(payload, null, 2),
        headers: { Authorization: `Bearer ${token}` },
      });

      try {
        const orderResponse = await axios.post(
          `${backendUrl}/api/order/${method === "paystack" ? "paystack" : "place"}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Order response:", JSON.stringify(orderResponse.data, null, 2));

        if (method === "paystack") {
          if (orderResponse.data.success && orderResponse.data.authorization_url) {
            localStorage.removeItem("checkoutFormData");
            window.location.href = orderResponse.data.authorization_url;
          } else {
            throw new Error(orderResponse.data.message || "Payment initialization failed");
          }
        } else {
          localStorage.removeItem("checkoutFormData");
          toast.success("Order placed successfully!");
          setCartItems({});
          navigate("/orders");
        }
      } catch (error) {
        console.error("Order Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          requestPayload: JSON.stringify(payload, null, 2),
        });
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error(error.response?.data?.message || "Order processing failed");
        }
        throw error;
      } finally {
        setPaymentLoading(false);
      }
    },
    [
      formData,
      token,
      navigate,
      getCartAmount,
      delivery_charges,
      backendUrl,
      setCartItems,
      prepareOrderItems,
    ]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, validating...");
    if (!validateForm()) {
      console.error("Form validation failed", errors);
      toast.error("Please correct the form errors");
      return;
    }

    if (!token) {
      console.error("No token found");
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmOrder = async () => {
    setShowConfirmation(false);
    setPaymentLoading(true);
    try {
      await placeOrder(paymentMethod);
    } catch (error) {
      setPaymentLoading(false);
    }
  };

  const formatPrice = (price) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary dark:bg-gray-900">
      <div className="flex-grow mb-16">
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Delivery Information */}
            <div className="flex-1">
              <Title title1={"Delivery"} title2={"Information"} />
              <div className="mt-6 rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="md:col-span-2">
                    <h4 className="flex items-center text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                      <FaUser className="mr-2 text-indigo-600 dark:text-indigo-400" />
                      Personal Information
                    </h4>
                  </div>
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      First Name*
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        type="text"
                        onChange={onChangeHandler}
                        value={formData.firstName}
                        name="firstName"
                        className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                        aria-invalid={!!errors.firstName}
                        aria-describedby="firstName-error"
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <p id="firstName-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Last Name*
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        type="text"
                        onChange={onChangeHandler}
                        value={formData.lastName}
                        name="lastName"
                        className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                        aria-invalid={!!errors.lastName}
                        aria-describedby="lastName-error"
                        required
                      />
                    </div>
                    {errors.lastName && (
                      <p id="lastName-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        onChange={onChangeHandler}
                        value={formData.email}
                        name="email"
                        className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                      />
                    </div>
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Phone*
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="phone"
                        type="tel"
                        onChange={onChangeHandler}
                        value={formData.phone}
                        name="phone"
                        placeholder="e.g., 0542271847"
                        className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                        aria-invalid={!!errors.phone}
                        aria-describedby="phone-error"
                        required
                      />
                    </div>
                    {errors.phone && (
                      <p id="phone-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  {/* Address Information */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="flex items-center text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                      <FaMapMarkerAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
                      Delivery Address
                    </h4>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Street Address
                    </label>
                    <div className="relative">
                      <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="street"
                        type="text"
                        onChange={onChangeHandler}
                        value={formData.street}
                        name="street"
                        className="w-full pl-10 px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      City*
                    </label>
                    <input
                      id="city"
                      type="text"
                      onChange={onChangeHandler}
                      value={formData.city}
                      name="city"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      aria-invalid={!!errors.city}
                      aria-describedby="city-error"
                      required
                    />
                    {errors.city && (
                      <p id="city-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Region
                    </label>
                    <input
                      id="region"
                      type="text"
                      onChange={onChangeHandler}
                      value={formData.region}
                      name="region"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      aria-invalid={!!errors.region}
                      aria-describedby="region-error"
                    />
                    {errors.region && (
                      <p id="region-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.region}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="digitalAddress"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Digital Address (GPS)
                    </label>
                    <input
                      id="digitalAddress"
                      type="text"
                      onChange={onChangeHandler}
                      value={formData.digitalAddress}
                      name="digitalAddress"
                      placeholder="e.g., GA-123-4567"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                    >
                      Country*
                    </label>
                    <select
                      id="country"
                      onChange={onChangeHandler}
                      value={formData.country}
                      name="country"
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500"
                      aria-invalid={!!errors.country}
                      aria-describedby="country-error"
                      required
                    >
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.country && (
                      <p id="country-error" className="text-red-500 text-xs mt-1" role="alert">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Order Summary & Payment */}
            <div className="flex-1">
              <CartTotal />
              <div className="mt-8 rounded-lg shadow-md p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="flex items-center text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">
                  <MdPayment className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  Payment <span className="text-indigo-600 dark:text-indigo-400">Method</span>
                </h3>
                <div className="space-y-4 mb-6" role="radiogroup" aria-labelledby="payment-method-label">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-particle transition-all ${
                      paymentMethod === "paystack"
                        ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setPaymentMethod("paystack")}
                    role="radio"
                    aria-checked={paymentMethod === "paystack"}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("paystack")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          paymentMethod === "paystack"
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <FaCreditCard />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800 dark:text-gray-300">Online Payment</h4>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                          Pay securely with Paystack (Cards, Mobile Money, etc.)
                        </p>
                      </div>
                      {paymentMethod === "paystack" && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                    role="radio"
                    aria-checked={paymentMethod === "cod"}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPaymentMethod("cod")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          paymentMethod === "cod"
                            ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <FaMoneyBillWave />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800 dark:text-gray-300">Cash on Delivery</h4>
                        <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                          Pay when you receive your order
                        </p>
                      </div>
                      {paymentMethod === "cod" && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white dark:gray-50"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
                <div className="mt-6 p-4 rounded-md flex items-start bg-gray-100 dark:bg-gray-700">
                  <div className="text-indigo-600 dark:text-indigo-400 mt-1 mr-3 flex-shrink-0">🔒</div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {paymentMethod === "paystack"
                      ? "Your payment information is processed securely via Paystack. We don't store your payment details."
                      : "You'll pay the delivery agent when you receive your order. An additional verification might be required."}
                  </p>
                </div>
                <motion.button
                  type="submit"
                  className={`w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors ${
                    isFormValid && !paymentLoading
                      ? "bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800"
                      : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  }`}
                  whileHover={isFormValid && !paymentLoading ? { scale: 1.01 } : {}}
                  whileTap={isFormValid && !paymentLoading ? { scale: 0.99 } : {}}
                  disabled={!isFormValid || paymentLoading}
                  aria-busy={paymentLoading}
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {paymentMethod === "paystack" ? "Processing Payment..." : "Placing Order..."}
                    </span>
                  ) : (
                    <>
                      {paymentMethod === "paystack"
                        ? `Pay Securely - ${currency}${formatPrice(getCartAmount() + delivery_charges)}`
                        : `Place Order (COD) - ${currency}${formatPrice(getCartAmount() + delivery_charges)}`}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmOrder}
        paymentMethod={paymentMethod}
        amount={formatPrice(getCartAmount() + delivery_charges)}
        currency={currency}
      />
      <Footer />
    </div>
  );
};

export default PlaceOrder;