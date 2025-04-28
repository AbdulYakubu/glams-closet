import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { FiTag, FiTruck, FiShield, FiGift, FiMapPin } from 'react-icons/fi';

const CartTotal = () => {
  const { 
    cartItems, 
    products, 
    delivery_charges,
    userLocation, // Should be provided by ShopContext (e.g., 'Local', 'Regional', 'International')
    shippingRates, // Should contain { freeThreshold: number, fee: number } by location
    currency
  } = useContext(ShopContext);

  // Debug re-renders
  useEffect(() => {
    console.log("CartTotal re-rendered");
  });

  // Validate shippingRates and userLocation
  const validatedShippingRates = shippingRates || {
    Local: { fee: delivery_charges || 10, freeThreshold: 500 },
    Regional: { fee: delivery_charges * 1.5 || 15, freeThreshold: 750 },
    International: { fee: delivery_charges * 3 || 30, freeThreshold: 1000 }
  };
  const validatedUserLocation = userLocation || 'Local';

  // Calculate cart subtotal and total items count
  const { cartAmount, totalItems } = Object.entries(cartItems || {}).reduce(
    (acc, [itemId, sizes]) => {
      const product = products.find((p) => p._id === itemId);
      if (!product) return acc;

      const itemData = Object.entries(sizes).reduce(
        (itemAcc, [size, quantity]) => {
          return {
            amount: itemAcc.amount + quantity * product.price,
            count: itemAcc.count + quantity,
          };
        },
        { amount: 0, count: 0 }
      );

      return {
        cartAmount: acc.cartAmount + itemData.amount,
        totalItems: acc.totalItems + itemData.count,
      };
    },
    { cartAmount: 0, totalItems: 0 }
  );

  // Get shipping info based on location
  const getShippingInfo = () => {
    const rates = validatedShippingRates[validatedUserLocation] || { 
      fee: delivery_charges || 10, 
      freeThreshold: 500 
    };
    
    const qualifiesForFreeShipping = cartAmount >= rates.freeThreshold;
    const shippingFee = qualifiesForFreeShipping ? 0 : rates.fee;
    
    return {
      fee: shippingFee,
      freeThreshold: rates.freeThreshold,
      qualifiesForFreeShipping,
      locationName: validatedUserLocation
    };
  };

  const shippingInfo = getShippingInfo();

  // Discount logic
  const discountThreshold = 6;
  const discountRate = 0.1; // 10% discount
  const discountApplicable = totalItems >= discountThreshold;
  const discountAmount = discountApplicable ? cartAmount * discountRate : 0;
  const subtotalAfterDiscount = cartAmount - discountAmount;
  const totalAmount = subtotalAfterDiscount + shippingInfo.fee;

  // Format currency
  const formatCurrency = (amount) =>
    `${currency}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
      role="region" 
      aria-labelledby="cart-total-title"
    >
      <Title 
        title1="Cart" 
        title2="Total" 
        title1Styles="text-3xl font-light text-gray-700 dark:text-gray-300"
        title2Styles="text-3xl font-semibold text-indigo-600 dark:text-indigo-400"
      />

      {/* Shipping Location Indicator */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4 text-sm border border-gray-200 dark:border-gray-700"
      >
        <FiMapPin className="text-indigo-500 dark:text-indigo-400" />
        <span className="text-gray-600 dark:text-gray-400">Shipping to: </span>
        <span className="font-medium capitalize text-gray-800 dark:text-gray-300">
          {shippingInfo.locationName.toLowerCase()}
        </span>
        {shippingInfo.locationName === 'International' && (
          <span 
            className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-0.5 rounded"
            aria-label="International shipping notice"
          >
            Customs may apply
          </span>
        )}
      </motion.div>

      {/* Special Offers Banner */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4 mb-6 border border-indigo-100 dark:border-indigo-700 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <FiTag className="text-indigo-600 dark:text-indigo-400 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-indigo-800 dark:text-indigo-300">Today's Special Offers</h4>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <span 
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-medium px-2 py-0.5 rounded mr-2"
                  aria-label="Discount deal badge"
                >
                  DEAL
                </span>
                {discountApplicable ? (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    You've unlocked {discountRate * 100}% discount! (-{formatCurrency(discountAmount)})
                  </span>
                ) : (
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Add {discountThreshold - totalItems} more item{discountThreshold - totalItems !== 1 ? 's' : ''} for {discountRate * 100}% off
                  </span>
                )}
              </li>
              <li className="flex items-start">
                <span 
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs font-medium px-2 py-0.5 rounded mr-2"
                  aria-label="Free shipping badge"
                >
                  FREE
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {shippingInfo.qualifiesForFreeShipping ? (
                    "You've qualified for free shipping!"
                  ) : (
                    `Spend ${formatCurrency(shippingInfo.freeThreshold - cartAmount)} more for free ${shippingInfo.locationName.toLowerCase()} shipping`
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Trust Badges */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-6 text-center border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col items-center justify-center p-2">
          <FiTruck className="text-indigo-500 dark:text-indigo-400 text-xl mb-1" />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
            {shippingInfo.locationName === 'Local' ? 'Same-day' : 'Fast'} Delivery
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {shippingInfo.locationName === 'Local' ? 'Within 24 hours' : 
             shippingInfo.locationName === 'Regional' ? '2-3 business days' : 
             '5-10 business days'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <FiShield className="text-indigo-500 dark:text-indigo-400 text-xl mb-1" />
          <span className="text-xs font-medium text-gray-800 dark:text-gray-300">Secure Checkout</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">256-bit encryption</span>
        </div>
      </motion.div>

      {/* Cart Summary */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
          <span className="font-medium text-gray-900 dark:text-gray-300">{formatCurrency(cartAmount)}</span>
        </div>

        {discountApplicable && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Bulk Discount ({discountRate * 100}% off)</span>
            <span className="font-medium">-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">
            Shipping ({shippingInfo.locationName.toLowerCase()})
          </span>
          <span className="font-medium">
            {shippingInfo.fee === 0 ? (
              <span className="text-green-600 dark:text-green-400">Free</span>
            ) : (
              formatCurrency(shippingInfo.fee)
            )}
          </span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-2">
          <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-gray-300">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </motion.div>

      {/* Shipping Progress Bar */}
      {cartAmount > 0 && !shippingInfo.qualifiesForFreeShipping && (
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>
              Add {formatCurrency(shippingInfo.freeThreshold - cartAmount)} more for free {shippingInfo.locationName.toLowerCase()} shipping
            </span>
            <span>
              {formatCurrency(cartAmount)}/{formatCurrency(shippingInfo.freeThreshold)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-indigo-500 dark:to-indigo-700 h-2 rounded-full"
              style={{
                width: `${Math.min(100, (cartAmount / shippingInfo.freeThreshold) * 100)}%`,
              }}
            ></div>
          </div>
        </motion.div>
      )}

      {/* Location Notice */}
      {shippingInfo.locationName === 'International' && (
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 text-xs text-gray-500 dark:text-gray-400"
        >
          <p>International orders may be subject to customs duties and taxes</p>
        </motion.div>
      )}
    </section>
  );
};

export default CartTotal;