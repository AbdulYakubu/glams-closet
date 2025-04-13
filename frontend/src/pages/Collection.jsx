import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiSearch, FiFilter } from 'react-icons/fi';
import { TbLoader } from 'react-icons/tb';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import Item from '../components/Item';
import Footer from '../components/Footer';
import { ShopContext } from '../context/ShopContext';

// Constants for better maintainability
const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUB_CATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];
const SORT_OPTIONS = [
  { value: 'relevant', label: 'Recommended' },
  { value: 'Low', label: 'Price: Low to High' },
  { value: 'High', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Highest Rated' }
];
const ITEMS_PER_PAGE = 12;
const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 to $50', min: 25, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity }
];

// Animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  },
  filterPanel: {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    },
    exit: {
      x: -50,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },
  mobileFilterOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  mobileFilterPanel: {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  }
};

const Collection = () => {
  const { products = [], loading = false } = useContext(ShopContext);
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    priceRange: [],
    sort: 'relevant',
    page: 1,
    search: '',
    mobileFiltersOpen: false
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const controls = useAnimation();

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Process products to ensure they all have IDs and calculate average rating
  const processedProducts = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      id: product.id || `prod_${index}_${Date.now()}`,
      avgRating: product.reviews?.length > 0 
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
        : 0
    }));
  }, [products]);

  // Enhanced filter and sort logic
  const { filteredProducts, totalPages } = useMemo(() => {
    let filtered = [...processedProducts];

    // Apply search filter with debounce effect
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(p => 
        p.category && filters.category.some(cat => 
          p.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    // Apply subcategory filters
    if (filters.subCategory.length > 0) {
      filtered = filtered.filter(p => 
        p.subCategory && filters.subCategory.some(subCat => 
          p.subCategory.toLowerCase().includes(subCat.toLowerCase()))
      );
    }

    // Apply price range filters
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter(p => {
        return filters.priceRange.some(range => {
          const { min, max } = PRICE_RANGES.find(r => r.label === range) || {};
          return p.price >= min && p.price <= max;
        });
      });
    }

    // Enhanced sorting options
    switch (filters.sort) {
      case 'Low': 
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'High': 
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest': 
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        break;
      default:
        // Default sorting (relevant) with multiple factors
        filtered.sort((a, b) => {
          const popularityDiff = (b.popularity || 0) - (a.popularity || 0);
          if (popularityDiff !== 0) return popularityDiff;
          return (b.avgRating || 0) - (a.avgRating || 0);
        });
    }

    // Pagination with dynamic items per page
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return { 
      filteredProducts: paginated, 
      totalPages: total
    };
  }, [processedProducts, filters]);

  // Update filters with animation
  const updateFilter = useCallback((filterName, value) => {
    controls.start({ opacity: [1, 0.5, 1], transition: { duration: 0.3 } });
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      page: 1 // Reset to first page when filters change
    }));
  }, [controls]);

  // Toggle specific filter value with animation
  const toggleFilterValue = useCallback((filterName, value) => {
    controls.start({ scale: [1, 0.95, 1], transition: { duration: 0.2 } });
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value],
      page: 1
    }));
  }, [controls]);

  // Reset all filters with animation
  const resetFilters = useCallback(() => {
    controls.start("reset");
    setFilters({
      category: [],
      subCategory: [],
      priceRange: [],
      sort: 'relevant',
      page: 1,
      search: '',
      mobileFiltersOpen: false
    });
  }, [controls]);

  // Toggle mobile filters
  const toggleMobileFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      mobileFiltersOpen: !prev.mobileFiltersOpen
    }));
  }, []);

  // Loading state with enhanced animation
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col justify-center items-center min-h-screen"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
          className="mb-4"
        >
          <TbLoader className="text-5xl text-tertiary" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-lg text-gray-600"
        >
          Loading your collection...
        </motion.p>
      </motion.div>
    );
  }

  // Render star rating component
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-padd-container !px-0 relative"
    >
      {/* Sticky Filter Button for Mobile */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileFilters}
        className={`lg:hidden fixed z-30 bottom-6 right-6 p-4 rounded-full shadow-xl bg-tertiary text-white transition-all duration-300 ${
          isScrolled ? 'scale-90' : 'scale-100'
        }`}
        animate={{
          y: isScrolled ? 10 : 0,
          opacity: isScrolled ? 0.9 : 1
        }}
      >
        <FiFilter className="text-xl" />
        <span className="sr-only">Filters</span>
      </motion.button>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {filters.mobileFiltersOpen && (
          <>
            <motion.div
              variants={ANIMATION_VARIANTS.mobileFilterOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleMobileFilters}
            />
            
            <motion.div
              variants={ANIMATION_VARIANTS.mobileFilterPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-4/5 max-w-md bg-white z-50 shadow-2xl overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button 
                  onClick={toggleMobileFilters}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-tertiary focus:border-transparent"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Categories</h5>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilterValue('category', cat)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        filters.category.includes(cat)
                          ? 'bg-tertiary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Subcategories */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Types</h5>
                <div className="grid grid-cols-2 gap-2">
                  {SUB_CATEGORIES.map((subCat) => (
                    <motion.button
                      key={subCat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilterValue('subCategory', subCat)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        filters.subCategory.includes(subCat)
                          ? 'bg-tertiary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {subCat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Range */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Price Range</h5>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <motion.button
                      key={range.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilterValue('priceRange', range.label)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        filters.priceRange.includes(range.label)
                          ? 'bg-tertiary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="mb-6">
                <h5 className="font-medium mb-3">Sort By</h5>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-tertiary focus:border-transparent"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilters}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleMobileFilters}
                  className="flex-1 py-2 bg-tertiary text-white rounded-lg font-medium"
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col xs:flex-row gap-8 mb-16">
        {/* Desktop Filters */}
        <motion.aside 
          variants={ANIMATION_VARIANTS.filterPanel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="hidden lg:block min-w-80 bg-white p-6 rounded-xl shadow-lg sticky top-4 h-fit"
        >
          {/* Search with enhanced animation */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.02 }}
            className="relative mb-8"
          >
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-tertiary focus:border-transparent transition-all"
            />
            {filters.search && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="text-gray-400 hover:text-gray-600 transition-colors" />
              </motion.button>
            )}
          </motion.div>

          {/* Categories with animated checkboxes */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 flex items-center justify-between">
              <span>Categories</span>
              {filters.category.length > 0 && (
                <button 
                  onClick={() => updateFilter('category', [])}
                  className="text-xs text-tertiary hover:text-tertiary-dark"
                >
                  Clear
                </button>
              )}
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <motion.li 
                  key={cat}
                  whileHover={{ x: 5 }}
                  className="flex items-center"
                >
                  <motion.input
                    type="checkbox"
                    id={`cat-${cat}`}
                    checked={filters.category.includes(cat)}
                    onChange={() => toggleFilterValue('category', cat)}
                    className="hidden"
                  />
                  <motion.label
                    htmlFor={`cat-${cat}`}
                    className="flex items-center cursor-pointer w-full"
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        backgroundColor: filters.category.includes(cat) 
                          ? 'var(--tertiary)' 
                          : 'var(--white)',
                        borderColor: filters.category.includes(cat) 
                          ? 'var(--tertiary)' 
                          : 'var(--gray-300)'
                      }}
                      className="w-5 h-5 border rounded-md mr-3 flex items-center justify-center transition-colors"
                    >
                      {filters.category.includes(cat) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="block w-3 h-3 bg-white rounded-sm"
                        />
                      )}
                    </motion.span>
                    <span className="text-gray-700">{cat}</span>
                    <span className="ml-auto text-gray-400 text-sm">
                      ({processedProducts.filter(p => p.category === cat).length})
                    </span>
                  </motion.label>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Subcategories with animated checkboxes */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 flex items-center justify-between">
              <span>Types</span>
              {filters.subCategory.length > 0 && (
                <button 
                  onClick={() => updateFilter('subCategory', [])}
                  className="text-xs text-tertiary hover:text-tertiary-dark"
                >
                  Clear
                </button>
              )}
            </h5>
            <ul className="space-y-2">
              {SUB_CATEGORIES.map((subCat) => (
                <motion.li 
                  key={subCat}
                  whileHover={{ x: 5 }}
                  className="flex items-center"
                >
                  <motion.input
                    type="checkbox"
                    id={`subCat-${subCat}`}
                    checked={filters.subCategory.includes(subCat)}
                    onChange={() => toggleFilterValue('subCategory', subCat)}
                    className="hidden"
                  />
                  <motion.label
                    htmlFor={`subCat-${subCat}`}
                    className="flex items-center cursor-pointer w-full"
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        backgroundColor: filters.subCategory.includes(subCat) 
                          ? 'var(--tertiary)' 
                          : 'var(--white)',
                        borderColor: filters.subCategory.includes(subCat) 
                          ? 'var(--tertiary)' 
                          : 'var(--gray-300)'
                      }}
                      className="w-5 h-5 border rounded-md mr-3 flex items-center justify-center transition-colors"
                    >
                      {filters.subCategory.includes(subCat) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="block w-3 h-3 bg-white rounded-sm"
                        />
                      )}
                    </motion.span>
                    <span className="text-gray-700">{subCat}</span>
                    <span className="ml-auto text-gray-400 text-sm">
                      ({processedProducts.filter(p => p.subCategory === subCat).length})
                    </span>
                  </motion.label>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Price Range */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 flex items-center justify-between">
              <span>Price Range</span>
              {filters.priceRange.length > 0 && (
                <button 
                  onClick={() => updateFilter('priceRange', [])}
                  className="text-xs text-tertiary hover:text-tertiary-dark"
                >
                  Clear
                </button>
              )}
            </h5>
            <ul className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <motion.li 
                  key={range.label}
                  whileHover={{ x: 5 }}
                  className="flex items-center"
                >
                  <motion.input
                    type="checkbox"
                    id={`price-${range.label}`}
                    checked={filters.priceRange.includes(range.label)}
                    onChange={() => toggleFilterValue('priceRange', range.label)}
                    className="hidden"
                  />
                  <motion.label
                    htmlFor={`price-${range.label}`}
                    className="flex items-center cursor-pointer w-full"
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      animate={{
                        backgroundColor: filters.priceRange.includes(range.label) 
                          ? 'var(--tertiary)' 
                          : 'var(--white)',
                        borderColor: filters.priceRange.includes(range.label) 
                          ? 'var(--tertiary)' 
                          : 'var(--gray-300)'
                      }}
                      className="w-5 h-5 border rounded-md mr-3 flex items-center justify-center transition-colors"
                    >
                      {filters.priceRange.includes(range.label) && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="block w-3 h-3 bg-white rounded-sm"
                        />
                      )}
                    </motion.span>
                    <span className="text-gray-700">{range.label}</span>
                  </motion.label>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Sort with enhanced dropdown */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4">Sort By</h5>
            <motion.select
              whileHover={{ scale: 1.01 }}
              whileFocus={{ scale: 1.02 }}
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-tertiary focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>
          </motion.div>

          {/* Clear all filters with enhanced animation */}
          <motion.button
            whileHover={{ 
              scale: 1.03,
              backgroundColor: 'var(--tertiary-dark)'
            }}
            whileTap={{ scale: 0.97 }}
            onClick={resetFilters}
            disabled={!filters.category.length && !filters.subCategory.length && !filters.priceRange.length && filters.sort === 'relevant' && !filters.search}
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              !filters.category.length && !filters.subCategory.length && !filters.priceRange.length && filters.sort === 'relevant' && !filters.search
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-tertiary text-white hover:bg-tertiary-dark'
            }`}
          >
            Clear all filters
          </motion.button>
        </motion.aside>

        {/* Product Grid */}
        <motion.main 
          layout
          animate={controls}
          variants={{
            reset: {
              opacity: [1, 0.7, 1],
              transition: { duration: 0.5 }
            }
          }}
          className="bg-white p-6 rounded-xl flex-1 shadow-lg"
        >
          {/* Results Count */}
          <motion.div 
            layout
            className="flex justify-between items-center mb-6"
          >
            <motion.p className="text-gray-600">
              Showing {filteredProducts.length > 0 
                ? `${(filters.page - 1) * ITEMS_PER_PAGE + 1}-${Math.min(filters.page * ITEMS_PER_PAGE, filteredProducts.length + (filters.page - 1) * ITEMS_PER_PAGE)}` 
                : '0'} of {processedProducts.length} products
            </motion.p>
            
            {/* Mobile Sort Toggle */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleMobileFilters}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
            >
              <FiFilter />
              <span>Filters & Sort</span>
            </motion.button>
          </motion.div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={`products-${filters.page}-${filters.sort}-${filters.search}`}
              variants={ANIMATION_VARIANTS.container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 xs:grid-cols-4"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.article
                    key={`product-${product.id}`}
                    variants={ANIMATION_VARIANTS.item}
                    whileHover="hover"
                    whileTap="tap"
                    layoutId={`product-${product.id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Item product={product} />
                    {/* Enhanced product card footer */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                        {product.avgRating > 0 && (
                          <div className="flex items-center">
                            {renderStars(product.avgRating)}
                            <span className="ml-1 text-xs text-gray-500">
                              ({product.reviews?.length || 0})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-12"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      transition: { repeat: Infinity, duration: 2 }
                    }}
                    className="inline-block mb-6"
                  >
                    <FiSearch className="text-4xl text-gray-400" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-6 py-2 bg-tertiary text-white rounded-lg font-medium hover:bg-tertiary-dark transition-colors"
                  >
                    Reset all filters
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div 
              layout
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12"
            >
              <motion.p className="text-sm text-gray-500">
                Page {filters.page} of {totalPages}
              </motion.p>
              
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: filters.page !== 1 ? 1.05 : 1 }}
                  whileTap={{ scale: filters.page !== 1 ? 0.95 : 1 }}
                  disabled={filters.page === 1} 
                  onClick={() => updateFilter('page', filters.page - 1)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                    filters.page === 1 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FiChevronLeft /> 
                  <span>Previous</span>
                </motion.button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (filters.page <= 3) {
                      page = i + 1;
                    } else if (filters.page >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = filters.page - 2 + i;
                    }

                    return (
                      <motion.button 
                        key={page} 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateFilter('page', page)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          filters.page === page 
                            ? "bg-tertiary text-white" 
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}

                  {totalPages > 5 && filters.page < totalPages - 2 && (
                    <span className="mx-1 text-gray-400">...</span>
                  )}

                  {totalPages > 5 && filters.page < totalPages - 2 && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateFilter('page', totalPages)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        filters.page === totalPages 
                          ? "bg-tertiary text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {totalPages}
                    </motion.button>
                  )}
                </div>

                <motion.button 
                  whileHover={{ scale: filters.page !== totalPages ? 1.05 : 1 }}
                  whileTap={{ scale: filters.page !== totalPages ? 0.95 : 1 }}
                  disabled={filters.page === totalPages} 
                  onClick={() => updateFilter('page', filters.page + 1)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                    filters.page === totalPages 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span>Next</span>
                  <FiChevronRight />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.main>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default Collection;