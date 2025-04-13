

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { TbShoppingBagPlus } from 'react-icons/tb';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import {Link } from 'react-router-dom'

const PopularProducts = () => {
  const { 
    products, 
    addToCart, 
    updateWishlist, 
    wishlistItems,
    currency,
    loading: contextLoading 
  } = useContext(ShopContext);
  
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const isLoading = contextLoading || products.length === 0;

  useEffect(() => {
    if (!contextLoading && products.length > 0) {
      const popular = products
        .filter(item => item.popular)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);
      setPopularProducts(popular);
    }
  }, [products, contextLoading]);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (productId) => {
    const size = selectedSizes[productId];
    if (size) {
      addToCart(productId, size);
    } else {
      // For products without sizes, add with default size
      if (popularProducts.find(p => p._id === productId)?.sizes?.length === 0) {
        addToCart(productId, 'one-size');
      } else {
        alert('Please select a size before adding to cart');
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="py-16 bg-primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title 
          title1="Popular"
          title2="Products"
          titleStyles="mb-12 text-white"
          paraStyles="text-gray-200"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1.5,
                  delay: i * 0.1
                }}
                className="bg-secondary-light rounded-xl h-[400px]"
              />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xs:grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {popularProducts.map((product) => (
              <motion.div 
                key={product._id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <motion.img 
                      src={product.image[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                  <button 
                    onClick={() => updateWishlist(product._id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isInWishlist(product._id) 
                        ? 'text-red-500 bg-white/90 shadow-sm' 
                        : 'text-gray-400 bg-white/80 hover:text-red-500 shadow-sm'
                    }`}
                  >
                    {isInWishlist(product._id) ? (
                      <FaHeart className="text-lg" />
                    ) : (
                      <FaRegHeart className="text-lg" />
                    )}
                  </button>
                  {product.popular && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      Popular
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`} className="hover:underline">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                  </div>
                  
                  {/* Size Selection - Only show if product has sizes */}
                  {product.sizes?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">SIZE</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <motion.button
                            key={size}
                            onClick={() => handleSizeSelect(product._id, size)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-2 py-1 text-xs rounded-md ${
                              selectedSizes[product._id] === size
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      {currency}{product.price.toFixed(2)}
                    </span>
                    <motion.button
                      onClick={() => handleAddToCart(product._id)}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-md"
                    >
                      <TbShoppingBagPlus className="text-lg" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default PopularProducts;