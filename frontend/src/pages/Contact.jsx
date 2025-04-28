import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTiktok  } from "react-icons/fa";
import Title from "../components/Title";

const Contact = () => {
  return (
    <section className="min-h-screen bg-primary py-16 text-gray-800 dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            title1="Get in"
            title2="Touch"
            title1Styles="text-3xl font-light"
            title2Styles="text-3xl font-semibold"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-4">
                <FiMapPin className="text-secondary" />
                <span>123 Chief Butcher, Koforidua, Ghana</span>
              </li>
              <li className="flex items-center gap-4">
                <FiPhone className="text-secondary" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4">
                <FiMail className="text-secondary" />
                <span>contact@glamcloset.com</span>
              </li>
            </ul>

            {/* Social Contacts */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition"
  >
    <FaFacebookF />
  </a>
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition"
  >
    <FaTwitter />
  </a>
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition"
  >
    <FaInstagram />
  </a>
  <a
    href="https://linkedin.com"
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition"
  >
    <FaLinkedinIn />
  </a>
  <a
    href="https://tiktok.com"
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white transition"
  >
    <FaTiktok />
  </a>
</div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              // handle submission logic
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Send Us a Message</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="subject" className="sr-only">Subject</label>
              <input
                id="subject"
                type="text"
                placeholder="Subject"
                required
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea
                id="message"
                placeholder="Your Message"
                rows="5"
                required
                className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition w-full md:w-auto"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
