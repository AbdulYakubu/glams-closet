import React from 'react';

const ColorSelector = ({ colors, selectedColor, onSelectColor, className = '' }) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">COLOR</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color
                ? 'border-gray-900 dark:border-gray-300'
                : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;