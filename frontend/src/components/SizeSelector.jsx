import React from 'react';

const SizeSelector = ({ sizes, selectedSize, onSelectSize, className = '' }) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SIZE</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              selectedSize === size
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-700 dark:border-gray-700'
                : 'bg-white text-gray-800 border-gray-300 hover:border-gray-900 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:border-gray-400'
            } transition-colors`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;