import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdFactCheck } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { FaListAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const baseStyle = "flex items-center gap-x-3 px-4 py-2 rounded-xl transition-all duration-200 font-medium";
  const inactiveStyle = `${baseStyle} text-gray-700 hover:bg-[#eafafc]`;
  const activeStyle = `${baseStyle} text-[#43c2d1] bg-[#c1e8ef36] border-l-4 border-[#43c2d1]`;

  const navItems = [
    {
      path: '/',
      icon: <FaSquarePlus />,
      text: 'Add Item',
      ariaLabel: 'Add new item',
    },
    {
      path: '/list',
      icon: <FaListAlt />,
      text: 'List',
      ariaLabel: 'View items list',
    },
    {
      path: '/orders',
      icon: <MdFactCheck />,
      text: 'Orders',
      ariaLabel: 'View orders',
    },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout?.();
    }
  };

  return (
    <aside className="bg-white shadow-md sm:shadow-none rounded-lg sm:rounded-none sm:min-h-screen sm:w-1/5 max-sm:pb-4 flex flex-col sm:pt-10 sm:pl-4 lg:pl-10">
      {/* Logo */}
      <Link 
        to="/"
        className="text-2xl sm:text-3xl font-bold text-gray-800 hover:text-[#43c2d1] transition-colors duration-200 px-4 sm:px-0"
        aria-label="Go to homepage"
      >
        Glams<span className="text-[#43c2d1]">Closet</span>
      </Link>

      {/* Navigation */}
      <nav className="mt-8 flex flex-col gap-3 px-4 sm:px-0">
        {navItems.map(({ path, icon, text, ariaLabel }) => (
          <NavLink
            key={path}
            to={path}
            aria-label={ariaLabel}
            title={text}
            end
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            <span className="text-xl">{icon}</span>
            <span className="hidden lg:inline">{text}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto px-4 sm:px-0 pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-x-3 px-4 py-2 rounded-xl text-red-500 hover:bg-red-100 transition duration-200"
          aria-label="Logout"
        >
          <BiLogOut className="text-xl" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;