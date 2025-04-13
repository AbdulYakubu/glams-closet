import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TbShoppingBagPlus } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Title from './Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const NewArrivals = () => {
  const { 
    products, 
    loading,
    addToCart,
    updateWishlist,
    wishlistItems,
    currency
  } = useContext(ShopContext);
  
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (products.length > 0 && !loading) {
      const sortedProducts = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setNewArrivals(sortedProducts);
    }
  }, [products, loading]);

  const handleAddToCart = (product) => {
    if (product.sizes && product.sizes.length > 0) {
      // For products with sizes, navigate to product page
      return;
    }
    // For products without sizes, add directly to cart with default quantity
    addToCart(product._id, 'one-size');
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (productId) => {
    updateWishlist(productId);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      variants={container}
      viewport={{ once: true }}
      className="py-16 bg-primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title 
          title1="New"
          title2="Arrivals"
          titleStyles="mb-12 text-white"
          subtitle="Discover our latest products"
          paraStyles="text-gray-200"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-secondary-light rounded-xl h-96"
              />
            ))}
          </div>
        ) : (
          <motion.div variants={item}>
            <Swiper
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1280: { slidesPerView: 5, spaceBetween: 30 }
              }}
              modules={[Autoplay, Pagination, Navigation]}
              className="h-full pb-12 relative group"
            >
              {newArrivals.map((product) => (
                <SwiperSlide key={product._id}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="px-2 py-4 bg-white rounded-lg shadow-md h-full flex flex-col"
                  >
                    {/* Product Image */}
                    <div className="relative flex-1 mb-4 overflow-hidden rounded-t-lg">
                      <Link to={`/product/${product._id}`}>
                        <img 
                          src={product.image[0]} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <button 
                        onClick={() => handleWishlistToggle(product._id)}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                          isInWishlist(product._id) 
                            ? 'text-red-500 bg-white/90' 
                            : 'text-gray-400 bg-white/80 hover:text-red-500'
                        }`}
                      >
                        {isInWishlist(product._id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex-1 flex flex-col">
                      <Link to={`/product/${product._id}`} className="hover:underline">
                        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-3">{product.description.substring(0, 60)}...</p>
                      
                      {/* Show size info if product has sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-gray-500 mb-2">AVAILABLE SIZES</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                              <span
                                key={size}
                                className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-800"
                              >
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price and Add to Cart */}
                      <div className="mt-auto flex justify-between items-center">
                        <span className="font-bold text-gray-900">{currency}{product.price}</span>
                        {product.sizes && product.sizes.length > 0 ? (
                          <Link 
                            to={`/product/${product._id}`}
                            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                          >
                            Select Options
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                          >
                            <TbShoppingBagPlus />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}

                {/* Navigation Arrows 
              <div className="swiper-button-next text-white"></div>
                <div className="swiper-button-prev text-white"></div>
                */}
            </Swiper>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default NewArrivals;