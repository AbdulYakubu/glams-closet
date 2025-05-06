import React from 'react';

const Price = ({ originalPrice, discountedPrice, currency, className = '', size = 'base' }) => {
  const formatPrice = (price) => {
    try {
      if (typeof price === 'string') {
        const cleanPrice = price.replace(/^₵|^\$|^\€|^\£|[^\d.]/g, '');
        const numericPrice = parseFloat(cleanPrice);
        return isNaN(numericPrice) ? 0 : numericPrice;
      }
      return Number(price) || 0;
    } catch (error) {
      console.error("formatPrice error:", { price, error: error.message });
      return 0;
    }
  };

  const formattedOriginalPrice = formatPrice(originalPrice);
  const formattedDiscountedPrice = discountedPrice ? formatPrice(discountedPrice) : null;

  {/*console.log("Price rendering:", {
    originalPrice,
    formattedOriginalPrice,
    discountedPrice,
    formattedDiscountedPrice,
    currency,
  });*/}

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {formattedDiscountedPrice ? (
        <>
          <span className={`text-${size === 'lg' ? 'xl' : 'base'} font-bold text-gray-900 dark:text-white`}>
            {currency}{formattedDiscountedPrice.toFixed(2)}
          </span>
          <span className={`text-${size === 'lg' ? 'sm' : 'xs'} text-gray-500 dark:text-gray-400 line-through`}>
            {currency}{formattedOriginalPrice.toFixed(2)}
          </span>
        </>
      ) : (
        <span className={`text-${size === 'lg' ? 'xl' : 'base'} font-bold text-gray-900 dark:text-white`}>
          {currency}{formattedOriginalPrice.toFixed(2)}
        </span>
      )}
    </div>
  );
};

export default Price;