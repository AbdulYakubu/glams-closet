import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import placeholderImage from '../assets/assets/placeholder.jpg'; 

const PopularProducts = () => {
  const { 
    products, 
    addToCart, 
    updateWishlist, 
    wishlistItems,
    currency,
    convertPrice,
    loading: contextLoading 
  } = useContext(ShopContext);
  
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const isLoading = contextLoading || products.length === 0;

  useEffect(() => {
    if (!contextLoading && products.length > 0) {
      const popular = products
        .filter(item => item.popular)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
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

  const handleAddToCart = (productId, productName) => {
    const size = selectedSizes[productId];
    if (size || popularProducts.find(p => p._id === productId)?.sizes?.length === 0) {
      addToCart(productId, size || 'one-size');
      toast.success(`${productName} added to cart!`);
    } else {
      toast.warning('Please select a size before adding to cart');
    }
  };

  const handleWishlistToggle = (productId, productName) => {
    updateWishlist(productId);
    const isAdded = wishlistItems.includes(productId);
    toast.success(isAdded ? 
      `${productName} removed from wishlist` : 
      `${productName} added to wishlist`
    );
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
    console.error(`Failed to load image for product ${productId}`);
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
      className="py-16 bg-primary dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Title 
          title1="Popular"
          title2="Products"
          titleStyles="mb-12 text-gray-900 dark:text-white"
          subtitle="Discover our top-rated items"
          paraStyles="text-gray-600 dark:text-gray-300"
        />

        {isLoading ? (
          <div className="grid xs:grid-cols-5 grid-cols-1 md:grid-cols-4  gap-6">
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
                className="bg-white dark:bg-gray-800 rounded-xl h-[300px] shadow-sm"
              />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xs:grid-cols-5 gap-6"
          >
            {popularProducts.map((product) => (
              <motion.div 
                key={product._id}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Link to={`/product/${product._id}`} aria-label={`View ${product.name}`}>
                    <motion.img 
                      src={imageErrors[product._id] ? placeholderImage : product.image[0]} 
                      alt={`Image of ${product.name}`}
                      className="w-full h-full object-contain"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      loading="lazy"
                      srcSet={`${product.image[0]} 1x, ${product.image[0]} 2x`}
                      sizes="(max-width: 640px) 100vw, 300px"
                      style={{ imageRendering: 'auto' }}
                      onError={() => handleImageError(product._id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300" />
                  </Link>
                  <button 
                    onClick={() => handleWishlistToggle(product._id, product.name)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                      isInWishlist(product._id) 
                        ? 'text-red-500 bg-white/90 dark:bg-gray-800/90 shadow-sm' 
                        : 'text-gray-400 bg-white/80 dark:bg-gray-800/80 hover:text-red-500 shadow-sm'
                    }`}
                    aria-label={isInWishlist(product._id) ? 
                      `Remove ${product.name} from wishlist` : 
                      `Add ${product.name} to wishlist`}
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
                  <Link to={`/product/${product._id}`} className="hover:underline" aria-label={`View ${product.name}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex text-amber-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviews || 0})</span>
                  </div>
                  
                  {/* Size Selection */}
                  {product.sizes?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">SIZE</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size) => (
                          <motion.button
                            key={size}
                            onClick={() => handleSizeSelect(product._id, size)}
                            whileTap={{ scale: 0.95 }}
                            className={`px-2 py-1 text-xs rounded-md ${
                              selectedSizes[product._id] === size
                                ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                    <span className="font-bold text-gray-900 dark:text-white">
                      {currency}{(product.price).toFixed(2)}
                    </span>
                    <motion.button
                      onClick={() => handleAddToCart(product._id, product.name)}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors shadow-md"
                      aria-label={`Add ${product.name} to cart`}
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