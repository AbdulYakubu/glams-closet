import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import banner from '../assets/assets/banner.png';

const Banner = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      variants={container}
      viewport={{ once: true, margin: "-100px" }}
      className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900'
    >
      <div className='flex flex-col xs:flex-row bg-white dark:bg-gray-900 dark:text-white rounded-3xl overflow-hidden shadow-lg'>
        {/* Left Side */}
        <motion.div 
          variants={item}
          className='xs:flex-1 px-6 py-8 xl:px-12 flex flex-col justify-center order-2 xs:order-1'
        >
          <motion.h2 
            variants={item}
            className='text-3xl md:text-4xl xl:text-5xl font-bold uppercase leading-tight tracking-tight text-gray-900'
          >
            Affordable Style, Timeless Appeal
          </motion.h2>
          <motion.h3 
            variants={item}
            className='text-xl md:text-2xl font-medium uppercase mt-2 text-gray-600'
          >
            Transform Your Closet Today
          </motion.h3>
          <motion.div variants={item} className='mt-6'>
            <Link 
              to={'/collection'} 
              className='inline-flex items-center bg-secondary text-white font-medium rounded-full px-6 py-3 transition-all duration-300 group'
            >
              <span className='mr-2'>Explore Collection</span>
              <FaArrowRight className='bg-white text-tertiary rounded-full h-8 w-8 p-2 group-hover:translate-x-1 transition-transform duration-300'/>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Side */}
        <motion.div 
          variants={item}
          className='lg:flex-1 order-1 lg:order-2'
        >
          <img 
            src={banner} 
            alt='Fashion collection banner' 
            className='w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover lg:rounded-tl-none lg:rounded-bl-3xl'
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Banner;