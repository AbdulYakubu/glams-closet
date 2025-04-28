import React, { useContext, useEffect, useState } from 'react';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { TbArrowBackUp, TbTruckDelivery } from 'react-icons/tb';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import Title from './Title'; // Adjust path if needed (e.g., '../components/Title')

const defaultFeatures = [
  {
    icon: <TbArrowBackUp className="text-2xl text-indigo-600 dark:text-indigo-400" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Change your mind? We'll make it right.",
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    link: "/returns"
  },
  {
    icon: <TbTruckDelivery className="text-2xl text-indigo-600 dark:text-indigo-400" />,
    title: "Fast Delivery",
    description: "Express shipping available. Most orders delivered within 2-3 business days.",
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    link: "/shipping"
  },
  {
    icon: <RiSecurePaymentLine className="text-2xl text-indigo-600 dark:text-indigo-400" />,
    title: "Secure Payment",
    description: "Industry-standard encryption protects all transactions. Shop with confidence.",
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    link: "/security"
  }
];

const ProductFeatures = ({ product = {} }) => {
  const { features: contextFeatures } = useContext(ShopContext); // Assume features in ShopContext
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use product.features if available, else contextFeatures, else defaultFeatures
    const selectedFeatures = product.features || contextFeatures || defaultFeatures;
    setFeatures(selectedFeatures);
    setIsLoading(false);
  }, [product.features, contextFeatures]);

  const handleFeatureClick = (title) => {
    toast.success(`Learn more about ${title} for ${product.name || 'your shopping experience'}`);
  };

  // Skeleton animation
  const skeletonItem = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: [0.3, 0.6, 0.3],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        delay: i * 0.1
      }
    })
  };

  return (
    <section className="py-12 bg-primary dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="mb-10 text-center">
          <Title
            title1="Why Shop"
            title2="With Us"
            titleStyles="mb-6 text-gray-900 dark:text-white"
            title1Styles="text-gray-900 dark:text-white"
            paraStyles="text-gray-600 dark:text-gray-300"
            subtitle="Enjoy a seamless shopping experience with our top-tier service guarantees."
          />
        </div>

        {/* Features Grid */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            role="region"
            aria-label="Loading shopping benefits"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                custom={i}
                variants={skeletonItem}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
                style={{ height: '120px' }}
                aria-hidden="true"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            role="region"
            aria-label="Shopping benefits"
          >
            {features.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                whileFocus={{ y: -5 }}
                className={`${item.color} p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gradient-to-r from-indigo-50 to-indigo-100 dark:hover:bg-gradient-to-r dark:from-indigo-900/20 dark:to-indigo-900/30 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400`}
                role="button"
                tabIndex={0}
                aria-label={`Learn about ${item.title}`}
                onClick={() => handleFeatureClick(item.title)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFeatureClick(item.title)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-xs">
                    {React.cloneElement(item.icon, { 'aria-hidden': true })}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                        aria-label={`Learn more about ${item.title}`}
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductFeatures;