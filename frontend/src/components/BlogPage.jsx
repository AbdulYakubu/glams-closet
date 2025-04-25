import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder images (replace with actual assets)
import blogImage1 from '../assets/assets/blogs/blog1.png';
import blogImage2 from '../assets/assets/blogs/blog2.png';
import blogImage3 from '../assets/assets/blogs/blog3.png';

const BlogPage = () => {
  const lastUpdated = 'April 25, 2025';
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sample blog posts (replace with API data)
  const blogPosts = [
    {
      id: '1',
      category: 'Styling Tips',
      title: 'How to Style a Hijab for Work',
      excerpt: 'Discover professional and chic ways to style your hijab for the workplace, combining modesty with modern flair.',
      image: blogImage1,
      date: 'April 20, 2025',
    },
    {
      id: '2',
      category: 'Fashion Trends',
      title: 'Top Modest Fashion Trends for 2025',
      excerpt: 'Explore the latest trends in modest fashion, from vibrant colors to elegant silhouettes.',
      image: blogImage2,
      date: 'April 15, 2025',
    },
    {
      id: '3',
      category: 'Brand Stories',
      title: 'GlamsCloset’s Journey in Ghana',
      excerpt: 'Learn about our roots in Koforidua and our mission to empower women through modest fashion.',
      image: blogImage3,
      date: 'April 10, 2025',
    },
  ];

  const categories = ['all', 'Styling Tips', 'Fashion Trends', 'Brand Stories'];

  const filteredPosts = activeCategory === 'all'
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  const blogSections = [
    {
      id: 'introduction',
      title: 'Welcome to Our Blog',
      content:
        'The GlamsCloset Blog is your go-to resource for modest fashion inspiration, styling tips, and updates about our brand. Whether you’re looking to elevate your wardrobe or learn about our journey, we’re here to inspire and empower. For more about us, visit our <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our About Us page">About Us</Link> page.',
    },
    {
      id: 'styling-tips',
      title: 'Styling Tips',
      content: 'Find creative ways to style your modest outfits for any occasion, from work to celebrations.',
    },
    {
      id: 'fashion-trends',
      title: 'Fashion Trends',
      content: 'Stay updated on the latest trends in modest fashion, curated for our West African audience.',
    },
    {
      id: 'brand-stories',
      title: 'Brand Stories',
      content: 'Dive into the heart of GlamsCloset with stories about our mission, community, and growth.',
    },
  ];

  return (
    <div className="min-h-screen bg-primary dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 sm:px-8 sm:py-12 max-w-7xl">
        <motion.h2
          className="text-4xl font-serif font-bold text-gray-800 dark:text-gray-100 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          GlamsCloset Blog
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Last Updated: {lastUpdated}
        </motion.p>

        {/* Table of Contents */}
        <motion.div
          className="mb-12 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Blog Categories</h3>
          <ul className="space-y-2">
            {blogSections.map((section) => (
              <li key={section.id}>
                <motion.a
                  href={`#${section.id}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {section.title}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="mb-12 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeCategory === category
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Filter by ${category} category`}
            >
              {category === 'all' ? 'All Posts' : category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts */}
        <motion.section
          id="blog-posts"
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Recent Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xs:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img
                    src={post.image}
                    alt={`Thumbnail for blog post: ${post.title}`}
                    className="w-full h-48 object-cover border-b border-gray-200 dark:border-gray-600"
                  />
                  <div className="p-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-2">{post.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block"
                      aria-label={`Read more about ${post.title}`}
                    >
                      Read More
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Need Help?</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            For questions or support, visit our{' '}
            <Link to="/help" className="text-blue-600 dark:text-blue-400 hover:underline" aria-label="Visit our Help Center">
              Help Center
            </Link>{' '}
            or contact us at{' '}
            <a
              href="mailto:support@glamscloset.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Email GlamsCloset Support"
            >
              support@glamscloset.com
            </a>{' '}
            or{' '}
            <a
              href="tel:+233542271847"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Call GlamsCloset Support"
            >
              +233 542 271 847
            </a>.
          </p>
        </motion.section>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-blue-600 dark:bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              aria-label="Scroll to top"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPage;