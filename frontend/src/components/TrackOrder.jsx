import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FiPackage, FiCopy, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

const TrackOrder = () => {
  const { token, backendUrl, navigate, currency } = useContext(ShopContext);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  const resultRef = useRef(null);

  // Check for order ID in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setOrderId(id);
    }
  }, []);

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
    if (!loading) setError("");
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleAxiosError = (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Error tracking order";

    setError(message);
    toast.error(message);

    if (status === 401) navigate("/login");
    else if (status === 404) setError("Order not found");
    else if (status === 403) setError("You are not authorized to view this order");
    else if (status === 400) setError("Invalid order ID format");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!orderId.trim()) {
      setError("Order ID is required");
      return;
    }
    if (!token) {
      toast.error("Please login to track your order");
      navigate("/login");
      return;
    }

    setLoading(true);
    setOrderData(null);
    try {
      const response = await axios.get(`${backendUrl}/api/order/track/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        console.log("Order data:", response.data.order);
        setOrderData(response.data.order);
        setError("");
        window.history.pushState({}, "", `?id=${orderId}`);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(response.data.message || "Failed to fetch order");
        toast.error(response.data.message || "Failed to fetch order");
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    console.log("Toggling section:", section, "Current:", expandedSection);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatCurrency = (amount) =>
    `${currency}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatAddress = (address) => {
    return `${address.street ? `${address.street}, ` : ""}${address.city}, ${address.state || ""}, ${address.country}`;
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title1="Track"
          title2="Order"
          title1Styles="text-3xl font-light text-gray-700 dark:text-gray-300"
          title2Styles="text-3xl font-semibold text-indigo-600 dark:text-indigo-400"
        />

        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto mt-8 bg-primary dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-6">
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              value={orderId}
              onChange={handleInputChange}
              placeholder="Enter your order ID (e.g., 66f8e123456789abcdef1234)"
              className={`w-full px-4 py-3 border ${
                error && !orderData ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition`}
              aria-invalid={!!error && !orderData}
            />
            {error && !orderData && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-medium text-white transition-colors flex items-center justify-center ${
              loading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800"
            }`}
            whileHover={loading ? {} : { scale: 1.02 }}
            whileTap={loading ? {} : { scale: 0.98 }}
            aria-label="Track order"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Tracking...
              </>
            ) : (
              "Track Order"
            )}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {error && !loading && !orderData && (
            <motion.div
              className="mt-8 max-w-3xl mx-auto"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <EmptyState
                icon={<BiErrorCircle className="text-5xl text-red-500" />}
                title="Order Not Found"
                description={error}
                buttonText="Try Again"
                onButtonClick={() => setError("")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {orderData && (
          <motion.div
            ref={resultRef}
            className="mt-8 max-w-3xl mx-auto bg-primary dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-4 gap-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 flex items-center flex-wrap">
                <FiPackage className="mr-2 text-indigo-600 dark:text-indigo-400" />
                Order #{orderData.orderId}
                <button
                  onClick={() => handleCopy(orderData.orderId)}
                  className="ml-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Copy order ID"
                >
                  <FiCopy size={16} />
                </button>
              </h3>
              <StatusBadge status={orderData.status} />
            </div>

            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white dark:bg-gray-700/30 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Order Date
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {new Date(orderData.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Total Amount
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {formatCurrency(orderData.amount)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Payment Method
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 capitalize">
                      {orderData.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <button
                  onClick={() => toggleSection("items")}
                  className="w-full flex justify-between items-center py-2 text-left"
                >
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Items ({orderData.items?.length || 0})
                  </h4>
                  {expandedSection === "items" ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSection === "items" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-visible"
                    >
                      {orderData.items && orderData.items.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                          {orderData.items.map((item, index) => (
                            <motion.li
                              key={index}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              className="py-4"
                            >
                              <div className="flex gap-4">
                                {item.image?.length > 0 && (
                                  <img
                                    src={item.image[0] || "https://via.placeholder.com/64"}
                                    alt={item.name || "Item"}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.name || "Unknown Item"}
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatCurrency(item.price || 0)} × {item.quantity || 1}
                                    {item.size && ` (Size: ${item.size})`}
                                  </p>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
                                    Subtotal: {formatCurrency((item.price || 0) * (item.quantity || 1))}
                                  </p>
                                </div>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400 py-4">
                          No items found for this order.
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping Information */}
              <div>
                <button
                  onClick={() => toggleSection("shipping")}
                  className="w-full flex justify-between items-center py-2 text-left"
                >
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">
                    Shipping Information
                  </h4>
                  {expandedSection === "shipping" ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSection === "shipping" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-visible"
                    >
                      <div className="bg-white dark:bg-gray-700/30 p-4 rounded-lg">
                        <div className="space-y-2">
                          <p className="text-gray-800 dark:text-gray-200">
                            {orderData.address.firstName} {orderData.address.lastName}
                          </p>
                          <p className="text-gray-800 dark:text-gray-200">
                            {formatAddress(orderData.address)}
                          </p>
                          {orderData.address.digitalAddress && (
                            <p className="text-gray-800 dark:text-gray-200">
                              Digital Address: {orderData.address.digitalAddress}
                            </p>
                          )}
                          <p className="text-gray-800 dark:text-gray-200">
                            Phone: {orderData.address.phone}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;