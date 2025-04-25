import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import NewArrivals from '../components/NewArrivals';
import Banner from '../components/Banner';
import PopularProducts from '../components/PopularProducts';
import Blog from '../components/Blog';
import Footer from '../components/Footer';
import Categories from '../components/Category';
import { motion, AnimatePresence } from 'framer-motion';

// Create a Dark Mode Context
export const DarkModeContext = React.createContext();

const Home = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

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

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
        <Hero />
        <Categories />
        <NewArrivals />
        <Banner />
        <PopularProducts />
        <Blog />
        <Footer />

        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className={`fixed bottom-4 right-4 px-4 py-2 rounded-full shadow-lg z-50 ${
                darkMode ? 'bg-indigo-600 text-white' : 'bg-black text-white'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              ↑ Back to Top
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </DarkModeContext.Provider>
  );
};

export default Home;