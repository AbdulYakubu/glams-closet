import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TermsPage = () => {
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

  const termsSections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content:
        'Welcome to GlamsCloset! These Terms of Service govern your use of our website and services, including browsing, purchasing, and interacting with our platform. By accessing or using our site, you agree to be bound by these terms and our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">Privacy Policy</Link>.',
    },
    {
      id: 'user-responsibilities',
      title: '2. User Responsibilities',
      content:
        'You agree to use our site for lawful purposes only. You are responsible for providing accurate information during account creation, purchases, or returns. You must not misuse our services, including attempting to access unauthorized areas or disrupt site functionality.',
    },
    {
      id: 'intellectual-property',
      title: '3. Intellectual Property',
      content:
        'All content on our website, including images, designs, logos, and text, is the property of GlamsCloset or our licensors. You may not reproduce, distribute, or use our content without prior written permission, except for personal, non-commercial use.',
    },
    {
      id: 'payments',
      title: '4. Payments',
      content:
        'Payments for purchases must be made through our secure payment gateway, supporting card payments (via Paystack), mobile money (e.g., MTN MoMo), or cash on delivery (COD) in select areas. You agree to provide accurate billing information and ensure timely payment. See our <Link to="/payment-methods" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Payment Methods">Payment Methods</Link> for details.',
    },
    {
      id: 'shipping',
      title: '5. Shipping',
      content:
        'We offer various shipping options, with times and fees displayed at checkout. Once an order is shipped, we are not responsible for delays caused by shipping providers. Please review our shipping policies during checkout for specific details.',
    },
    {
      id: 'returns',
      title: '6. Returns and Refunds',
      content:
        'Our return and refund policies are outlined on our <Link to="/returns" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Returns Policy">Returns Page</Link>. Items must be returned within 30 days, unused, and in original packaging, unless marked as final sale.',
    },
    {
      id: 'limitation-liability',
      title: '7. Limitation of Liability',
      content:
        'GlamsCloset is not liable for any damages resulting from the use of our website or services, including but not limited to interrupted access or errors. You use our site at your own risk, and we do not guarantee uninterrupted or error-free service.',
    },
    {
      id: 'governing-law',
      title: '8. Governing Law',
      content:
        'These terms are governed by the laws of Ghana, where GlamsCloset operates. Any disputes will be resolved in accordance with Ghanaian regulations and jurisdiction.',
    },
    {
      id: 'changes-terms',
      title: '9. Changes to Terms',
      content:
        'We may update these terms at any time. Changes will be posted on this page with a revised "Last Updated" date. Please review this page periodically to stay informed of any updates.',
    },
    {
      id: 'contact-us',
      title: '10. Contact Us',
      content: (
        <>
          For questions about these Terms of Service, contact us at{' '}
          <a
            href="mailto:support@glamscloset.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="Email GlamsCloset Support"
          >
            support@glamscloset.com
          </a>{' '}
          or call{' '}
          <a
            href="tel:+233542271847"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="Call GlamsCloset Support"
          >
            +233 542 271 847
          </a>.
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
          Terms of Service
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
            {termsSections.map((section) => (
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

        {/* Terms Sections */}
        {termsSections.map((section, index) => (
          <motion.article
            key={section.id}
            id={section.id}
            className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-4 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{section.title}</h3>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">{section.content}</div>
          </motion.article>
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

export default TermsPage;