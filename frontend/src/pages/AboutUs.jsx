import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHandsHelping, FaAward, FaShippingFast } from 'react-icons/fa';
import teamImage from '../assets/assets/testimonials/user1.png'; 
import storeImage from '../assets/assets/store.jpg'; 

const AboutUs = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mx-auto"
          >
            Celebrating modest fashion and empowering women through style
          </motion.p>
        </div>
        <div className="absolute inset-0 bg-indigo-900 opacity-20"></div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid xs:grid-cols-3 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Founded in 2020, Glam Closet began as a small boutique in Koforidua with a passion for bringing elegant, modest fashion to modern women. 
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                What started as a humble storefront has blossomed into Ghana's premier destination for contemporary Islamic fashion, serving customers across West Africa and beyond.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Today, we're proud to offer a carefully curated collection that blends tradition with contemporary style, helping women express their faith and fashion with confidence.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={storeImage} 
                alt="Glam Closet store" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-primary dark:bg-gray-800 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do at Glam Closet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 xs:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLeaf className="text-4xl mb-4 text-green-500" />,
                title: "Quality Craftsmanship",
                description: "We source only the finest fabrics and work with skilled artisans to create durable, beautiful garments."
              },
              {
                icon: <FaHandsHelping className="text-4xl mb-4 text-indigo-500" />,
                title: "Community Focus",
                description: "We support local designers and give back to women's education initiatives."
              },
              {
                icon: <FaAward className="text-4xl mb-4 text-yellow-500" />,
                title: "Authenticity",
                description: "Every piece reflects genuine Islamic fashion principles while embracing modern trends."
              },
              {
                icon: <FaShippingFast className="text-4xl mb-4 text-purple-500" />,
                title: "Customer Joy",
                description: "From easy returns to personal styling advice, your satisfaction is our priority."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md text-center"
              >
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid xs:grid-cols-3 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 md:order-1 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={teamImage} 
                alt="Glam Closet team" 
                className="w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Meet Our Family</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Behind Glam Closet is a team of passionate designers, stylists, and customer service experts dedicated to making your shopping experience exceptional.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Led by founder Aisha Mohammed, our all-female team understands the unique needs of modest fashion shoppers because we are modest fashion shoppers ourselves.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We're not just a store - we're a community of women supporting each other to look and feel our best while staying true to our values.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-secondary dark:bg-indigo-800 text-white text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Glam Closet?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust us for their modest fashion needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow-lg"
              >
                Shop New Arrivals
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold"
              >
                Contact Our Stylists
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;