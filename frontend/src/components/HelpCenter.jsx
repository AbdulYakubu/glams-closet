import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenterPage = () => {
  const lastUpdated = 'April 25, 2025';
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [faqs, setFaqs] = useState({
    orderStatus: false,
    paymentOptions: false,
    shippingTimes: false,
    returnProcess: false,
    accountIssues: false,
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

  const toggleFaq = (faq) => {
    setFaqs((prev) => ({ ...prev, [faq]: !prev[faq] }));
  };

  const helpSections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content:
        'Welcome to the GlamsCloset Help Center! Here, you’ll find answers to common questions, links to our policies, and ways to contact our support team. Whether you need help with an order, payment, shipping, or returns, we’re here to assist you.',
    },
    {
      id: 'faqs',
      title: 'Frequently Asked Questions',
      content: (
        <div className="space-y-6">
          {[
            {
              id: 'orderStatus',
              question: 'How can I track my order?',
              answer:
                'Once your order is shipped, you’ll receive a tracking number via email. You can use this number on our shipping provider’s website to check your order’s status. If you don’t receive a tracking number within 3 business days, contact us at <a href="mailto:support@glamscloset.com" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Email GlamsCloset Support">support@glamscloset.com</a>.',
            },
            {
              id: 'paymentOptions',
              question: 'What payment methods do you accept?',
              answer:
                'We accept card payments (Visa, Mastercard via Paystack), mobile money (e.g., MTN MoMo), and cash on delivery (COD) in select areas. For details, see our <Link to="/payment-methods" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Payment Methods">Payment Methods</Link> page.',
            },
            {
              id: 'shippingTimes',
              question: 'How long does shipping take?',
              answer:
                'Shipping times vary by location and method selected at checkout. In Ghana, standard shipping typically takes 3-7 business days. International orders may take 7-14 business days. Check your order confirmation for estimated delivery dates.',
            },
            {
              id: 'returnProcess',
              question: 'How do I return an item?',
              answer:
                'To return an item, follow the steps on our <Link to="/returns" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Returns Policy">Returns Page</Link>. Items must be unused, in original packaging, and returned within 30 days. Contact us for a return authorization.',
            },
            {
              id: 'accountIssues',
              question: 'What should I do if I can’t log into my account?',
              answer:
                'If you’re having trouble logging in, try resetting your password using the “Forgot Password” link. If the issue persists, contact our support team at <a href="mailto:support@glamscloset.com" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Email GlamsCloset Support">support@glamscloset.com</a> or call <a href="tel:+233542271847" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Call GlamsCloset Support">+233 542 271 847</a>.',
            },
          ].map((faq) => (
            <motion.section
              key={faq.id}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex justify-between w-full"
                aria-expanded={faqs[faq.id]}
                aria-controls={`faq-${faq.id}`}
              >
                <span>{faq.question}</span>
                <motion.span
                  className="text-gray-500 dark:text-gray-400"
                  animate={{ rotate: faqs[faq.id] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {faqs[faq.id] ? '−' : '+'}
                </motion.span>
              </button>
              <AnimatePresence>
                {faqs[faq.id] && (
                  <motion.div
                    id={`faq-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden text-gray-600 dark:text-gray-300 leading-relaxed mt-4"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          ))}
        </div>
      ),
    },
    {
      id: 'policy-links',
      title: 'Our Policies',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            For detailed information on our policies, please review the following:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <li>
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Terms of Service">
                Terms of Service
              </Link>{' '}
              - Governs your use of our website and services.
            </li>
            <li>
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">
                Privacy Policy
              </Link>{' '}
              - Explains how we collect, use, and protect your data.
            </li>
            <li>
              <Link to="/returns" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Returns Policy">
                Returns Policy
              </Link>{' '}
              - Details our process for returns and refunds.
            </li>
            <li>
              <Link to="/payment-methods" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Payment Methods">
                Payment Methods
              </Link>{' '}
              - Lists accepted payment options and security measures.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            Our customer support team is here to help with any questions or issues. Reach out via:
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
              <strong>Contact Form:</strong>{' '}
              <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our Contact Form">
                Submit a query online
              </Link>
            </li>
          </ul>
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
          Help Center
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
            {helpSections.map((section) => (
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

        {/* Help Sections */}
        {helpSections.map((section, index) => (
          <motion.section
            key={section.id}
            id={section.id}
            className="mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{section.title}</h3>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</div>
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

export default HelpCenterPage;