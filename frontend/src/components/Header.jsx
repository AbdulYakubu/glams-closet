import React, { useContext, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaSearch, FaUser, FaShoppingBag, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import Navbar from './Navbar';

const Header = () => {
  const { token, setToken, getCartCount, getWishlistCount } = useContext(ShopContext);
  const navigate = useNavigate();
  const [menuOpened, setMenuOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const cartCount = useMemo(() => getCartCount() || 0, [getCartCount]);
  const wishlistCount = useMemo(() => getWishlistCount() || 0, [getWishlistCount]);

  const toggleMenu = useCallback(() => setMenuOpened(prev => !prev), []);
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newMode = !prev;
      document.documentElement.classList.toggle('dark', newMode);
      return newMode;
    });
  }, []);
  
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  }, [setToken, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
      setMenuOpened(false);
    }
  };

  // Animation variants
  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: '100%',
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <header className="w-full sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xs:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-gray-900 dark:text-white">Glam</span>
              <span className="text-secondary dark:text-secondary-light">Closet</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden xs:flex items-center space-x-6">
            <Navbar containerStyles="flex space-x-6" />

            {/* Search - Desktop */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-primary focus:border-transparent w-64 text-sm bg-white dark:bg-gray-800 dark:text-white"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-primary transition-colors"
                  >
                    <FaSearch className="text-sm" />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hidden xs:flex text-gray-600 dark:text-white hover:text-secondary dark:hover:text-blue-400 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/cart" 
                className="relative p-2 hover:text-secondary dark:hover:text-secondary-light transition-colors group"
              >
                <FaShoppingBag className="text-lg text-gray-700 dark:text-gray-300 hover:bg-secondary rounded-full " />
                {cartCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-secondary dark:bg-secondary-light text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <Link 
                to="/wishlist" 
                className="relative p-2 hover:text-red-500 transition-colors group"
              >
                <FaHeart className="text-lg text-gray-700 dark:text-gray-300  hover:bg-red-600 rounded-full" />
                {wishlistCount > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={wishlistCount}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {token ? (
                <div className="relative group">
                  <button 
                    className="p-2 hover:text-secondary dark:hover:text-primary transition-colors flex items-center gap-1"
                    aria-label="User account"
                  >
                    <FaUser className="text-lg text-gray-700 dark:text-gray-300" />
                    <span className="text-sm hidden xl:inline dark:text-white">Account</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate('/account')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-white"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-sm border-t border-gray-100 dark:border-gray-700 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary dark:bg-primary text-white rounded-full hover:bg-secondary-dark dark:hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">Login</span>
                  <FaUser className="text-sm" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xs:hidden items-center space-x-4">
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-primary transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary-light transition-colors lg:hidden"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun className="text-lg" /> : <FaMoon className="text-lg" />}
            </button>
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpened ? (
                <FaTimes className="text-lg text-gray-700 dark:text-gray-300" />
              ) : (
                <FaBars className="text-lg text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 px-4 py-2 border-t border-gray-100 dark:border-gray-800"
          >
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-light text-sm bg-white dark:bg-gray-800 dark:text-white"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowSearch(false)}
                className="ml-2 p-2 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary-light transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpened && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={toggleMenu}
            />
            
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-2xl font-bold" onClick={toggleMenu}>
                  <span className="text-gray-900 dark:text-white">Glam</span>
                  <span className="text-secondary dark:text-secondary-light">Closet</span>
                </Link>
                <button 
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaTimes className="text-lg text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className="w-full px-4 py-2 mb-4 rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? (
                  <>
                    <FaSun className="text-gray-700 dark:text-gray-300" />
                    <span className="dark:text-white">Light Mode</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-gray-700 dark:text-gray-300 " />
                    <span className="dark:text-white">Dark Mode</span>
                  </>
                )}
              </button>

              {/* Mobile Navigation */}
              <motion.div variants={itemVariants}>
                <Navbar 
                  containerStyles="flex flex-col space-y-4 mb-6"
                  linkStyles="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors dark:text-white"
                  onLinkClick={toggleMenu}
                />
              </motion.div>

              {/* Mobile Account Actions */}
              <motion.div 
                variants={itemVariants}
                className="py-4 border-t border-gray-100 dark:border-gray-800"
              >
                {token ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/account');
                        toggleMenu();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 dark:text-white"
                    >
                      <FaUser className="text-gray-500 dark:text-gray-400" />
                      <span>My Account</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/orders');
                        toggleMenu();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 dark:text-white"
                    >
                      <FaShoppingBag className="text-gray-500 dark:text-gray-400" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <FaTimes className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      toggleMenu();
                    }}
                    className="w-full px-4 py-2 bg-secondary dark:bg-secondary-light text-white rounded-lg hover:bg-secondary-dark dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUser />
                    <span>Login / Register</span>
                  </button>
                )}
              </motion.div>

              {/* Mobile Cart/Wishlist */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-around py-4 border-t border-gray-100 dark:border-gray-800"
              >
                <Link 
                  to="/cart" 
                  className="relative p-2 hover:text-secondary dark:hover:text-secondary-light transition-colors flex flex-col items-center"
                  onClick={toggleMenu}
                >
                  <FaShoppingBag className="text-lg text-gray-700 dark:text-gray-300" />
                  <span className="text-xs mt-1 dark:text-white">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary dark:bg-secondary-light text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link 
                  to="/wishlist" 
                  className="relative p-2 hover:text-red-500 transition-colors flex flex-col items-center"
                  onClick={toggleMenu}
                >
                  <FaHeart className="text-lg text-gray-700 dark:text-gray-300" />
                  <span className="text-xs mt-1 dark:text-white">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;