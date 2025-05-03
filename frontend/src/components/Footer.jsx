import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaDiscord, 
  FaFacebook, 
  FaInstagram, 
  FaPhone, 
  FaTwitter, 
  FaWhatsapp, 
  FaSnapchat, 
  FaTiktok 
} from 'react-icons/fa';
import { FaLocationDot, FaEnvelope } from 'react-icons/fa6';
// Placeholder for future logo (add to src/assets/assets/)
import logoPlaceholder from '../assets/assets/placeholder.jpg'; // Create this file if adding a logo

const Footer = () => {
  const [logoError, setLogoError] = useState(false);

  const handleSocialClick = (platform) => {
    toast.success(`Opening ${platform} for GlamsCloset`);
  };

  const handleNavClick = (page) => {
    toast.success(`Navigating to ${page}`);
  };

  const socialLinks = [
    { Icon: FaInstagram, url: 'https://instagram.com/glamscloset', label: 'Follow GlamsCloset on Instagram' },
    { Icon: FaTwitter, url: 'https://twitter.com/glamscloset', label: 'Follow GlamsCloset on Twitter' },
    { Icon: FaFacebook, url: 'https://facebook.com/glamscloset', label: 'Follow GlamsCloset on Facebook' },
    { Icon: FaTiktok, url: 'https://tiktok.com/@glamscloset', label: 'Follow GlamsCloset on TikTok' },
    { Icon: FaWhatsapp, url: 'https://wa.me/+233542271847', label: 'Contact GlamsCloset on WhatsApp' },
    { Icon: FaDiscord, url: 'https://discord.gg/glamscloset', label: 'Join GlamsCloset on Discord' },
    { Icon: FaSnapchat, url: 'https://snapchat.com/add/glamscloset', label: 'Follow GlamsCloset on Snapchat' },
  ];

  const navLinks = {
    customerService: [
      { name: 'Help Center', path: '/help', label: 'Go to Help Center' },
      { name: 'Payment Methods', path: '/payment', label: 'Go to Payment Methods' },
      { name: 'Contact', path: '/contact', label: 'Go to Contact page' },
      { name: 'Orders', path: '/orders', label: 'Go to Orders page' },
      { name: 'Returns', path: '/returns', label: 'Go to Returns page' },
      {name: 'Track Orders', path: '/track-order/:orderId', label: 'Go to Track Orders page'}
    ],
    information: [
      { name: 'About', path: '/about', label: 'Go to About page' },
      { name: 'Account', path: '/account', label: 'Go to My Accounts Page' },
      { name: 'Blog', path: '/blog', label: 'Go to Blog page' },
      { name: 'Testimonials', path: '/testimonial', label: 'Go to Testimonials Page' },
      { name: 'Collections', path: '/collection', label: 'Go to Collections page' },
    ],
    policies: [
      { name: 'Terms', path: '/terms', label: 'Go to Terms page' },
      { name: 'Privacy', path: '/privacy', label: 'Go to Privacy page' },
      { name: 'Cookies', path: '/cookies', label: 'Go to Cookies page' },
    ],
  };

  return (
    <footer className="bg-primary dark:bg-gray-900 text-gray-300 dark:text-gray-300">
      {/* Top Section - Contact Info */}
      <div className="container mx-auto px-4 sm:px-6 py-12 border-b border-gray-700 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-serif font-medium mb-4 text-gray-700 dark:text-white">We're Here to Help</h3>
            <p className="text-gray-400 dark:text-gray-400">Your satisfaction is our priority. Contact us anytime for assistance with your orders or inquiries.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-indigo-400 dark:text-indigo-400">
                <FaLocationDot size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-50 dark:text-white">Location</h4>
                <p className="text-gray-400 dark:text-gray-400">Koforidua Zongo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-indigo-400 dark:text-indigo-400">
                <FaPhone size={18} />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-50 dark:text-white">Phone</h4>
                <a 
                  href="tel:+233542271847" 
                  className="text-gray-400 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Call GlamsCloset at +233 542 271 847"
                >
                  +233 542 271 847
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-indigo-400 dark:text-indigo-400">
                <FaEnvelope size={18} />
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-50 dark:text-white">Email</h4>
                <a 
                  href="mailto:yakubuabdulaziz641@gmail.com" 
                  className="text-gray-400 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label="Email GlamsCloset"
                >
                  yakubuabdulaziz641@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Links */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Brand Info */}
          <div className="max-w-xs">
            {/* Optional Logo (uncomment if adding) */}
            {/* 
            <img 
              src={logoError ? logoPlaceholder : '/path/to/logo.png'} 
              alt="GlamsCloset Logo"
              className="w-32 mb-4"
              onError={() => setLogoError(true)}
            />
            */}
            <h2 className="text-3xl font-serif font-medium mb-4 text-gray-50 dark:text-white">
              Glams<span className="text-secondary dark:text-indigo-400">Closet</span>
            </h2>
            <p className="text-gray-400 dark:text-gray-400 mb-6">Elevating your style with carefully curated fashion pieces for every occasion.</p>
            
            <div className="flex gap-6">
              {socialLinks.map(({ Icon, url, label }, index) => (
                <a 
                  key={index} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
                  aria-label={label}
                  onClick={() => handleSocialClick(label.split(' ')[2])}
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 ">
            <div>
              <h4 className="font-serif text-lg font-medium mb-4 text-gray-50 dark:text-white">Customer Service</h4>
              <ul className="space-y-2">
                {navLinks.customerService.map(({ name, path, label }) => (
                  <li key={name}>
                    <Link 
                      to={path} 
                      className="text-gray-400 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
                      aria-label={label}
                      onClick={() => handleNavClick(name)}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-medium mb-4 text-gray-50 dark:text-white">Information</h4>
              <ul className="space-y-2">
                {navLinks.information.map(({ name, path, label }) => (
                  <li key={name}>
                    <Link 
                      to={path} 
                      className="text-gray-400 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors"
                      aria-label={label}
                      onClick={() => handleNavClick(name)}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="bg-gray-800 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-400 text-sm">© 2025 GlamsCloset. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {navLinks.policies.map(({ name, path, label }) => (
              <Link 
                key={name}
                to={path} 
                className="text-gray-400 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-400 text-sm"
                aria-label={label}
                onClick={() => handleNavClick(name)}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;