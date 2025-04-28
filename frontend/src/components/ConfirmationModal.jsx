import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimes, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  darkMode,
  paymentMethod,
  amount,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary "
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className={`relative rounded-lg shadow-xl max-w-md w-full p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:bg-gray-100"
          }`}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary/20 text-secondary mb-4">
            <FaCheckCircle size={32} />
          </div>

          <h3 className={`text-xl font-bold mb-2 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}>
            Confirm Your Order
          </h3>

          <div className={`w-full p-4 rounded-lg mb-6 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <div className="flex items-center justify-center mb-3">
              <div className={`p-3 rounded-full mr-3 ${
                darkMode ? "bg-gray-600" : "bg-gray-200"
              }`}>
                {paymentMethod === "paystack" ? (
                  <FaCreditCard className="text-secondary" size={20} />
                ) : (
                  <FaMoneyBillWave className="text-secondary" size={20} />
                )}
              </div>
              <div className="text-left">
                <p className={`font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {paymentMethod === "paystack" ? "Online Payment" : "Cash on Delivery"}
                </p>
                <p className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {paymentMethod === "paystack"
                    ? "You'll be redirected to Paystack"
                    : "Pay when you receive your order"}
                </p>
              </div>
            </div>

            <div className={`text-lg font-bold mt-4 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}>
              Total: {currency}{amount}
            </div>
          </div>

          <p className={`mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            {paymentMethod === "paystack"
              ? "Please confirm that you want to proceed with this payment."
              : "Please confirm that all your delivery information is correct."}
          </p>

          <div className="flex gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-white bg-secondary hover:bg-secondary-dark`}
            >
              {paymentMethod === "paystack" ? "Proceed to Payment" : "Confirm Order"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;