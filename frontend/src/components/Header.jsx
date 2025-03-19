import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { FaBarsStaggered } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { TbBasket, TbHeart, TbUserCircle } from 'react-icons/tb';
import { RiUserLine } from 'react-icons/ri';
import { ShopContext } from '../context/ShopContext';

const Header = () => {
  const { token, getCartCount, getWishlistCount } = useContext(ShopContext);
  const [menuOpened, setMenuOpened] = useState(false);

  // Ensure cart and wishlist counts always return numbers
  const cartCount = useMemo(() => getCartCount() || 0, [getCartCount]);
  const wishlistCount = useMemo(() => getWishlistCount() || 0, [getWishlistCount]);

  const toggleMenu = () => setMenuOpened((prev) => !prev);

  return (
    <header className="max-padd-container w-full z-50 lg:px-12">
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
          />
        </div>

        {/* Buttons Right side */}
        <div className="flex-1 flex items-center justify-end gap-x-2 xs:gap-x-8 flex-wrap">
          {/* Menu toggle */}
          <FaBarsStaggered
            onClick={toggleMenu}
            className="xs:hidden cursor-pointer text-xl"
          />

          {/* Search icon */}
          <FaSearch className="text-lg cursor-pointer" />

          {/* Cart */}
          <Link to="/cart" className="flex relative">
            <TbBasket className="text-[27px]" />
            {cartCount > 0 && (
              <span className="bg-secondary text-white text-[12px] absolute font-semibold left-1.5 -top-3.5 flexCenter w-4 h-4 rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex relative">
            <TbHeart className="text-[27px]" />
            {wishlistCount > 0 && (
              <span className="bg-secondary text-white text-[12px] absolute font-semibold left-1.5 -top-3.5 flexCenter w-4 h-4 rounded-full shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User profile */}
          <div className="flex items-center gap-x-2">
            {token ? (
              <TbUserCircle className="text-[29px] cursor-pointer" />
            ) : (
              <button className="btn-light flexCenter gap-x-2">
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