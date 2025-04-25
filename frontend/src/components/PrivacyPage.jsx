import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPage = () => {
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

  const privacySections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content:
        'At GlamsCloset, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information when you visit our website or use our services. By accessing our site, you agree to this policy and our <Link to="/terms" className="text-blue-600 hover:underline" aria-label="View our Terms of Service">Terms of Service</Link>.',
    },
    {
      id: 'information-collect',
      title: '2. Information We Collect',
      content: (
        <>
          <p className="text-gray-600">
            We collect information to provide and improve our services. This includes:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping addresses provided during account creation or purchases.</li>
            <li><strong>Payment Information:</strong> Processed securely through our payment gateway (we do not store full payment details).</li>
            <li><strong>Usage Data:</strong> IP address, browser типу, pages visited, and interactions with our site.</li>
            <li><strong>Cookies:</strong> Data from cookies and similar technologies to enhance your browsing experience (see Cookies section).</li>
          </ul>
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: '3. How We Use Your Information',
      content: (
        <>
          <p className="text-gray-600">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li>Process and fulfill your orders, including shipping and returns.</li>
            <li>Communicate with you about your account, orders, or customer service inquiries.</li>
            <li>Personalize your shopping experience with tailored recommendations.</li>
            <li>Improve our website and services through analytics.</li>
            <li>Send promotional emails or newsletters (you can opt out at any time).</li>
          </ul>
        </>
      ),
    },
    {
      id: 'sharing-information',
      title: '4. Sharing Your Information',
      content:
        'We do not sell your personal information. We may share it with trusted third parties, such as payment processors, shipping providers, or analytics services, solely to provide our services. These parties are contractually obligated to protect your data. We may also disclose information if required by law or to protect our rights.',
    },
    {
      id: 'your-rights',
      title: '5. Your Rights',
      content:
        'You have the right to access, update, or delete your personal information. You can manage your account settings or contact us to exercise these rights. You may also opt out of marketing communications at any time by clicking the unsubscribe link in our emails.',
    },
    {
      id: 'cookies',
      title: '6. Cookies and Tracking',
      content:
        'We use cookies to enhance your experience, such as remembering your preferences and analyzing site usage. You can control cookies through your browser settings. Disabling cookies may affect some site functionality.',
    },
    {
      id: 'security',
      title: '7. Security',
      content:
        'We implement industry-standard security measures to protect your data, including encryption and secure servers. However, no online system is completely secure, and you use our site at your own risk.',
    },
    {
      id: 'changes-policy',
      title: '8. Changes to This Policy',
      content:
        'We may update this Privacy Policy periodically. Changes will be posted on this page with a revised "Last Updated" date. Please review this policy regularly to stay informed.',
    },
    {
      id: 'contact-us',
      title: '9. Contact Us',
      content: (
        <>
          If you have questions about this Privacy Policy, please contact us at{' '}
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
          </a>.
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
          Privacy Policy
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
            {privacySections.map((section) => (
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

        {/* Privacy Sections */}
        {privacySections.map((section, index) => (
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

export default PrivacyPage;