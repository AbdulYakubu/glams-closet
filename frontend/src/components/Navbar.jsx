import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ containerStyles, onLinkClick }) => {
  const navLinks = [
    { path: '/', title: 'Home' },
    { path: '/collection', title: 'Collection' },
    { path: '/aboutus', title: 'About Us' },
    { path: '/contact', title: 'Contact' },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          className={({ isActive }) =>
            `transition-all duration-300 text-gray-900 dark:text-white ${
              isActive ? 'active-link' : 'inactive-link'
            }`
          }
          onClick={onLinkClick}
          aria-label={link.title}
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;