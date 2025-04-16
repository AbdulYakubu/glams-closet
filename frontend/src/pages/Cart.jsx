import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { RiShoppingBagLine } from "react-icons/ri";
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

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      const initialQuantities = {};

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
            initialQuantities[`${items}-${item}`] = cartItems[items][item];
          }
        }
      }

      setCartData(tempData);
      setQuantities(initialQuantities);
    }
  }, [cartItems, products]);

  const increment = (id, size) => {
    const key = `${id}-${size}`;
    const newValue = (quantities[key] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [key]: newValue }));
    updateQuantity(id, size, newValue);
  };

  const decrement = (id, size) => {
    const key = `${id}-${size}`;
    if (quantities[key] > 1) {
      const newValue = quantities[key] - 1;
      setQuantities((prev) => ({ ...prev, [key]: newValue }));
      updateQuantity(id, size, newValue);
    }
  };

  const removeItem = (id, size) => {
    setIsRemoving(true);
    setTimeout(() => {
      updateQuantity(id, size, 0);
      setIsRemoving(false);
    }, 300);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-primary pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xs:px-8 py-12">
        {/* Title */}
        <div className="flex items-center gap-x-4 mb-8">
          <Title 
            title1="Your" 
            title2="Cart" 
            title1Styles="text-3xl font-light" 
            title2Styles="text-3xl font-semibold"
          />
          <span className="text-gray-500 text-lg">
            ({getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'})
          </span>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          {/* Cart Items */}
          <div className="xs:col-span-2">
            {cartData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-50"
              >
                <RiShoppingBagLine className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <button
                  onClick={() => navigate('/collection')}
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Continue Shopping
                </button>
              </motion.div>
            ) : (
              <AnimatePresence>
                {cartData.map((item, i) => {
                  const productData = products.find(
                    (product) => product._id === item._id
                  );

                  if (!productData) return null;

                  const key = `${item._id}-${item.size}`;
                  const itemTotal = productData.price * (quantities[key] || 1);

                  return (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-white rounded-xl shadow-sm p-4 mb-4 hover:shadow-md transition-shadow border border-gray-20"
                    >
                      <div className="flex gap-4 items-start ">
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
                              <h3 className="font-medium text-gray-900 line-clamp-1">
                                {productData.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item._id, item.size)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              disabled={isRemoving}
                            >
                              <FiTrash2 />
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center border rounded-lg overflow-hidden">
                              <button
                                onClick={() => decrement(item._id, item.size)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                disabled={quantities[key] <= 1}
                              >
                                <FiMinus />
                              </button>
                              <span className="px-4 text-gray-800">
                                {quantities[key] || 1}
                              </span>
                              <button
                                onClick={() => increment(item._id, item.size)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <FiPlus />
                              </button>
                            </div>
                            <span className="font-medium text-gray-900">
                              {currency}{itemTotal.toFixed(2)}
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
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 ">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h3>
                
                <CartTotal />
                
                <button
                  onClick={() => navigate("/place-order")}
                  className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors mt-6"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/collection")}
                  className="w-full mt-4 text-primary border border-primary py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
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