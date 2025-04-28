
import React from 'react';

const LoadingSkeleton = ({ type = 'product-card' }) => {
  if (type === 'product-card') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl h-96 flex flex-col animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
        <div className="p-3 flex-1 flex flex-col gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="mt-4 h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }
  
  // Add other skeleton types as needed
  return null;
};

export default LoadingSkeleton;