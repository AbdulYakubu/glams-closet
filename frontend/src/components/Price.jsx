import React from 'react';

const Price = ({ originalPrice, discountedPrice, currency, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {discountedPrice ? (
        <>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {currency}{discountedPrice}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
            {currency}{originalPrice}
          </span>
        </>
      ) : (
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {currency}{originalPrice}
        </span>
      )}
    </div>
  );
};

export default Price;