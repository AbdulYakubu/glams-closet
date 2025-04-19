import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { RiHeartFill } from "react-icons/ri";
import Title from "../components/Title";
import EmptyState from "../components/EmptyState";

const Wishlist = () => {
  const { 
    wishlistItems, 
    products, 
    addToCart, 
    updateWishlist,
    currency
  } = useContext(ShopContext);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3 }
    }
  };

  // Move item to cart and remove from wishlist
  const moveToCart = (productId, size = "M") => {
    addToCart(productId, size);
    updateWishlist(productId);
    toast.success("Item moved to cart!");
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    updateWishlist(productId);
    toast.info("Item removed from wishlist");
  };

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Title 
            title1="Your" 
            title2="Wishlist" 
            title1Styles="text-3xl font-light text-gray-700" 
            title2Styles="text-3xl font-semibold text-gray-900"
          />
          {wishlistItems.length > 0 && (
            <p className="text-gray-600 mt-2">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </div>

        <AnimatePresence>
          {wishlistItems.length === 0 ? (
            <EmptyState
              icon={<FiTrash2 className="text-5xl text-gray-300" />}
              title="Your wishlist is empty"
              description="Items you save will appear here"
              buttonText="Continue Shopping"
              buttonIcon={<FiArrowRight className="ml-2" />}
              onButtonClick={() => window.location.href = '/collection'}
            />
          ) : (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 xs:grid-cols-4 gap-6"
              >
                {wishlistItems.map((itemId) => {
                  const product = products.find((p) => p._id === itemId);
                  if (!product) return null;

                  return (
                    <motion.div
                      key={product._id}
                      variants={item}
                      layout
                      exit="exit"
                      className="bg-primary rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="relative">
                        <img 
                          src={product.image[0]} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button
                            onClick={() => removeFromWishlist(product._id)}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-red-300 transition-colors"
                            aria-label="Remove from wishlist"
                            title="Remove from wishlist"
                          >
                            <FiTrash2 className="text-red-500" />
                          </button>
                          <button
                            onClick={() => moveToCart(product._id, product.sizes?.[0] || 'M')}
                            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            aria-label="Add to cart"
                            title="Add to cart"
                          >
                            <FiShoppingBag className="text-gray-700" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="flex justify-between items-center mt-4">
                          <span className="font-bold text-gray-900">
                            {currency}{product.price.toFixed(2)}
                          </span>
                          
                          <button
                            onClick={() => moveToCart(product._id, product.sizes?.[0] || 'M')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                          >
                            Add to cart <FiArrowRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              
              {wishlistItems.length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.location.href = '/collection'}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Continue Shopping <FiArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;