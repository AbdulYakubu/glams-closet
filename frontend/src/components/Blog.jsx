import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from './Title';
import { blogs } from '../assets/assets/data';
import { FiArrowRight } from 'react-icons/fi';
import placeholderImage from '../assets/assets/placeholder.jpg'; 
import placeholderAuthor from '../assets/assets/placeholder-author.jpg';

const Blog = () => {
  const [imageErrors, setImageErrors] = useState({});
  const [authorImageErrors, setAuthorImageErrors] = useState({});

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

  const handleImageError = (blogTitle) => {
    setImageErrors(prev => ({
      ...prev,
      [blogTitle]: true
    }));
    console.error(`Failed to load blog image for: ${blogTitle}`);
  };

  const handleAuthorImageError = (blogTitle) => {
    setAuthorImageErrors(prev => ({
      ...prev,
      [blogTitle]: true
    }));
    console.error(`Failed to load author image for: ${blogTitle}`);
  };

  const handleReadMore = (title) => {
    toast.success(`Opening blog: ${title}`);
  };

  return (
    <section className='max-full mx-auto px-4 sm:px-6 py-16 bg-white dark:bg-gray-900'>
      <Title
        title1={'Our Expert'}
        title2={'Blog'}
        titleStyles={'mb-12 text-gray-900 dark:text-white'}
        paraStyles={'text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'}
        subtitle="Insights and trends from our industry experts"
      />
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className='grid grid-cols-1 sm:grid-cols-3 xs:grid-cols-4 gap-6'
      >
        {blogs.map((blog) => (
          <motion.div 
            key={blog.title}
            variants={item}
            whileHover={{ y: -5 }}
            className='rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 group border border-gray-100 dark:border-gray-700'
          >
            <div className='relative aspect-[4/3] overflow-hidden'>
              <Link to={`/blog/${blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-')}`} aria-label={`Read blog post: ${blog.title}`}>
                <motion.img 
                  src={imageErrors[blog.title] ? placeholderImage : blog.image} 
                  alt={`Image for blog post: ${blog.title}`}
                  className='w-full h-full object-contain'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  loading="lazy"
                  srcSet={`${blog.image} 1x, ${blog.image} 2x`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  style={{ imageRendering: 'auto' }}
                  onError={() => handleImageError(blog.title)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-300" />
              </Link>
              {/* Category Badge */}
              <div className='absolute top-4 left-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 text-xs font-medium px-3 py-1 rounded-full'>
                {blog.category || 'General'}
              </div>
            </div>
            
            {/* Blog Content */}
            <div className='p-6'>
              <Link to={`/blog/${blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-')}`} className='hover:underline' aria-label={`Read blog post: ${blog.title}`}>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2'>
                  {blog.title}
                </h3>
              </Link>
              <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3'>
                {blog.excerpt || "Read our latest insights and industry trends..."}
              </p>
              
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <img 
                    src={authorImageErrors[blog.title] ? placeholderAuthor : (blog.authorImage || 'https://randomuser.me/api/portraits/men/1.jpg')} 
                    alt={`Author: ${blog.author || 'Admin'}`}
                    className='w-8 h-8 rounded-full mr-2'
                    loading="lazy"
                    onError={() => handleAuthorImageError(blog.title)}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-300'>{blog.author || "Admin"}</span>
                </div>
                
                <Link
                  to={`/blog/${blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleReadMore(blog.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleReadMore(blog.title)}
                  className='text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300'
                  aria-label={`Read more about ${blog.title}`}
                >
                  Read more
                  <FiArrowRight className='transition-transform group-hover:translate-x-1' />
                </Link>
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between'>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {blog.date || new Date().toLocaleDateString()}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
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