import React, { useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Thumbs } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaEye, FaTimes, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import Price from '../components/Price';
import SizeSelector from '../components/SizeSelector';
import ColorSelector from '../components/ColorSelector';
import LoadingSkeleton from '../components/LoadingSkeleton';

const NewArrivals = () => {
  const { 
    products, 
    loading,
    addToCart,
    updateWishlist,
    wishlistItems,
    currency,
    convertPrice
  } = useContext(ShopContext);
  
  const [newArrivals, setNewArrivals] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const sidebarRef = useRef(null);

  // Memoize sorted products to avoid re-computation
  const sortedProducts = useMemo(() => {
    if (products.length > 0 && !loading) {
      return [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 12);
    }
    return [];
  }, [products, loading]);

  useEffect(() => {
    try {
      setNewArrivals(sortedProducts);
    } catch (err) {
      setError('Failed to load new arrivals.');
      toast.error('Error loading new arrivals.');
      console.error('Error loading new arrivals:', err);
    }
  }, [sortedProducts]);

  // Handle Quick View
  const handleQuickView = useCallback((product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || null);
    setSelectedColor(product.colors?.[0] || null);
    setIsSidebarOpen(true);
  }, []);

  // Close sidebar
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setThumbsSwiper(null);
  }, []);

  // Close sidebar on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSidebar]);

  const handleAddToCart = useCallback(() => {
    if (!selectedProduct) return;
    
    if ((selectedProduct.sizes && !selectedSize) || (selectedProduct.colors && !selectedColor)) {
      toast.warning('Please select options before adding to cart');
      return;
    }

    const options = {
      size: selectedSize,
      color: selectedColor
    };

    addToCart(selectedProduct._id, options);
    toast.success(`${selectedProduct.name} added to cart!`);
    closeSidebar();
  }, [selectedProduct, selectedSize, selectedColor, addToCart, closeSidebar]);

  const handleWishlistToggle = useCallback((productId, productName) => {
    updateWishlist(productId);
    const isAdded = wishlistItems.includes(productId);
    toast.success(isAdded ? 
      `${productName} removed from wishlist` : 
      `${productName} added to wishlist`
    );
  }, [updateWishlist, wishlistItems]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  // Calculate average rating
  const calculateRating = (product) => {
    if (!product.ratings || product.ratings.length === 0) return 0;
    const sum = product.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sum / product.ratings.length;
  };

  // Render rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const sidebarVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '100%', transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      variants={containerVariants}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      className="py-16 bg-primary dark:bg-gray-900"
      id="new-arrivals"
    >
      <div className="max-full mx-auto px-4 sm:px-6 xs:px-8">
        <Title 
          title1="New"
          title2="Arrivals"
          titleStyles="mb-12 text-gray-900 dark:text-white"
          subtitle="Discover our latest products"
          paraStyles="text-gray-600 dark:text-gray-300"
        />

        {error && (
          <div className="text-center text-red-500 dark:text-red-400 py-8">
            {error} Please try again later.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xs:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <LoadingSkeleton key={i} type="product-card" />
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <Swiper
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                el: '.new-arrivals-pagination',
              }}
              navigation={{
                nextEl: '.new-arrivals-next',
                prevEl: '.new-arrivals-prev',
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1280: { slidesPerView: 5, spaceBetween: 30 }
              }}
              modules={[Autoplay, Pagination, Navigation]}
              className="h-full relative group"
            >
              {newArrivals.map((product) => {
                const rating = calculateRating(product);
                const discountedPrice = product.discountPrice ? convertPrice(product.discountPrice) : null;
                const originalPrice = convertPrice(product.price);
                
                return (
                  <SwiperSlide key={product._id}>
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="px-2 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md h-full flex flex-col transition-shadow duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative flex-1 mb-4 overflow-hidden rounded-t-lg group/image">
                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                            NEW
                          </span>
                        )}
                        {product.discountPrice && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                            SALE
                          </span>
                        )}
                        <Link 
                          to={`/product/${product._id}`} 
                          aria-label={`View ${product.name}`}
                          className="block h-full"
                        >
                          <img 
                            src={product.image[0]} 
                            alt={product.name} 
                            loading="lazy"
                            className="w-full h-48 sm:h-56 object-cover group-hover/image:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={() => handleWishlistToggle(product._id, product.name)}
                            className={`p-2 rounded-full transition-all ${
                              isInWishlist(product._id) 
                                ? 'text-red-500 bg-white/90 dark:bg-gray-800/90 shadow-sm' 
                                : 'text-gray-400 bg-white/80 dark:bg-gray-800/80 hover:text-red-500 shadow-sm'
                            }`}
                            aria-label={isInWishlist(product._id) ? 
                              `Remove ${product.name} from wishlist` : 
                              `Add ${product.name} to wishlist`}
                          >
                            {isInWishlist(product._id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          <button 
                            onClick={() => handleQuickView(product)}
                            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-blue-500 transition-all shadow-sm"
                            aria-label={`Quick view ${product.name}`}
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 flex-1 flex flex-col">
                        <Link 
                          to={`/product/${product._id}`} 
                          className="hover:underline mb-1"
                        >
                          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        
                        {/* Rating */}
                        {product.ratings && product.ratings.length > 0 && (
                          <div className="flex items-center mb-2">
                            <div className="flex mr-1">
                              {renderRatingStars(rating)}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ({product.ratings.length})
                            </span>
                          </div>
                        )}
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>
                        
                        {/* Price */}
                        <div className="mt-auto">
                          <Price 
                            originalPrice={originalPrice}
                            discountedPrice={discountedPrice}
                            currency={currency}
                            className="mb-3"
                          />
                          
                          {/* Add to Cart */}
                          <div className="flex justify-between items-center">
                            {product.sizes || product.colors ? (
                              <Link 
                                to={`/product/${product._id}`}
                                className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm w-full text-center"
                                aria-label={`Select options for ${product.name}`}
                              >
                                View Options
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  addToCart(product._id);
                                  toast.success(`${product.name} added to cart!`);
                                }}
                                className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm w-full"
                                aria-label={`Add ${product.name} to cart`}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                );
              })}
              <div className="new-arrivals-pagination mt-6"></div>
              <div className="new-arrivals-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="new-arrivals-next absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Swiper>
          </motion.div>
        )}

        {/* Quick View Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && selectedProduct && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40"
                onClick={closeSidebar}
                aria-hidden="true"
              />
              
              {/* Sidebar */}
              <motion.aside
                ref={sidebarRef}
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-y-0 right-0 w-4/5 max-w-sm sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="quick-view-title"
              >
                <div className="p-6 sm:p-8">
                  {/* Close Button */}
                  <button
                    onClick={closeSidebar}
                    className="absolute top-2 right-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    aria-label="Close quick view"
                  >
                    <FaTimes size={24} />
                  </button>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Product Images */}
                    <div>
                      <Swiper
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[Thumbs, Navigation]}
                        className="mb-4 rounded-lg overflow-hidden"
                      >
                        {selectedProduct.image.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={img}
                              alt={`${selectedProduct.name} ${index + 1}`}
                              className="w-full h-64 object-cover"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={8}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[Thumbs]}
                        className="thumbnail-slider"
                      >
                        {selectedProduct.image.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={img}
                              alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                              className="w-full h-16 object-cover cursor-pointer rounded border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* Product Details */}
                    <div>
                      <h2 
                        id="quick-view-title"
                        className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                      >
                        {selectedProduct.name}
                      </h2>
                      
                      {/* Rating */}
                      {selectedProduct.ratings && selectedProduct.ratings.length > 0 && (
                        <div className="flex items-center mb-4">
                          <div className="flex mr-2">
                            {renderRatingStars(calculateRating(selectedProduct))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({selectedProduct.ratings.length} reviews)
                          </span>
                          <Link 
                            to={`/product/${selectedProduct._id}#reviews`} 
                            className="text-sm text-blue-500 hover:underline ml-2"
                            onClick={closeSidebar}
                          >
                            View reviews
                          </Link>
                        </div>
                      )}
                      
                      {/* Price */}
                      <div className="mb-6">
                        <Price 
                          originalPrice={convertPrice(selectedProduct.price)}
                          discountedPrice={selectedProduct.discountPrice ? convertPrice(selectedProduct.discountPrice) : null}
                          currency={currency}
                          size="lg"
                        />
                        {selectedProduct.discountPrice && (
                          <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                            {Math.round(
                              ((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100
                            )}% OFF
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                        {selectedProduct.description}
                      </p>
                      
                      {/* Size Selector */}
                      {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                        <SizeSelector 
                          sizes={selectedProduct.sizes}
                          selectedSize={selectedSize}
                          onSelectSize={setSelectedSize}
                          className="mb-4"
                        />
                      )}
                      
                      {/* Color Selector */}
                      {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <ColorSelector 
                          colors={selectedProduct.colors}
                          selectedColor={selectedColor}
                          onSelectColor={setSelectedColor}
                          className="mb-6"
                        />
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 px-6 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
                          aria-label={`Add ${selectedProduct.name} to cart`}
                          disabled={
                            (selectedProduct.sizes && !selectedSize) || 
                            (selectedProduct.colors && !selectedColor)
                          }
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleWishlistToggle(selectedProduct._id, selectedProduct.name)}
                          className={`p-2 rounded-full transition-all ${
                            isInWishlist(selectedProduct._id)
                              ? 'text-red-500 bg-gray-100 dark:bg-gray-700'
                              : 'text-gray-400 bg-gray-100 dark:bg-gray-700 hover:text-red-500'
                          }`}
                          aria-label={
                            isInWishlist(selectedProduct._id)
                              ? `Remove ${selectedProduct.name} from wishlist`
                              : `Add ${selectedProduct.name} to wishlist`
                          }
                        >
                          {isInWishlist(selectedProduct._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                        </button>
                      </div>
                      
                      <Link
                        to={`/product/${selectedProduct._id}`}
                        className="inline-block mt-4 text-blue-500 hover:underline text-sm font-medium"
                        onClick={closeSidebar}
                      >
                        View full details →
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default NewArrivals;