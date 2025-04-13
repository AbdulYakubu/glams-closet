import React from 'react';
import { motion } from 'framer-motion';
import Img1 from '../assets/assets/features/feature1.png';
import Img2 from '../assets/assets/features/feature2.png';
import { FaShieldAlt, FaShippingFast, FaAward } from 'react-icons/fa';
import Title from './Title';

const Features = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const featureItems = [
    {
      icon: <FaAward className="text-2xl text-amber-500" />,
      title: "Quality Product",
      description: "Premium materials and craftsmanship for lasting durability and satisfaction",
      color: "bg-amber-50"
    },
    {
      icon: <FaShippingFast className="text-2xl text-blue-500" />,
      title: "Fast Delivery",
      description: "Express shipping with real-time tracking for your convenience",
      color: "bg-blue-50"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-emerald-500" />,
      title: "Secure Payment",
      description: "Industry-standard encryption protects all your transactions",
      color: "bg-emerald-50"
    }
  ];

  return (
    
    <motion.section 
      initial="hidden"
      whileInView="show"
      variants={container}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
        <Title
        title1={'Our'}
        title2={'Features'}
        titleStyles={'mb-12'}
        paraStyles={'text-gray-600 max-w-2xl mx-auto'}
        subtitle="Insights and trends from our industry experts"
      />
        {/* Images Section */}
        <motion.div 
          variants={item}
          className="flex justify-center gap-8"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-2xl shadow-lg"
          >
            <img 
              src={Img1} 
              alt="Premium quality materials" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-medium">
              Craftsmanship
            </span>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-2xl shadow-lg mt-8"
          >
            <img 
              src={Img2} 
              alt="Fast delivery network" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-medium">
              Logistics
            </span>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -5 }}
              className={`${feature.color} p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-xs">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;