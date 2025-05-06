import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Item from './Item'; // Adjust path if needed (e.g., '../components/Item')
import Title from './Title'; // Adjust path if needed (e.g., '../components/Title')
import { FiAlertCircle } from 'react-icons/fi';

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      if (!Array.isArray(products)) {
        throw new Error('Products is not an array');
      }
      setIsLoading(true);
      let filtered = products
        .filter(item => item.category === category && item.subCategory === subCategory)
        .sort(() => Math.random() - 0.5) // Randomize for variety
        .slice(0, 5);

      // Fallback: Same category if no subCategory matches
      if (filtered.length === 0) {
        filtered = products
          .filter(item => item.category === category)
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
      }

      setRelated(filtered);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      console.error('Error filtering related products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [products, category, subCategory]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const skeletonItem = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: [0.3, 0.6, 0.3],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1.5,
        delay: i * 0.1
      }
    })
  };

  const handleItemClick = (productName) => {
    toast.success(`Viewing ${productName}`);
  };

  return (
    <section className="py-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <Title
              title1="Related"
              title2="Products"
              titleStyles="text-gray-900 dark:text-white text-2xl sm:text-3xl"
              paraStyles="text-gray-600 dark:text-gray-300 text-sm sm:text-base"
              subtitle="You might also like these similar items"
            />
            {related.length > 0 && (
              <Link
                to={`/collections/${category}`}
                className="mt-4 sm:mt-0 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                aria-label={`View all products in ${category}`}
              >
                View All
              </Link>
            )}
          </div>

          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center justify-center gap-3"
                role="alert"
                aria-label="Error loading related products"
              >
                <FiAlertCircle className="text-red-500 dark:text-red-400 text-xl" aria-hidden="true" />
                <p className="text-red-700 dark:text-red-300 text-sm">Failed to load related products. Please try again.</p>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-4 gap-4 sm:gap-6"
                role="region"
                aria-label="Loading related products"
              >
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    custom={i}
                    variants={skeletonItem}
                    className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
                    style={{ height: '280px' }}
                    aria-hidden="true"
                  />
                ))}
              </motion.div>
            ) : related.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-4 gap-4 sm:gap-6"
                role="region"
                aria-label="Related products"
              >
                {related.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
                    onClick={() => handleItemClick(product.name)}
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleItemClick(product.name)}
                    role="button"
                    aria-label={`View ${product.name}`}
                  >
                    <Item product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-600"
                role="alert"
                aria-label="No related products found"
              >
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">No related products found</p>
                <p className="text-sm text-gray-400 dark:text-gray-300 mt-2">
                  We couldn't find any products matching your criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;