import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Title from './Title'; // Adjust path if needed (e.g., '../components/Title')

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'care', label: 'Care Guide' },
  { id: 'size', label: 'Size Guide' }
];

const ProductDescription = ({ product = {} }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabContent = {
    description: (
      <>
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Product Details</h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            {product.description ? (
              <p>{product.description}</p>
            ) : (
              <>
                <p>
                  Crafted with premium materials for exceptional quality and comfort. This product features
                  meticulous attention to detail in every stitch.
                </p>
                <p>
                  The elegant design combines timeless style with modern functionality, making it suitable
                  for both casual and formal occasions.
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Key Benefits</h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>High-quality materials ensure long-lasting durability and comfort</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Designed to meet the needs of modern, active lifestyles</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Available in a wide range of sizes and on-trend colors</span>
            </li>
          </ul>
        </div>
      </>
    ),
    care: (
      <div className="text-gray-700 dark:text-gray-300 space-y-4">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Care Instructions</h3>
        <p>
          {product.careInstructions
            ? 'Follow these care guidelines to maintain your product:'
            : 'To maintain the quality and appearance of your product, please follow these care guidelines:'}
        </p>
        <ul className="space-y-2">
          {(product.careInstructions || [
            'Machine wash cold with similar colors',
            'Use mild detergent and avoid bleach',
            'Tumble dry low or lay flat to dry',
            'Iron on low heat if needed'
          ]).map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    size: (
      <div className="text-gray-700 dark:text-gray-300 space-y-4">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Size Guide</h3>
        <p>For the perfect fit, please refer to our sizing chart:</p>
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-collapse"
            aria-label={`Size guide for ${product.name || 'product'}`}
          >
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th scope="col" className="text-left py-2 px-4 text-gray-900 dark:text-white">
                  Size
                </th>
                <th scope="col" className="text-left py-2 px-4 text-gray-900 dark:text-white">
                  Chest (in)
                </th>
                <th scope="col" className="text-left py-2 px-4 text-gray-900 dark:text-white">
                  Length (in)
                </th>
                <th scope="col" className="text-left py-2 px-4 text-gray-900 dark:text-white">
                  Sleeve (in)
                </th>
              </tr>
            </thead>
            <tbody>
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size, index) => (
                <tr key={size} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-4">{size}</td>
                  <td className="py-2 px-4">{product.sizeGuide?.[size]?.chest || 36 + index * 2}</td>
                  <td className="py-2 px-4">
                    {product.sizeGuide?.[size]?.length || (27 + index * 0.5).toFixed(1)}
                  </td>
                  <td className="py-2 px-4">
                    {product.sizeGuide?.[size]?.sleeve || (24 + index * 0.5).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    toast.success(`Viewing ${tabs.find(t => t.id === tabId).label} for ${product.name || 'product'}`);
  };

  return (
    <section className="bg-white dark:bg-gray-900 px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Title Component */}
        <div className="p-6">
          <Title
            title1="Product"
            title2="Details"
            titleStyles="text-center mb-8 text-gray-900 dark:text-white"
            title1Styles="text-gray-900 dark:text-white"
            paraStyles="text-gray-600 dark:text-gray-300"
            subtitle="Learn more about the product details, care instructions, and sizing information."
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTabChange(tab.id);
                } else if (e.key === 'ArrowRight') {
                  const nextTab = tabs[index + 1] || tabs[0];
                  handleTabChange(nextTab.id);
                } else if (e.key === 'ArrowLeft') {
                  const prevTab = tabs[index - 1] || tabs[tabs.length - 1];
                  handleTabChange(prevTab.id);
                }
              }}
              className={`relative px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {tabContent[activeTab]}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProductDescription;