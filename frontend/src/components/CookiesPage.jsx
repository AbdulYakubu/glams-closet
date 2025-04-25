import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CookiesPage = () => {
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

  const cookieSections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content:
        'At GlamsCloset, we use cookies and similar technologies to enhance your browsing experience, personalize content, and analyze site performance. This Cookies Policy explains what cookies are, how we use them, and how you can manage your cookie preferences. For more details on data handling, see our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">Privacy Policy</Link>.',
    },
    {
      id: 'what-are-cookies',
      title: '2. What Are Cookies?',
      content:
        'Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, track usage patterns, and deliver a tailored experience. Cookies may be session-based (deleted when you close your browser) or persistent (stored for a set period).',
    },
    {
      id: 'types-of-cookies',
      title: '3. Types of Cookies We Use',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300 space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to function, such as maintaining your session or enabling secure checkout (e.g., via Paystack).
            </li>
            <li>
              <strong>Performance Cookies:</strong> Collect anonymous data on how visitors use our site, helping us improve performance and navigation.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences (e.g., language or region) to provide a personalized experience.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Deliver relevant ads and track ad performance, often set by third-party partners.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'managing-cookies',
      title: '4. Managing Cookies',
      content:
        'You can control cookies through your browser settings or our cookie consent tool (displayed on your first visit). Disabling cookies may limit some site features, such as personalized recommendations or checkout functionality. To learn more, visit our <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">Privacy Policy</Link> or contact us.',
    },
    {
      id: 'third-party-cookies',
      title: '5. Third-Party Cookies',
      content:
        'Some cookies are set by third-party services, such as analytics providers or advertising networks. These cookies help us understand user behavior and deliver targeted ads. You can opt out of third-party cookies via our consent tool or your browser settings.',
    },
    {
      id: 'changes-policy',
      title: '6. Changes to This Policy',
      content:
        'We may update this Cookies Policy to reflect changes in our practices or legal requirements. Updates will be posted here with a revised "Last Updated" date. Please review this page periodically.',
    },
    {
      id: 'contact-us',
      title: '7. Contact Us',
      content: (
        <>
          <p className="text-gray-600 dark:text-gray-300">
            For questions about our use of cookies, contact our support team:
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
            For additional details, see our{' '}
            <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Privacy Policy">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="View our Terms of Service">
              Terms of Service
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
          Cookies Policy
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
            {cookieSections.map((section) => (
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

        {/* Cookie Sections */}
        {cookieSections.map((section, index) => (
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

export default CookiesPage;