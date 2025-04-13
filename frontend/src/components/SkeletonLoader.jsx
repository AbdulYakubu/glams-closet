
import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 w-full"></div>
      <div className="space-y-2">
        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;