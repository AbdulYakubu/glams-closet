import React from "react";
import PropTypes from "prop-types";

const EmptyState = ({
  icon,
  title = "Nothing Here Yet",
  description = "Check back later or explore other sections.",
  buttonText = "Go Back",
  onButtonClick = () => window.history.back(),
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Icon Container */}
      <div className="mb-8 p-4 bg-gray-100 rounded-full">
        {React.cloneElement(icon, {
          className: `${icon.props.className} text-gray-400`,
        })}
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <button
        onClick={onButtonClick}
        className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
        aria-label={buttonText}
      >
        {buttonText}
      </button>
    </div>
  );
};

// Prop Types for better type checking and documentation
EmptyState.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

export default EmptyState;