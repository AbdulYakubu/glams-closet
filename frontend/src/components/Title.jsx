import React from 'react'
import { motion } from 'framer-motion'

const Title = ({ 
  title1, 
  title2, 
  titleStyles = '', 
  title1Styles = '', 
  paraStyles = '',
  subtitle = 'Discover the best deals on top-quality products, crafted to elevate your everyday experience.'
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${titleStyles} mb-8 max-w-3xl`}
    >
      <motion.h3 
        className={`${title1Styles} text-3xl md:text-4xl  tracking-tight text-gray-900 font-bold`}
      >
        {title1}
        <motion.span 
          className="text-secondary  font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {' '}{title2}
        </motion.span>
      </motion.h3>
      
      <motion.p
        className={`${paraStyles} mt-4 text-lg text-gray-600 leading-relaxed `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {subtitle}
      </motion.p>
      
      <motion.div 
        className="h-px bg-gray-200 mt-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
    </motion.div>
  )
}

export default Title