import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { RiShoppingBagLine } from "react-icons/ri";
import { toast } from "react-toastify";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    getCartCount,
    navigate,
    updateQuantity,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isRemoving, setIsRemoving] = useState(false);

  // Sync cartData and quantities with cartItems
  useEffect(() => {
    if (products.length > 0 && cartItems) {
      const tempData = [];
      const newQuantities = {};

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            tempData.push({
              _id: itemId,
              size,
              quantity: cartItems[itemId][size],
            });
            newQuantities[`${itemId}-${size}`] = cartItems[itemId][size];
          }
        }
      }

      setCartData(tempData);
      setQuantities(newQuantities);
    }
  }, [cartItems, products]);

  // Optional: Debug localStorage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "cart_items") {
        {/*console.log("Cart in localStorage updated:", e.newValue);*/ }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const getDisplaySize = (size) => {
    try {
      if (typeof size === "string" && size.startsWith("{")) {
        const parsed = JSON.parse(size);
        return parsed.size || parsed;
      }
      return size;
    } catch (e) {
      return size;
    }
  };

  const increment = (id, size) => {
    const key = `${id}-${size}`;
    const newValue = (quantities[key] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [key]: newValue }));
    try {
      updateQuantity(id, size, newValue);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      toast.error("Failed to update quantity");
      setQuantities((prev) => ({ ...prev, [key]: quantities[key] })); // Revert on error
    }
  };

  const decrement = (id, size) => {
    const key = `${id}-${size}`;
    if (quantities[key] > 1) {
      const newValue = quantities[key] - 1;
      setQuantities((prev) => ({ ...prev, [key]: newValue }));
      try {
        updateQuantity(id, size, newValue);
      } catch (error) {
        console.error("Error decrementing quantity:", error);
        toast.error("Failed to update quantity");
        setQuantities((prev) => ({ ...prev, [key]: quantities[key] })); // Revert on error
      }
    }
  };

  const removeItem = (id, size) => {
    setIsRemoving(true);
    const key = `${id}-${size}`;
    try {
      updateQuantity(id, size, 0);
      setQuantities((prev) => {
        const newQuantities = { ...prev };
        delete newQuantities[key];
        return newQuantities;
      });
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      setTimeout(() => setIsRemoving(false), 300);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-primary dark:bg-gray-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xs:px-8 py-12">
        {/* Title */}
        <div className="flex items-center gap-x-4 mb-8">
          <Title
            title1="Your"
            title2="Cart"
            title1Styles="text-3xl font-light text-gray-700 dark:text-gray-300"
            title2Styles="text-3xl font-semibold text-indigo-600 dark:text-indigo-400"
          />
          <span className="text-gray-500 dark:text-gray-400 text-lg">
            ({getCartCount()} {getCartCount() === 1 ? "Item" : "Items"})
          </span>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-8 ">
          {/* Cart Items */}
          <div className="xs:col-span-2">
            {cartData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700"
              >
                <RiShoppingBagLine className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <button
                  onClick={() => navigate("/collection")}
                  className="bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                  aria-label="Continue shopping"
                >
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                {cartData.map((item) => {
                  const productData = products.find(
                    (product) => product._id === item._id
                  );

                  if (!productData) return null;

                  const key = `${item._id}-${item.size}`;
                  const itemTotal = productData.price * (quantities[key] || 1);
                  const displaySize = getDisplaySize(item.size);

                  return (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex gap-4 items-start">
                        <motion.img
                          src={productData.image[0]}
                          alt={productData.name}
                          className="w-24 h-24 rounded-lg object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-gray-300 line-clamp-1">
                                {productData.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Size: {displaySize}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item._id, item.size)}
                              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              disabled={isRemoving}
                              aria-label={`Remove ${productData.name} size ${displaySize} from cart`}
                              role="button"
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border rounded-lg overflow-hidden border-gray-300 dark:border-gray-700">
                              <button
                                onClick={() => decrement(item._id, item.size)}
                                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                disabled={quantities[key] <= 1}
                                aria-label={`Decrease quantity of ${productData.name} size ${displaySize}`}
                                role="button"
                              >
                                <FiMinus />
                              </button>
                              <span className="px-4 text-gray-800 dark:text-gray-300">
                                {quantities[key] || 1}
                              </span>
                              <button
                                onClick={() => increment(item._id, item.size)}
                                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label={`Increase quantity of ${productData.name} size ${displaySize}`}
                                role="button"
                              >
                                <FiPlus />
                              </button>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-300">
                              {currency}
                              {itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Summary */}
          {cartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="xs:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300 mb-6">
                  Order Summary
                </h3>

                <CartTotal />

                <button
                  onClick={() => navigate("/place-order")}
                  className="w-full bg-indigo-600 dark:bg-indigo-700 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors mt-6"
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/collection")}
                  className="w-full mt-4 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 py-3 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  aria-label="Continue shopping"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;