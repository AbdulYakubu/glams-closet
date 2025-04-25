import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { 
  FaDiscord, 
  FaFacebook, 
  FaInstagram, 
  FaPhone, 
  FaTwitter, 
  FaWhatsapp 
} from 'react-icons/fa';
import { 
  FaLocationDot,
  FaEnvelope
} from 'react-icons/fa6';
import { FaSnapchat, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary text-gray-700">
      {/* Top Section - Contact Info */}
      <div className="container mx-auto px-6 py-12 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <h3 className="text-2xl font-serif font-medium mb-4">We're Here to Help</h3>
            <p className="text-gray-500">Your satisfaction is our priority. Contact us anytime for assistance with your orders or inquiries.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-secondary">
                <FaLocationDot size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Location</h4>
                <p className="text-gray-500">Koforidua Zongo</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-secondary">
                <FaPhone size={18} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Phone</h4>
                <p className="text-gray-500">+233 542 271 847</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1 text-secondary">
                <FaEnvelope size={18} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Email</h4>
                <p className="text-gray-500">yakubuabdulaziz641@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Links */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Brand Info */}
          <div className="max-w-xs">
            <h2 className="text-3xl font-serif font-medium mb-4">
              Glams<span className="text-secondary">Closet</span>
            </h2>
            <p className="text-gray-500 mb-6">Elevating your style with carefully curated fashion pieces for every occasion.</p>
            
            <div className="flex gap-6">
              {[FaInstagram, FaTwitter, FaFacebook, FaTiktok, FaWhatsapp, FaDiscord, FaSnapchat].map((Icon, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-secondary transition-colors">
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2">
                {['Help Center', 'Payment Methods', 'Contact', 'Orders', 'Returns'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.replace('', '').toLowerCase()}`} className="text-gray-500 hover:text-secondary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Information</h4>
              <ul className="space-y-2">
                {['AboutUs', 'Careers', 'Blog', 'Press', 'Collection'].map((item) => (
                  <li key={item}>
                    <Link to={`/${item.replace(' ', '').toLowerCase()}`} className="text-gray-500 hover:text-secondary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 GlamsCloset. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-secondary text-sm">Terms</Link>
            <Link to="/privacy" className="text-gray-500 hover:text-secondary text-sm">Privacy</Link>
            <Link to="/cookies" className="text-gray-500 hover:text-secondary text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
