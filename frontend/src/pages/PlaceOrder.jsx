import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import Footer from "../components/Footer";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

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

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    region: "",
    digitalAddress: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "Valid phone number required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.region.trim()) newErrors.region = "Region is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const prepareOrderItems = () => {
    let orderItems = [];
    console.log("Cart Items:", JSON.stringify(cartItems, null, 2));
    console.log("Products:", JSON.stringify(products, null, 2));
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === items)
          );
          if (!itemInfo) {
            console.error(`Product not found for ID ${items}`);
            toast.error(`Product ID ${items} not found`);
            continue;
          }
          if (!itemInfo._id) {
            console.error(`ItemInfo missing _id:`, JSON.stringify(itemInfo, null, 2));
            toast.error(`Invalid product data for ${itemInfo.name || "item"}`);
            continue;
          }
          itemInfo.size = item;
          itemInfo.quantity = cartItems[items][item];
          orderItems.push({
            _id: itemInfo._id,
            name: itemInfo.name,
            quantity: itemInfo.quantity,
            price: itemInfo.price,
            size: itemInfo.size,
            image: Array.isArray(itemInfo.image) ? itemInfo.image : [itemInfo.image || ""],
          });
        }
      }
    }
    console.log("Prepared Order Items:", JSON.stringify(orderItems, null, 2));
    return orderItems;
  };

  const placeOrder = async (method) => {
    const items = prepareOrderItems();
    const amount = getCartAmount() + delivery_charges; // Cedis

    if (!items.length || !amount || isNaN(amount)) {
      toast.error("Cart is empty or amount is invalid");
      setPaymentLoading(false);
      throw new Error("Invalid cart data");
    }

    if (!token) {
      toast.error("No token found. Please login again.");
      navigate("/login");
      setPaymentLoading(false);
      return;
    }

    console.log("Full token being sent:", token);

    const payload = {
      email: formData.email,
      address: formData,
      items,
      amount, // In cedis
    };

    try {
      const orderResponse = await axios.post(
        `${backendUrl}/api/order/${method === "paystack" ? "paystack" : "place"}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (method === "paystack") {
        if (orderResponse.data.success && orderResponse.data.authorization_url) {
          window.location.href = orderResponse.data.authorization_url;
        } else {
          throw new Error(orderResponse.data.message || "Failed to initialize payment");
        }
      } else {
        toast.success("Order placed successfully!");
        setCartItems({});
        navigate("/orders");
      }
    } catch (error) {
      console.error("Axios Error Details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "An error occurred");
      }
      setPaymentLoading(false);
      throw error;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the form errors");
      return;
    }

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setPaymentLoading(true);
    try {
      if (paymentMethod === "paystack") {
        await placeOrder("paystack");
      } else {
        await placeOrder("cod");
      }
    } catch (error) {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary mb-16 flex-grow">
        <form onSubmit={onSubmitHandler} className="max-padd-container py-10">
          <div className="flex flex-col xs:flex-row gap-12">
            <div className="flex-1">
              <Title title1={"Delivery"} title2={"Information"} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">First Name*</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.firstName}
                    name="firstName"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Last Name*</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.lastName}
                    name="lastName"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Email*</label>
                  <input
                    type="email"
                    onChange={onChangeHandler}
                    value={formData.email}
                    name="email"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Phone*</label>
                  <input
                    type="tel"
                    onChange={onChangeHandler}
                    value={formData.phone}
                    name="phone"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-1">Street Address</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.street}
                    name="street"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">City*</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.city}
                    name="city"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Region*</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.region}
                    name="region"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Digital Address</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.digitalAddress}
                    name="digitalAddress"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Country*</label>
                  <input
                    type="text"
                    onChange={onChangeHandler}
                    value={formData.country}
                    name="country"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <CartTotal />
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-6">
                  Payment <span className="text-secondary">Method</span>
                </h3>

                <div className="space-y-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "paystack"
                        ? "border-secondary bg-secondary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("paystack")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          paymentMethod === "paystack" ? "bg-secondary text-white" : "bg-gray-100"
                        }`}
                      >
                        <FaCreditCard />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Online Payment</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay securely with Paystack (Cards, Mobile Money, etc.)
                        </p>
                      </div>
                      {paymentMethod === "paystack" && (
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-secondary bg-secondary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          paymentMethod === "cod" ? "bg-secondary text-white" : "bg-gray-100"
                        }`}
                      >
                        <FaMoneyBillWave />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Cash on Delivery</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Pay when you receive your order
                        </p>
                      </div>
                      {paymentMethod === "cod" && (
                        <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 p-3 bg-gray-50 rounded-md flex items-start">
                  <div className="text-secondary mt-1 mr-2 flex-shrink-0">🔒</div>
                  <p className="text-xs text-white font-semibold">
                    {paymentMethod === "paystack"
                      ? "Your payment information is processed securely via Paystack."
                      : "You'll pay the delivery agent when you receive your order."}
                  </p>
                </div>

                <motion.button
                  type="submit"
                  className={`w-full mt-6 py-3 px-4 rounded-md font-medium text-white transition-colors ${
                    isFormValid ? "bg-secondary hover:bg-secondary-dark" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  whileHover={isFormValid ? { scale: 1.01 } : {}}
                  whileTap={isFormValid ? { scale: 0.99 } : {}}
                  disabled={!isFormValid || paymentLoading}
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
                      {paymentMethod === "paystack" ? "Redirecting to Paystack..." : "Placing Order..."}
                    </span>
                  ) : (
                    paymentMethod === "paystack"
                      ? `Pay with Paystack - ${currency}${(getCartAmount() + delivery_charges).toFixed(2)}`
                      : `Place Order (COD) - ${currency}${(getCartAmount() + delivery_charges).toFixed(2)}`
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PlaceOrder;