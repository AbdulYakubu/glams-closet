import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBarsStaggered } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { TbBasket, TbHeart, TbUserCircle } from 'react-icons/tb';
import { RiUserLine } from 'react-icons/ri';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, getCartCount, getWishlistCount, navigate, } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);

  // Ensure cart and wishlist counts always return numbers
  const cartCount = useMemo(() => getCartCount() || 0, [getCartCount]);
  const wishlistCount = useMemo(() => getWishlistCount() || 0, [getWishlistCount]);

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  const logout = () => {
    
  };

  return (
    <header className="max-padd-container w-full lg:px-12">
      <div className="flexBetween py-3">
        {/* Logo left side */}
        <Link to="/" className="flex flex-1">
          <div className="bold-32">
            Glams<span className="text-secondary">Closet</span>
          </div>
        </Link>

        {/* Navbar */}
        <div className="flex-1">
          <Navbar
            containerStyles={`${menuOpened
              ? 'flex items-start flex-col gap-y-8 fixed top-16 right-6 p-5 bg-white rounded-xl shadow-md w-52 ring-1 ring-slate-900/5 z-50'
              : 'hidden xs:flex gap-x-5 xs:gap-x-10 medium-15 ring-1 ring-slate-900/5 rounded-full p-1'
            }`}
            onLinkClick={() => setMenuOpened(false)} // Close mobile menu on link click
          />
        </div>

        {/* Buttons Right side */}
        <div className="flex-1 flex items-center justify-end gap-x-2 xs:gap-x-8 flex-wrap">
          {/* Menu toggle */}
          <FaBarsStaggered
            onClick={toggleMenu}
            className="xs:hidden cursor-pointer text-xl"
            aria-label="Toggle Menu"
          />

          {/* Search icon */}
          <FaSearch className="text-lg cursor-pointer" aria-label="Search" />

          {/* Cart */}
          <Link to="/cart" className="flex relative" aria-label="Cart">
            <TbBasket className="text-[27px]" />
            {cartCount > 0 && (
              <span className="bg-secondary text-white text-[12px] absolute font-semibold left-1.5 -top-3.5 flexCenter w-4 h-4 rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex relative" aria-label="Wishlist">
            <TbHeart className="text-[27px]" />
            {wishlistCount > 0 && (
              <span className="bg-secondary text-white text-[12px] absolute font-semibold left-1.5 -top-3.5 flexCenter w-4 h-4 rounded-full shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User profile */}
          <div className="flex items-center gap-x-2 group relative">
            {token ? (
              <>
                <TbUserCircle className="text-[29px] cursor-pointer" aria-label="User Profile" />
                {/* Dropdown */}
                <ul className="bg-white p-2 w-32 ring-1 ring-slate-900/5 rounded absolute right-0 top-8 hidden group-hover:flex flex-col regular-14 shadow-md z-50">
                  <li
                    onClick={() => navigate('/orders')}
                    className="p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer"
                  >
                    Orders
                  </li>
                  <li
                    onClick={logout}
                    className="p-2 text-tertiary rounded-md hover:bg-primary cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-light flexCenter gap-x-2"
                aria-label="Login"
              >
                Login <RiUserLine className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;