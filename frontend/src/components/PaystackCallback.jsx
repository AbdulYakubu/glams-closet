import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// CHANGE: New component to handle Paystack callback
const PaystackCallback = ({ backendUrl, token }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  // CHANGE: Extract query parameters and verify payment
  useEffect(() => {
  const verifyPayment = async () => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference");
    
    if (!reference) {
      setStatus("error");
      setMessage("Missing payment reference");
      toast.error("Invalid payment reference");
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/order/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStatus("success");
        setMessage("Payment successful! Redirecting to orders...");
        toast.success("Payment successful!");
        setTimeout(() => navigate("/orders"), 2000);
      } else {
        setStatus("error");
        setMessage(response.data.message || "Payment verification failed");
        toast.error(response.data.message || "Payment verification failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Payment verification failed");
      toast.error("Payment verification failed");
    }
  };

  if (token) {
    verifyPayment();
  } else {
    navigate("/login");
  }
}, [location, navigate, token, backendUrl]);
  // CHANGE: Render loading, success, or error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-center"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600 dark:text-indigo-400 mb-4"
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
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Verifying your payment...
            </p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <svg
              className="h-16 w-16 text-green-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Redirecting to your orders...
            </p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <svg
              className="h-16 w-16 text-red-500 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{message}</p>
            <button
              onClick={() => navigate("/cart")}
              className="mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
            >
              Return to Cart
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaystackCallback;