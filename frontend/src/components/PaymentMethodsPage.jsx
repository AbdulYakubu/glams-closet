import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaMobileAlt, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PaymentMethod = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 'paystack',
      title: 'Paystack (Card Payments)',
      icon: <FaCreditCard className="text-2xl" />,
      content: (
        <div className="space-y-4">
          <p>
            Paystack allows secure card payments using Visa, Mastercard, or Verve cards. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select Paystack at checkout.</li>
            <li>Enter your card details in the secure payment form.</li>
            <li>Confirm the payment with your bank’s OTP or 3D Secure.</li>
            <li>Receive instant confirmation of your order.</li>
          </ol>
          <p className="text-sm italic">
            Note: Ensure your card is enabled for online transactions.
          </p>
        </div>
      ),
    },
    {
      id: 'momo',
      title: 'MTN MoMo (Mobile Money)',
      icon: <FaMobileAlt className="text-2xl" />,
      content: (
        <div className="space-y-4">
          <p>
            Pay conveniently using MTN Mobile Money, popular across West Africa. Here’s how:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Choose MTN MoMo at checkout.</li>
            <li>Enter your mobile number registered with MTN MoMo.</li>
            <li>Approve the payment request sent to your phone.</li>
            <li>Wait for confirmation (usually within seconds).</li>
          </ol>
          <p className="text-sm italic">
            Ensure you have sufficient balance in your MoMo wallet.
          </p>
        </div>
      ),
    },
    {
      id: 'cash',
      title: 'Cash on Delivery',
      icon: <FaMoneyBillWave className="text-2xl" />,
      content: (
        <div className="space-y-4">
          <p>
            Pay with cash when your order is delivered to your doorstep. Steps:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Select Cash on Delivery at checkout.</li>
            <li>Confirm your delivery address and contact details.</li>
            <li>Pay the exact amount to the delivery agent.</li>
          </ol>
          <p className="text-sm italic">
            Available in select locations. Check eligibility at checkout.
          </p>
        </div>
      ),
    },
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8"
        >
          Payment Methods
        </motion.h1>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Payment Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center space-x-4 p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-expanded={activeSection === section.id}
                aria-controls={`content-${section.id}`}
              >
                {section.icon}
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </button>
              <AnimatePresence>
                {activeSection === section.id && (
                  <motion.div
                    id={`content-${section.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-gray-50 dark:bg-gray-700"
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Back to Help Center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <Link
            to="/help-center"
            className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Help Center
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentMethod;