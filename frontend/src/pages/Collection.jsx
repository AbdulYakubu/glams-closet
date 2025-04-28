import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiSearch, FiFilter } from 'react-icons/fi';
import { TbLoader } from 'react-icons/tb';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Item from '../components/Item'; // Adjust if needed (e.g., '../../components/Item' if in src/pages/)
import Footer from '../components/Footer'; // Adjust if needed
import { ShopContext } from '../context/ShopContext'; // Adjust if needed

// Category mapping
const CATEGORY_SLUG_MAPPING = {
  'abayas': 'Egypt Abaya',
  'hijabs': 'Khimars',
  'kids': 'Kids',
  'perfumes': 'Perfumes and Self Care Products',
  'bags': 'Bags',
  'jalibabs': 'Jalibab',
  'ready-to-wear': 'Ready to Wear',
  'gifts': 'Gift & Packages',
  'veils': 'Veils and Hijab Accessories',
  'accessories': 'Veils and Hijab Accessories',
};

const CATEGORIES = [
  'Bags',
  'Perfumes and Self Care Products',
  'Egypt Abaya',
  'Jalibab',
  'Ready to Wear',
  'Gift & Packages',
  'Khimars',
  'Veils and Hijab Accessories',
  'Kids',
];

const SUB_CATEGORIES = {
  'Bags': ['Handbags', 'Tote Bags', 'Clutches', 'Backpacks', 'Travel Bags'],
  'Perfumes and Self Care Products': [
    "Women's Perfumes",
    "Men's Perfumes",
    'Luxury Fragrances',
    'Body Care',
    'Hair Care',
  ],
  'Egypt Abaya': ['Traditional', 'Modern', 'Embroidered'],
  'Jalibab': ['Traditional', 'Modern', 'Designer'],
  'Ready to Wear': ['Casual', 'Formal', 'Party Wear'],
  'Gift & Packages': ['Premium', 'Deluxe', 'Standard'],
  'Khimars': ['Traditional', 'Modern', 'Embroidered'],
  'Veils and Hijab Accessories': ['Hijabs', 'Under Scarves', 'Pins and Accessories'],
  'Kids': ['Casual', 'Formal', 'Traditional'],
};

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Recommended' },
  { value: 'Low', label: 'Price: Low to High' },
  { value: 'High', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Highest Rated' },
];

const ITEMS_PER_PAGE = 12;
const PRICE_RANGES = [
  { label: 'Under ₵200', min: 0, max: 200 },
  { label: '₵100 to ₵500', min: 100, max: 500 },
  { label: '₵200 to ₵1000', min: 200, max: 1000 },
  { label: 'Over ₵1000', min: 1000, max: Infinity },
];

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.97 },
  },
  filterPanel: {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 15 },
    },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
  },
  mobileFilterOverlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  mobileFilterPanel: {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  },
  breadcrumb: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
  skeleton: {
    hidden: { opacity: 0 },
    show: (i) => ({
      opacity: [0.3, 0.6, 0.3],
      transition: {
        repeat: Infinity,
        repeatType: 'reverse',
        duration: 1.5,
        delay: i * 0.1,
      },
    }),
  },
};

const Collection = () => {
  const { products = [], loading = false } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    subCategory: [],
    priceRange: [],
    sort: 'relevant',
    page: 1,
    search: '',
    mobileFiltersOpen: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorySlug = params.get('category');
    if (categorySlug) {
      const mappedCategory = CATEGORY_SLUG_MAPPING[categorySlug];
      if (mappedCategory && !filters.category.includes(mappedCategory)) {
        setFilters((prev) => ({
          ...prev,
          category: [mappedCategory],
          page: 1,
        }));
      }
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (typeof numericPrice !== 'number' || isNaN(numericPrice)) {
      console.warn(`Invalid price: ${price}`);
      return '0.00';
    }
    return numericPrice.toFixed(2);
  };

  const processedProducts = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      id: product.id || `prod_${index}_${Date.now()}`,
      avgRating: Array.isArray(product.reviews) && product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / product.reviews.length
        : 0,
      loading: 'lazy',
    }));
  }, [products]);

  const { filteredProducts, totalPages } = useMemo(() => {
    let filtered = [...processedProducts];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => p.category && filters.category.includes(p.category));
    }

    if (filters.subCategory.length > 0) {
      filtered = filtered.filter((p) => p.subCategory && filters.subCategory.includes(p.subCategory));
    }

    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((p) =>
        filters.priceRange.some((range) => {
          const { min, max } = PRICE_RANGES.find((r) => r.label === range) || {};
          const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
          return price >= min && price <= max;
        })
      );
    }

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
        filtered.sort((a, b) => {
          const popularityDiff = (b.popularity || 0) - (a.popularity || 0);
          if (popularityDiff !== 0) return popularityDiff;
          return (b.avgRating || 0) - (a.avgRating || 0);
        });
    }

    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    return { filteredProducts: paginated, totalPages: total };
  }, [processedProducts, filters]);

  const updateFilter = useCallback(
    (filterName, value) => {
      controls.start({ opacity: [1, 0.7, 1], transition: { duration: 0.3 } });
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
        page: 1,
        ...(filterName === 'category' && { subCategory: [] }),
      }));
      if (filterName === 'category' && value.length === 0) {
        navigate('/collection');
      }
    },
    [controls, navigate]
  );

  const toggleFilterValue = useCallback(
    (filterName, value) => {
      controls.start({ scale: [1, 0.95, 1], transition: { duration: 0.2 } });
      setFilters((prev) => ({
        ...prev,
        [filterName]: prev[filterName].includes(value)
          ? prev[filterName].filter((item) => item !== value)
          : [...prev[filterName], value],
        page: 1,
      }));
      if (filterName === 'category' && prev[filterName].includes(value)) {
        navigate('/collection');
      }
    },
    [controls, navigate]
  );

  const resetFilters = useCallback(() => {
    controls.start('reset');
    setFilters({
      category: [],
      subCategory: [],
      priceRange: [],
      sort: 'relevant',
      page: 1,
      search: '',
      mobileFiltersOpen: false,
    });
    navigate('/collection');
  }, [controls, navigate]);

  const toggleMobileFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      mobileFiltersOpen: !prev.mobileFiltersOpen,
    }));
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" aria-hidden="true" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" aria-hidden="true" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" aria-hidden="true" />);
      }
    }

    return <div className="flex" aria-label={`Rating: ${rating} out of 5`}>{stars}</div>;
  };

  const handleItemClick = (productName) => {
    toast.success(`Viewing ${productName}`);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900"
        role="region"
        aria-label="Loading collection"
      >
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="mb-4"
        >
          <TbLoader className="text-5xl text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-lg text-gray-600 dark:text-gray-300"
        >
          Loading your collection...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-900"
    >
      {/* Breadcrumb Navigation */}
      <motion.div
        variants={ANIMATION_VARIANTS.breadcrumb}
        initial="hidden"
        animate="visible"
        className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700"
      >
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </motion.button>
          <span aria-hidden="true">/</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Categories
          </motion.button>
          {filters.category.length > 0 && (
            <>
              <span aria-hidden="true">/</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{filters.category[0]}</span>
            </>
          )}
        </nav>
      </motion.div>

      {/* Sticky Filter Summary */}
      {filters.category.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtered by:</span>
            {filters.category.map((cat) => (
              <motion.span
                key={cat}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
              >
                {cat}
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleFilterValue('category', cat)}
                  className="ml-2 text-indigo-500 dark:text-indigo-400"
                >
                  <FiX className="w-4 h-4" aria-label={`Remove ${cat} filter`} />
                </motion.button>
              </motion.span>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFilters}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Clear All
          </motion.button>
        </motion.div>
      )}

      {/* Mobile Filter Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMobileFilters}
        className={`sm:hidden fixed z-30 bottom-6 right-6 p-4 rounded-full shadow-xl bg-indigo-600 dark:bg-indigo-700 text-white transition-all duration-300 ${
          isScrolled ? 'scale-90' : 'scale-100'
        }`}
        animate={{ y: isScrolled ? 10 : 0, opacity: isScrolled ? 0.9 : 1 }}
        aria-label="Open filters"
      >
        <FiFilter className="text-xl" aria-hidden="true" />
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
              className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
              onClick={toggleMobileFilters}
              aria-hidden="true"
            />
            <motion.div
              variants={ANIMATION_VARIANTS.mobileFilterPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-4/5 max-w-md bg-white dark:bg-gray-800 z-50 shadow-2xl overflow-y-auto p-6"
              role="dialog"
              aria-label="Mobile filters"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={toggleMobileFilters}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close filters"
                >
                  <FiX className="text-xl text-gray-600 dark:text-gray-300" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  aria-label="Search products"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
                  </button>
                )}
              </div>

              {/* Mobile Categories */}
              <div className="mb-6">
                <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Categories</h5>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilterValue('category', cat)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        filters.category.includes(cat)
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-pressed={filters.category.includes(cat)}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Subcategories */}
              {filters.category.length === 1 && (
                <div className="mb-6">
                  <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Types</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {SUB_CATEGORIES[filters.category[0]]?.map((subCat) => (
                      <motion.button
                        key={subCat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFilterValue('subCategory', subCat)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          filters.subCategory.includes(subCat)
                            ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                        aria-pressed={filters.subCategory.includes(subCat)}
                      >
                        {subCat}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Price Range */}
              <div className="mb-6">
                <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Price Range</h5>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <motion.button
                      key={range.label}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFilterValue('priceRange', range.label)}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        filters.priceRange.includes(range.label)
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                      aria-pressed={filters.priceRange.includes(range.label)}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="mb-6">
                <h5 className="font-medium mb-3 text-gray-900 dark:text-white">Sort By</h5>
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map((option) => (
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
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={toggleMobileFilters}
                  className="flex-1 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg font-medium"
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 mb-16 px-4 sm:px-6">
        {/* Desktop Filters */}
        <motion.aside
          variants={ANIMATION_VARIANTS.filterPanel}
          initial="hidden"
          animate="visible"
          className="hidden lg:block min-w-80 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-20 h-fit border border-gray-100 dark:border-gray-700"
          role="region"
          aria-label="Product filters"
        >
          {/* Search */}
          <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.02 }} className="relative mb-8">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 dark:text-white"
              aria-label="Search products"
            />
            {filters.search && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="Clear search"
              >
                <FiX className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
              </motion.button>
            )}
          </motion.div>

          {/* Categories */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 flex items-center justify-between text-gray-900 dark:text-white">
              <span>Categories</span>
              {filters.category.length > 0 && (
                <button
                  onClick={() => updateFilter('category', [])}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Clear
                </button>
              )}
            </h5>
            <ul className="space-y-3">
              {CATEGORIES.map((cat) => (
                <motion.li key={cat} whileHover={{ translateX: 5 }} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`cat-${cat}`}
                    checked={filters.category.includes(cat)}
                    onChange={() => toggleFilterValue('category', cat)}
                    className="w-5 h-5 border rounded-md text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                    aria-checked={filters.category.includes(cat)}
                  />
                  <label
                    htmlFor={`cat-${cat}`}
                    className="ml-3 flex items-center cursor-pointer w-full text-gray-700 dark:text-gray-300"
                  >
                    <span>{cat}</span>
                    <span className="ml-auto text-gray-400 dark:text-gray-300 text-sm">
                      ({processedProducts.filter((p) => p.category === cat).length})
                    </span>
                  </label>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Subcategories */}
          {filters.category.length === 1 && (
            <motion.div className="mb-8">
              <h5 className="font-bold text-lg mb-4 flex items-center justify-between text-gray-900 dark:text-white">
                <span>Types</span>
                {filters.subCategory.length > 0 && (
                  <button
                    onClick={() => updateFilter('subCategory', [])}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    Clear
                  </button>
                )}
              </h5>
              <ul className="space-y-3">
                {SUB_CATEGORIES[filters.category[0]]?.map((subCat) => (
                  <motion.li key={subCat} whileHover={{ translateX: 5 }} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`subCat-${subCat}`}
                      checked={filters.subCategory.includes(subCat)}
                      onChange={() => toggleFilterValue('subCategory', subCat)}
                      className="w-5 h-5 border rounded-md text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                      aria-checked={filters.subCategory.includes(subCat)}
                    />
                    <label
                      htmlFor={`subCat-${subCat}`}
                      className="ml-3 flex items-center cursor-pointer w-full text-gray-700 dark:text-gray-300"
                    >
                      <span>{subCat}</span>
                      <span className="ml-auto text-gray-400 dark:text-gray-300 text-sm">
                        ({processedProducts.filter((p) => p.subCategory === subCat).length})
                      </span>
                    </label>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Price Range */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 flex items-center justify-between text-gray-900 dark:text-white">
              <span>Price Range</span>
              {filters.priceRange.length > 0 && (
                <button
                  onClick={() => updateFilter('priceRange', [])}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Clear
                </button>
              )}
            </h5>
            <ul className="space-y-3">
              {PRICE_RANGES.map((range) => (
                <motion.li
                  key={range.label}
                  whileHover={{ translateX: 5 }}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`price-${range.label}`}
                    checked={filters.priceRange.includes(range.label)}
                    onChange={() => toggleFilterValue('priceRange', range.label)}
                    className="w-5 h-5 border rounded-md text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600"
                    aria-checked={filters.priceRange.includes(range.label)}
                  />
                  <label
                    htmlFor={`price-${range.label}`}
                    className="ml-3 flex items-center cursor-pointer w-full text-gray-700 dark:text-gray-300"
                  >
                    <span>{range.label}</span>
                  </label>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Sort */}
          <motion.div className="mb-8">
            <h5 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Sort By</h5>
            <motion.select
              whileHover={{ scale: 1.01 }}
              whileFocus={{ scale: 1.02 }}
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </motion.select>
          </motion.div>

          {/* Clear Filters */}
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#4338ca' }}
            whileTap={{ scale: 0.97 }}
            onClick={resetFilters}
            disabled={
              !filters.category.length &&
              !filters.subCategory.length &&
              !filters.priceRange.length &&
              filters.sort === 'relevant' &&
              !filters.search
            }
            className={`w-full py-3 rounded-xl font-medium transition-all ${
              !filters.category.length &&
              !filters.subCategory.length &&
              !filters.priceRange.length &&
              filters.sort === 'relevant' &&
              !filters.search
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800'
            }`}
            aria-label="Clear all filters"
          >
            Clear all filters
          </motion.button>
        </motion.aside>

        {/* Product Grid */}
        <motion.main
          layout
          animate={controls}
          variants={{ reset: { opacity: [1, 0.7, 1], transition: { duration: 0.5 } } }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl flex-1 shadow-lg border border-gray-100 dark:border-gray-700"
          role="region"
          aria-label="Product collection"
        >
          {/* Results Count */}
          <motion.div layout className="flex justify-between items-center mb-6">
            <motion.p className="text-gray-600 dark:text-gray-300 text-sm">
              Showing{' '}
              {filteredProducts.length > 0
                ? `${(filters.page - 1) * ITEMS_PER_PAGE + 1}-${Math.min(
                    filters.page * ITEMS_PER_PAGE,
                    filteredProducts.length + (filters.page - 1) * ITEMS_PER_PAGE
                  )}`
                : '0'}{' '}
              of {processedProducts.length} products
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleMobileFilters}
              className="sm:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
              aria-label="Open filters"
            >
              <FiFilter aria-hidden="true" />
              <span>Filters & Sort</span>
            </motion.button>
          </motion.div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-4 gap-6"
                key="skeleton-grid"
              >
                {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    custom={i}
                    variants={ANIMATION_VARIANTS.skeleton}
                    className="bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden"
                    style={{ height: '300px' }}
                    aria-hidden="true"
                  />
                ))}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                key={`products-${filters.page}-${filters.sort}-${filters.search}`}
                variants={ANIMATION_VARIANTS.container}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 md:grid-cols-3 xs:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.article
                    key={`product-${product.id}`}
                    variants={ANIMATION_VARIANTS.item}
                    whileHover="hover"
                    whileTap="tap"
                    layoutId={`product-${product.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
                    onClick={() => handleItemClick(product.name)}
                  >
                    <Item product={product} />
                    {product.avgRating > 0 && (
                      <div className="p-4 flex justify-end items-center">
                        <div className="flex items-center">
                          {renderStars(product.avgRating)}
                          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                            ({product.reviews?.length || 0})
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
                role="alert"
                aria-label="No products found"
                key="no-products"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } }}
                  className="inline-block mb-6"
                >
                  <FiSearch className="text-4xl text-gray-400 dark:text-gray-300" aria-hidden="true" />
                </motion.div>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="px-6 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                >
                  Reset all filters
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              layout
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12"
            >
              <motion.p className="text-sm text-gray-500 dark:text-gray-400">
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
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
                  }`}
                  aria-label="Previous page"
                >
                  <FiChevronLeft aria-hidden="true" />
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
                            ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
                        }`}
                        aria-label={`Page ${page}`}
                        aria-current={filters.page === page ? 'page' : undefined}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                  {totalPages > 5 && filters.page < totalPages - 2 && (
                    <span className="mx-1 text-gray-400 dark:text-gray-300">...</span>
                  )}
                  {totalPages > 5 && filters.page < totalPages - 2 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateFilter('page', totalPages)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        filters.page === totalPages
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
                      }`}
                      aria-label={`Page ${totalPages}`}
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
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30'
                  }`}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <FiChevronRight aria-hidden="true" />
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