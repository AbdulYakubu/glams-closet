import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiArrowRight,
  FiPackage,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const Orders = () => {
  const { backendUrl, currency, token, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statusOptions = ["All", "Packing", "Shipped", "Out for Delivery", "Delivered"];

  const loadOrderData = async () => {
    try {
      setLoading(true);

      if (!token) {
        toast.error("Please login to view orders");
        navigate("/login");
        return;
      }

      console.log("Frontend: Sending request with token:", token); // Debug token
      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Frontend: API Response:", response.data); // Debug response

      if (response.data.success) {
        const allItems = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allItems.push({
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              totalAmount: order.totalAmount,
              shippingAddress: order.address, // Use address (matches PlaceOrder payload)
            });
          });
        });

        const sortedData = allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log("Frontend: Processed Orders:", sortedData); // Debug processed data
        setOrderData(sortedData);
        setFilteredData(sortedData);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Frontend: Fetch Orders Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Orders endpoint not found. Please contact support.");
      } else {
        toast.error(error.response?.data?.message || "Error fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  useEffect(() => {
    let results = [...orderData];

    console.log("Frontend: Applying filters:", { searchTerm, statusFilter, dateFilter });

    if (searchTerm) {
      results = results.filter((item) =>
        (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter && statusFilter !== "All") {
      results = results.filter((item) => item.status === statusFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      results = results.filter((item) => {
        const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
        return itemDate === filterDate;
      });
    }

    console.log("Frontend: Filtered Data:", results);
    setFilteredData(results);
  }, [searchTerm, statusFilter, dateFilter, orderData]);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Order ID copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy Order ID");
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const { street = "", city = "", region = "", country = "", digitalAddress = "", phone = "" } = address;
    return [street, city, region, country, digitalAddress, phone].filter(Boolean).join(", ");
  };

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 p-4 mt-3 rounded-lg shadow animate-pulse border border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-6">
          <div className="w-[77px] h-[77px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 w-1/2 rounded" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-full rounded" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-3/4 rounded" />
            <div className="flex justify-between mt-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 w-1/4 rounded" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    ))
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-primary dark:bg-gray-900 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Title
          title1="Your"
          title2="Orders"
          title1Styles="text-3xl font-light text-gray-700 dark:text-gray-300"
          title2Styles="text-3xl font-semibold text-indigo-600 dark:text-indigo-400"
        />

        <div className="mb-6 mt-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by product name or order ID..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiFilter />
              <span>Filters</span>
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order Date
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={dateFilter}
                      onChange={(date) => setDateFilter(date)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
                      placeholderText="Select a date"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setStatusFilter("All");
                    setDateFilter(null);
                    setSearchTerm("");
                  }}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {!loading && orderData.length > 0 && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {orderData.length} orders
          </div>
        )}

        {loading ? (
          renderSkeleton()
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon={<FiPackage className="text-5xl text-gray-300 dark:text-gray-600" />}
            title={orderData.length === 0 ? "No orders yet" : "No matching orders found"}
            description={
              orderData.length === 0
                ? "Start shopping to see your orders here"
                : "Try adjusting your search or filters"
            }
            buttonText={orderData.length === 0 ? "Continue Shopping" : "Clear Filters"}
            buttonIcon={<FiArrowRight className="ml-2" />}
            onButtonClick={() =>
              orderData.length === 0
                ? navigate("/collection")
                : (() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setDateFilter(null);
                  })()
            }
            containerClassName="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <AnimatePresence>
            {filteredData.map((item, index) => {
              console.log("Frontend: Rendering item:", item);
              return (
                <motion.div
                  key={`${item.orderId}-${item._id}-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white dark:bg-gray-800 p-4 mt-3 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-gray-700 dark:text-gray-300">
                    <div
                      className="flex gap-6 cursor-pointer"
                      onClick={() => toggleOrderExpand(item.orderId)}
                    >
                      <div>
                        <img
                          src={Array.isArray(item.image) ? item.image[0] : item.image || "/fallback-image.jpg"}
                          alt={item.name || "Product"}
                          className="sm:w-[77px] w-20 aspect-square object-cover rounded-lg"
                          onError={(e) => (e.target.src = "/fallback-image.jpg")}
                        />
                      </div>

                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-start">
                          <h5 className="text-lg font-medium capitalize line-clamp-1">
                            {item.name || "Unknown Product"}
                          </h5>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={item.status} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/track-order/${item.orderId}`);
                              }}
                              className="bg-indigo-600 dark:bg-indigo-700 text-white py-1.5 px-3 text-xs font-medium rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                              aria-label={`Track order for ${item.name || "product"}`}
                            >
                              Track
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Order ID:</span> {item.orderId}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.orderId);
                                }}
                                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                aria-label="Copy order ID"
                              >
                                <FiCopy className="inline" size={14} />
                              </button>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Price:</span>{" "}
                              {currency}
                              {(item.price || 0).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Payment:</span> {item.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-between items-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Total:</span>{" "}
                            {currency}
                            {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                          <div className="text-gray-500">
                            {expandedOrder === item.orderId ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === item.orderId && (
                        <motion.div
                          variants={detailsVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h6 className="font-medium mb-2">Product Details</h6>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>
                                  <span className="font-medium">Quantity:</span> {item.quantity || 1}
                                </li>
                                <li>
                                  <span className="font-medium">Size:</span> {item.size || "N/A"}
                                </li>
                                <li>
                                  <span className="font-medium">Color:</span> {item.color || "N/A"}
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h6 className="font-medium mb-2">Shipping Details</h6>
                              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <p>
                                  <span className="font-medium">Address:</span>{" "}
                                  {formatAddress(item.shippingAddress)}
                                </p>
                                <p>
                                  <span className="font-medium">Contact:</span>{" "}
                                  {item.shippingAddress?.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Orders;