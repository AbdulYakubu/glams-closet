import React from 'react';
import { motion } from 'framer-motion';
import Title from './Title';
import { blogs } from '../assets/assets/data';
import { FiArrowRight } from 'react-icons/fi';

const Blog = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

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
  };

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      <Title
        title1={'Our Expert'}
        title2={'Blog'}
        titleStyles={'mb-12'}
        paraStyles={'text-gray-600 max-w-2xl mx-auto'}
        subtitle="Insights and trends from our industry experts"
      />
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className='grid xs:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        {blogs.map((blog) => (
          <motion.div 
            key={blog.title}
            variants={item}
            whileHover={{ y: -5 }}
            className='rounded-xl overflow-hidden shadow-md bg-white group'
          >
            <div className='relative aspect-[4/3] overflow-hidden'>
              <motion.img 
                src={blog.image} 
                alt={blog.title}
                className='w-full h-full object-cover'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              {/* Category Badge */}
              <div className='absolute top-4 left-4 bg-white/90 text-gray-900 text-xs font-medium px-3 py-1 rounded-full'>
                {blog.category}
              </div>
            </div>
            
            {/* Blog Content */}
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-2 line-clamp-2'>
                {blog.title}
              </h3>
              <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                {blog.excerpt || "Read our latest insights and industry trends..."}
              </p>
              
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <img 
                    src={blog.authorImage || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                    alt={blog.author}
                    className='w-8 h-8 rounded-full mr-2'
                  />
                  <span className='text-sm text-gray-600'>{blog.author || "Admin"}</span>
                </div>
                
                <motion.button
                  whileHover={{ x: 3 }}
                  className='text-secondary font-medium text-sm flex items-center gap-1'
                >
                  Read more
                  <FiArrowRight className='transition-transform group-hover:translate-x-1' />
                </motion.button>
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-100 flex items-center justify-between'>
                <span className='text-xs text-gray-500'>
                  {blog.date || new Date().toLocaleDateString()}
                </span>
                <span className='text-xs text-gray-500'>
                  {blog.readTime || '5 min read'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Blog;