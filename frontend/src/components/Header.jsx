import React, { useContext, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6'; // Fixed close icon import
import { FaSearch } from 'react-icons/fa';
import { TbBasket, TbHeart, TbUserCircle } from 'react-icons/tb';
import { RiUserLine } from 'react-icons/ri';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, setToken, getCartCount, getWishlistCount, navigate } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const cartCount = useMemo(() => getCartCount() || 0, [getCartCount]);
  const wishlistCount = useMemo(() => getWishlistCount() || 0, [getWishlistCount]);

  const toggleMenu = useCallback(() => setMenuOpened(prev => !prev), []);
  
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

  return (
    <header className="max-padd-container w-full lg:px-12 sticky top-0 bg-white z-40 shadow-sm">
      <div className="flexBetween py-3">
        {/* Logo */}
        <Link to="/" className="flex flex-1" aria-label="Home">
          <h1 className="bold-32">
            Glams<span className="text-secondary">Closet</span>
          </h1>
        </Link>

        {/* Desktop Navbar and Icons */}
        <div className="hidden xs:flex flex-1 items-center justify-end gap-x-8">
          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <FaSearch className="text-gray-500" />
            </button>
          </form>

          {/* Desktop Icons */}
          <div className="flex items-center gap-x-5">
            <Link to="/cart" className="relative">
              <TbBasket className="text-[27px]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative">
              <TbHeart className="text-[27px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {token ? (
              <div className="relative group">
                <TbUserCircle className="text-[29px] cursor-pointer" />
                <ul className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <li>
                    <button
                      onClick={() => navigate('/orders')}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-light flex items-center gap-x-2 px-4 py-2 rounded-full"
              >
                Login <RiUserLine className="text-xl" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="xs:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-expanded={menuOpened}
        >
          {menuOpened ? <FaXmark className="text-xl" /> : <FaBarsStaggered className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpened && (
        <div className="xs:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}>
          <div 
            className="absolute top-16 right-4 bg-white rounded-lg shadow-xl p-4 w-64 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search in mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FaSearch className="text-gray-500" />
                </button>
              </div>
            </form>

            <Navbar 
              containerStyles="flex flex-col gap-y-4"
              onLinkClick={toggleMenu}
            />

            {/* Mobile Icons */}
            <div className="flex justify-around mt-4 pt-4 border-t border-gray-200">
              <Link to="/cart" className="relative" onClick={toggleMenu}>
                <TbBasket className="text-[24px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/wishlist" className="relative" onClick={toggleMenu}>
                <TbHeart className="text-[24px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {token ? (
                <div className="relative">
                  <TbUserCircle className="text-[24px]" />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg py-1 w-40">
                    <button
                      onClick={() => {
                        navigate('/orders');
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        toggleMenu();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    toggleMenu();
                  }}
                >
                  <RiUserLine className="text-[24px]" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;