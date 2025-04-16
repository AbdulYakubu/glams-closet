import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Title from "../components/Title";

const Contact = () => {
  return (
    <section className="min-h-screen bg-primary py-16">
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
            className="bg-white p-6 rounded-2xl shadow-md"
          >
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-4">
                <FiMapPin className="text-secondary" />
                <span>123 Your Street, Your City, Country</span>
              </li>
              <li className="flex items-center gap-4">
                <FiPhone className="text-secondary" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-4">
                <FiMail className="text-secondary" />
                <span>contact@yourstore.com</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-md space-y-4"
          >
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="input input-bordered w-full"
              required
            />
            <textarea
              placeholder="Message"
              rows="5"
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-gray-900 text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition"
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
