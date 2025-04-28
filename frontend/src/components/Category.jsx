import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Abaaya from '../assets/assets/category/abaaya.webp';
import Hijab from '../assets/assets/category/hijab.jpg';
import Kids from '../assets/assets/category/kids.jpg';
import Perfumes from '../assets/assets/category/perfume.jpg';
import Bags from '../assets/assets/category/bags.jpg';
import Jalibab from '../assets/assets/category/jalibab.jpg';
import Wear from '../assets/assets/category/ready.jpg';
import Gift from '../assets/assets/category/gift.jpg';
import Viels from '../assets/assets/category/viels.jpg';
import Accessories from '../assets/assets/category/accessories.jpg';
import Title from "./Title";

const allCategories = [
  { name: "Abaaya", image: Abaaya, slug: "abayas", badge: "Popular" },
  { name: "Hijab & Khimar", image: Hijab, slug: "hijabs", badge: "New" },
  { name: "Kids", image: Kids, slug: "kids" },
  { name: "Perfumes and Self Care", image: Perfumes, slug: "perfumes" },
  { name: "Bags", image: Bags, slug: "bags", badge: "Trending" },
  { name: "Jalibab", image: Jalibab, slug: "jalibabs" },
  { name: "Ready to Wear", image: Wear, slug: "ready-to-wear" },
  { name: "Gift Packages", image: Gift, slug: "gifts", badge: "Special" },
  { name: "Veils", image: Viels, slug: "veils" },
  { name: "Hijab Accessories", image: Accessories, slug: "accessories" },
];

const badgeStyles = {
  Popular: "bg-rose-100 text-rose-600",
  New: "bg-emerald-100 text-emerald-600",
  Trending: "bg-amber-100 text-amber-600",
  Special: "bg-violet-100 text-violet-600",
};

const Categories = () => {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const displayedCategories = showAll ? allCategories : allCategories.slice(0, 6);

  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (categorySlug) => {
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/collection?category=${categorySlug}`);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="relative max-full mx-auto px-4 sm:px-6 py-16 overflow-hidden bg-white dark:bg-gray-900 text-gray-50 dark:text-white">
      {/* Background decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10 dark:text-white" />

      <div className="text-center mb-12 dark:text-white">
        <Title 
          title1="Explore Our" 
          title2="Categories" 
          title1Styles="text-4xl font-light text-gray-700 dark:text-white" 
          title2Styles="text-4xl font-bold text-gray-900 dark:text-white"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600  dark:text-white max-w-2xl mx-auto text-lg"
        >
          Discover our curated collection of premium modest wear and accessories
        </motion.p>
      </div>

      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/70 dark:bg-gray-900 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        </motion.div>
      )}

      <motion.div
        className="grid xs:grid-cols-5 grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {displayedCategories.map((cat) => (
            <motion.div
              key={cat.slug}
              variants={cardVariants}
              whileHover="hover"
              className="group relative"
              layout
            >
              <div
                onClick={() => handleCategoryClick(cat.slug)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                <div className="relative overflow-hidden h-48">
                  <motion.img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.15 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/20 transition-all duration-300" />
                  {cat.badge && (
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${badgeStyles[cat.badge]}`}>
                      {cat.badge}
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <motion.div
                    className="mt-3 text-sm text-indigo-600 font-medium flex items-center justify-center gap-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Shop Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {allCategories.length > 6 && (
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center mx-auto group"
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <motion.svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </>
            ) : (
              <>
                <span>View All Categories</span>
                <motion.svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute left-0 right-0 -bottom-20 h-48 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default Categories;