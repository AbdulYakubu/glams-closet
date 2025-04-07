import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdFactCheck } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { FaListAlt } from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const navItemBase = "flex items-center gap-x-2 p-3 sm:pl-12 medium-15 cursor-pointer h-10 rounded-xl transition-colors duration-200";
  const navItemInactive = `${navItemBase} hover:bg-[#c1e8ef36]`;
  const navItemActive = `${navItemBase} text-[#43c2d1] bg-[#c1e8ef36] border-[#43c2d1] max-sm:border-b-4 sm:border-r-4`;

  const navItems = [
    {
      path: '/',
      icon: <FaSquarePlus />,
      text: 'Add Item',
      ariaLabel: 'Add new item'
    },
    {
      path: '/list',
      icon: <FaListAlt />,
      text: 'List',
      ariaLabel: 'View items list'
    },
    {
      path: '/orders',
      icon: <MdFactCheck />,
      text: 'Orders',
      ariaLabel: 'View orders'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout?.(); // safe optional chaining
    }
  };

  return (
    <div className='bg-white rounded-lg sm:rounded-none max-sm:flex max-sm:justify-center max-sm:items-center max-sm:pb-3 sm:w-1/5 sm:min-h-screen shadow-sm sm:shadow-none'>
      <div className='flex flex-col gap-y-6 max-sm:items-center sm:flex-col pt-4 sm:pt-8 lg:pt-14'>
        {/* Logo */}
        <Link 
          to={'/'}
          className='bold-22 xl:bold-32 sm:pl-2 lg:pl-12 hover:text-[#43c2d1] transition-colors duration-200'
          aria-label='GlamsCloset Home'
        >
          Glams<span className='text-[#43c2d1]'>Closet</span>
        </Link>

        {/* Navigation */}
        <nav className='flex sm:flex-col gap-x-5 gap-y-6 sm:pt-8 lg:pt-10 w-full'>
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                isActive ? navItemActive : navItemInactive
              }
              aria-label={item.ariaLabel}
              end
            >
              <span className="text-lg" title={item.text}>{item.icon}</span>
              <span className='hidden lg:inline'>{item.text}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`${navItemInactive} text-red-500 hover:bg-red-50 max-sm:ml-5 sm:mt-auto`}
            aria-label='Logout'
          >
            <BiLogOut className='text-lg' />
            <span className='hidden lg:inline'>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;