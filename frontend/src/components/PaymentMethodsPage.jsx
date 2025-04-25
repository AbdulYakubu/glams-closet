import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentMethodPage = () => {
  const lastUpdated = 'April 25, 2025';
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  const paymentSections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content:
        'At GlamsCloset, we offer secure and convenient payment options to make your shopping experience seamless. This page outlines the payment methods we accept, how we ensure security, and related policies. For more details on data protection, please see our <Link to="/privacy" className="text-blue-600 hover:underline" aria-label="View our Privacy Policy">Privacy Policy</Link>.',
    },
    {
      id: 'accepted-methods',
      title: '2. Accepted Payment Methods',
      content: (
        <>
          <p className="text-gray-600">
            We support the following payment methods to cater to our customers in West Africa and beyond:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 space-y-2">
            <li>
              <strong>Card Payments:</strong> We accept major credit and debit cards (Visa, Mastercard) through our secure payment gateway, Paystack. Enter your card details at checkout to complete your purchase.
            </li>
            <li>
              <strong>Mobile Money:</strong> Pay using mobile money services like MTN MoMo. Select the mobile money option at checkout, enter your phone number, and follow the prompts to authorize the payment via your mobile device.
            </li>
            <li>
              <strong>Cash on Delivery (COD):</strong> Available for select locations in Ghana. Choose COD at checkout, and pay in cash when your order is delivered. Please have the exact amount ready, as drivers may not carry change.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'payment-security',
      title: '3. Payment Security',
      content:
        'We prioritize your security by using industry-standard encryption and secure payment gateways. Card payments are processed via Paystack, which complies with PCI-DSS standards. Mobile money transactions are secured through trusted providers like MTN MoMo. We do not store your full payment details; sensitive information is handled directly by our payment partners. For more on data protection, see our <Link to="/privacy" className="text-blue-600 hover:underline" aria-label="View our Privacy Policy">Privacy Policy</Link>.',
    },
    {
      id: 'refunds-disputes',
      title: '4. Refunds and Disputes',
      content:
        'If you need to return an item or request a refund, please review our <Link to="/returns" className="text-blue-600 hover:underline" aria-label="View our Returns Policy">Returns Policy</Link>. Refunds are processed to your original payment method within 5-10 business days after we receive and inspect the returned item. For disputes or issues with payments, contact us immediately, and we’ll work with our payment partners to resolve the matter.',
    },
    {
      id: 'contact-us',
      title: '5. Contact Us',
      content: (
        <>
          If you have questions about our payment methods or need assistance, please contact our customer service team at{' '}
          <a
            href="mailto:support@glamscloset.com"
            className="text-blue-600 hover:underline"
            aria-label="Email GlamsCloset Support"
          >
            support@glamscloset.com
          </a>{' '}
          or call{' '}
          <a
            href="tel:+233542271847"
            className="text-blue-600 hover:underline"
            aria-label="Call GlamsCloset Support"
          >
            +233 542 271 847
          </a>. For additional terms, see our{' '}
          <Link to="/terms" className="text-blue-600 hover:underline" aria-label="View our Terms of Service">
            Terms of Service
          </Link>.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-8 sm:px-8 sm:py-12 max-w-7xl">
        <motion.h2
          className="text-4xl font-serif font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Payment Methods
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last Updated: {lastUpdated}
        </motion.p>

        {/* Table of Contents */}
        <motion.div
          className="mb-12 bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Table of Contents</h3>
          <ul className="space-y-2">
            {paymentSections.map((section) => (
              <li key={section.id}>
                <motion.a
                  href={`#${section.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {section.title}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Payment Sections */}
        {paymentSections.map((section, index) => (
          <motion.article
            key={section.id}
            id={section.id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800">{section.title}</h3>
            <div className="text-gray-600 leading-relaxed">{section.content}</div>
          </motion.article>
        ))}

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
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

export default PaymentMethodPage;