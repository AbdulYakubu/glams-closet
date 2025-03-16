import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ containerStyles, onLinkClick }) => {
  const navLinks = [
    { path: '/', title: 'Home' },
    { path: '/collection', title: 'Collection' },
    { path: '/testimonial', title: 'Testimonial' },
    { path: '/contact', title: 'Contact' },
  ];

  return (
    <nav className={`${containerStyles}`}>
      {navLinks.map((link) => (
        <NavLink
          key={link.title}
          to={link.path}
          className={({ isActive }) => isActive ? "active-link" : "inactive-link"}
          onClick={onLinkClick} // Close menu on link click
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};
export default Navbar;