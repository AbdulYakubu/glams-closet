import React from "react";

const SizeSelector = ({ sizes, selectedSize, onSelectSize, className = "" }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Select Size
      </label>
      <div className="flex gap-2 flex-wrap">
        {sizes && sizes.length > 0 ? (
          sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              className={`px-4 py-1 rounded-md border transition-colors ${
                selectedSize === size
                  ? "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
              aria-label={`Select size ${size}`}
            >
              {size}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No sizes available
          </p>
        )}
      </div>
    </div>
  );
};

export default SizeSelector;