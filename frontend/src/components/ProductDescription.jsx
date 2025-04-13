import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Title from './Title' // adjust the path if needed

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'care', label: 'Care Guide' },
  { id: 'size', label: 'Size Guide' }
]

const tabContent = {
  description: (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            Crafted with premium materials for exceptional quality and comfort. Our product features
            meticulous attention to detail in every stitch.
          </p>
          <p>
            The elegant design combines timeless style with modern functionality, making it suitable
            for both casual and formal occasions.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Key Benefits</h3>
        <ul className="space-y-2 text-gray-700">
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
    <div className="text-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Care Instructions</h3>
      <p>To maintain the quality and appearance of your product, please follow these care guidelines:</p>
      <ul className="space-y-2">
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Machine wash cold with similar colors</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Use mild detergent and avoid bleach</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Tumble dry low or lay flat to dry</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2">•</span>
          <span>Iron on low heat if needed</span>
        </li>
      </ul>
    </div>
  ),
  size: (
    <div className="text-gray-700 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Size Guide</h3>
      <p>For the perfect fit, please refer to our sizing chart:</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-4">Size</th>
              <th className="text-left py-2 px-4">Chest (in)</th>
              <th className="text-left py-2 px-4">Length (in)</th>
              <th className="text-left py-2 px-4">Sleeve (in)</th>
            </tr>
          </thead>
          <tbody>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
              <tr key={size} className="border-b border-gray-100">
                <td className="py-2 px-4">{size}</td>
                <td className="py-2 px-4">{36 + index * 2}</td>
                <td className="py-2 px-4">{(27 + index * 0.5).toFixed(1)}</td>
                <td className="py-2 px-4">{(24 + index * 0.5).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ProductDescription = () => {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Title Component */}
      <div className="p-6">
        <Title
          title1="Product"
          title2="Details"
          titleStyles="text-center mb-8"
          title1Styles="text-gray-900"
          paraStyles="text-gray-600"
          subtitle="Learn more about the product details, care instructions, and sizing information."
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
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
      >
        {tabContent[activeTab]}
      </motion.div>
    </motion.div>
  )
}

export default ProductDescription