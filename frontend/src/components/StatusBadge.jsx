import React from "react";

const StatusBadge = ({ status }) => {
  // Define status styles with Tailwind classes
  const statusStyles = {
    Delivered: {
      bg: "bg-green-100 dark:bg-green-900/20",
      text: "text-green-700 dark:text-green-400",
      icon: "✅"
    },
    Shipped: {
      bg: "bg-blue-100 dark:bg-blue-900/20",
      text: "text-blue-700 dark:text-blue-400",
      icon: "🚚"
    },
    Packing: {
      bg: "bg-yellow-100 dark:bg-yellow-900/20",
      text: "text-yellow-700 dark:text-yellow-400",
      icon: "📦"
    },
    "Out for Delivery": {
      bg: "bg-orange-100 dark:bg-orange-900/20",
      text: "text-orange-700 dark:text-orange-400",
      icon: "🏍️"
    },
    default: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-700 dark:text-gray-300",
      icon: "🔄"
    }
  };

  // Get the styles for the current status or use default
  const currentStatus = statusStyles[status] || statusStyles.default;

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${currentStatus.bg} ${currentStatus.text}`}
    >
      <span className="mr-1.5" aria-hidden="true">
        {currentStatus.icon}
      </span>
      {status}
    </span>
  );
};

export default StatusBadge;