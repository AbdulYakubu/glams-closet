import React, { useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShopContext } from '../context/ShopContext'
import Item from './Item'
import Title from './Title'
import { FiAlertCircle } from 'react-icons/fi'

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    try {
      if (products.length > 0) {
        setIsLoading(true)
        const filtered = products
          .filter(item => category === item.category)
          .filter(item => subCategory === item.subCategory)
          .slice(0, 5)
        
        setRelated(filtered)
        setHasError(false)
      }
    } catch (error) {
      setHasError(true)
      console.error("Error filtering related products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [products, category, subCategory])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  const skeletonItem = {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: [0.3, 0.6, 0.3],
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.5,
        delay: i * 0.1
      }
    })
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
          <Title 
            title1="Related"
            title2="Products"
            titleStyles="mb-8"
            paraStyles="text-gray-600"
            subtitle="You might also like these similar items"
          />

          <AnimatePresence mode="wait">
            {hasError ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center gap-3"
              >
                <FiAlertCircle className="text-red-500 text-xl" />
                <p className="text-red-700">Failed to load related products. Please try again.</p>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    custom={i}
                    variants={skeletonItem}
                    className="bg-gray-200 rounded-xl overflow-hidden"
                    style={{ height: '320px' }}
                  />
                ))}
              </motion.div>
            ) : related.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 xs:grid-cols-5 gap-6 "
              >
                {related.map((product) => (
                  <motion.div 
                    key={product._id} 
                    variants={item}
                    whileHover={{ y: -5 }}
                  >
                    <Item product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200"
              >
                <p className="text-gray-500 font-medium">No related products found</p>
                <p className="text-sm text-gray-400 mt-2">We couldn't find any products matching your criteria.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts