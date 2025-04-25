import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Returns = () => {
  const lastUpdated = 'April 25, 2025';
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sections, setSections] = useState({
    introduction: false,
    eligibility: false,
    howToReturn: false,
    exchanges: false,
    refundProcess: false,
    contactUs: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const returnSections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content:
        'At GlamsCloset, we strive to ensure you’re delighted with your purchase. If you’re not fully satisfied, our 30-day return policy allows you to return eligible items. This page outlines the process, eligibility, and related details. For more support, visit our <Link to="/help" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our Help Center">Help Center</Link>.',
    },
    {
      id: 'eligibility',
      title: 'Eligibility for Returns',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            To be eligible for a return, your item must meet the following criteria:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <li>Unused and in original condition (including tags and packaging).</li>
            <li>Returned within 30 days from the delivery date.</li>
            <li>Not marked as final sale, gift cards, downloadable software, or personalized/custom items.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'howToReturn',
      title: 'How to Return an Item',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            Follow these steps to initiate a return:
          </p>
          <ol className="list-decimal pl-6 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <li>
              Email our support team at{' '}
              <a
                href="mailto:support@glamscloset.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                aria-label="Email GlamsCloset Support"
              >
                support@glamscloset.com
              </a>{' '}
              with your order number and reason for return.
            </li>
            <li>Receive a return authorization and shipping instructions from our team.</li>
            <li>Securely pack the item in its original packaging with all tags and documentation.</li>
            <li>Ship the item to the provided return address, retaining the tracking number for reference.</li>
          </ol>
        </>
      ),
    },
    {
      id: 'exchanges',
      title: 'Exchanges',
      content:
        'We do not offer direct exchanges. To exchange an item, please return the original item following the steps above and place a new order for the desired product via our website. Check our <Link to="/help" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our Help Center">Help Center</Link> for assistance with placing a new order.',
    },
    {
      id: 'refundProcess',
      title: 'Refund Process',
      content:
        'Once we receive and inspect your returned item, we’ll process your refund to the original payment method (e.g., card via Paystack, mobile money via MTN MoMo) within 5-10 business days. You’ll receive an email confirmation when the refund is issued. For payment details, see our <Link to="/payment-methods" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Payment Methods">Payment Methods</Link> page.',
    },
    {
      id: 'contactUs',
      title: 'Contact Us',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            Need help with a return? Contact our customer support team:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <li>
              <strong>Email:</strong>{' '}
              <a
                href="mailto:support@glamscloset.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                aria-label="Email GlamsCloset Support"
              >
                support@glamscloset.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{' '}
              <a
                href="tel:+233542271847"
                className="text-blue-600 dark:text-blue-400 hover:underline"
                aria-label="Call GlamsCloset Support"
              >
                +233 542 271 847
              </a>
            </li>
            <li>
              <strong>More Support:</strong>{' '}
              <Link to="/help" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our Help Center">
                Visit our Help Center
              </Link>
            </li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            For additional terms, see our{' '}
            <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Terms of Service">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">
              Privacy Policy
            </Link>.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-primary dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 sm:px-8 sm:py-12 max-w-7xl">
        <motion.h2
          className="text-4xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Returns & Exchanges
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last Updated: {lastUpdated}
        </motion.p>

        {/* Table of Contents */}
        <motion.div
          className="mb-12 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {returnSections.map((section) => (
              <li key={section.id}>
                <motion.a
                  href={`#${section.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {section.title}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Return Sections */}
        {returnSections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex justify-between w-full"
              aria-expanded={sections[section.id]}
              aria-controls={`section-${section.id}`}
            >
              <span>{section.title}</span>
              <motion.span
                className="text-gray-500 dark:text-gray-400"
                animate={{ rotate: sections[section.id] ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {sections[section.id] ? '−' : '+'}
              </motion.span>
            </button>
            <AnimatePresence>
              {sections[section.id] && (
                <motion.div
                  id={`section-${section.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden text-gray-600 dark:text-gray-300 leading-relaxed mt-4"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        ))}

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Scroll to top"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Returns;