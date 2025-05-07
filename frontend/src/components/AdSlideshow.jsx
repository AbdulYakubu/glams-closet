import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Define advert messages with optional links and optional icons
const ADVERTS = [
  { 
    text: 'Free Shipping on Orders Over ₵500', 
    link: '/free-shipping',
    icon: '🚚'
  },
  { 
    text: 'New Arrivals in Jalibab - Shop Now', 
    link: '/new-arrivals',
    icon: '🆕'
  },
  { 
    text: '20% Off Abaaya This Week Only', 
    link: '/discounts',
    icon: '💎'
  },
  { 
    text: 'Discover Our Luxury Perfumes Collection', 
    link: '/perfumes',
    icon: '🌸'
  },
  { 
    text: 'Gift Packages Perfect for Any Occasion', 
    link: '/gifts',
    icon: '🎁'
  },
];

// Animation variants for sliding effect
const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
  }),
};

const AdSlideshow = () => {
  const [[currentAd, direction], setCurrentAd] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance adverts every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentAd(([prev]) => [(prev + 1) % ADVERTS.length, 1]);
      setProgress(0);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, ADVERTS.length]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) return;

    const duration = 5000;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    const frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, [currentAd, isPaused]);

  // Navigation functions
  const goToAd = (newIndex) => {
    const direction = newIndex > currentAd ? 1 : -1;
    setCurrentAd([newIndex, direction]);
    setProgress(0);
  };

  const nextAd = () => goToAd((currentAd + 1) % ADVERTS.length);
  const prevAd = () => goToAd((currentAd - 1 + ADVERTS.length) % ADVERTS.length);

  return (
    <div
      className="relative bg-secondary dark:bg-gray-900  from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 text-indigo-800 dark:text-indigo-100 py-3 text-center overflow-hidden shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left arrow */}
        <button
          onClick={prevAd}
          className="p-1 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-700/50 transition-colors"
          aria-label="Previous advertisement"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Ad content */}
        <div className="flex-1 mx-4 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentAd}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ 
                type: 'spring',
                stiffness: 300,
                damping: 30
              }}
              className="flex items-center justify-center space-x-2"
            >
              <span className="text-lg">{ADVERTS[currentAd].icon}</span>
              <a 
                href={ADVERTS[currentAd].link} 
                className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-medium tracking-wide"
                aria-label={ADVERTS[currentAd].text}
              >
                {ADVERTS[currentAd].text}
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right arrow */}
        <button
          onClick={nextAd}
          className="p-1 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-700/50 transition-colors"
          aria-label="Next advertisement"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-200/50 dark:bg-indigo-700/30">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation dots - only show on mobile */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-2 md:hidden">
        {ADVERTS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToAd(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentAd ? 'bg-indigo-600 dark:bg-indigo-300 w-4' : 'bg-indigo-300 dark:bg-indigo-600'}`}
            aria-label={`Go to advertisement ${index + 1}`}
            aria-current={index === currentAd ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default AdSlideshow;