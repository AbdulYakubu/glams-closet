import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define advert messages with optional links
const ADVERTS = [
  { text: 'Free Shipping on Orders Over ₵500!', link: '/free-shipping' },
  { text: 'New Arrivals in Jalibab - Shop Now!', link: '/new-arrivals' },
  { text: '20% Off Abaaya This Week Only!', link: '/discounts' },
  { text: 'Discover Our Luxury Perfumes Collection!', link: '/perfumes' },
  { text: 'Gift Packages Perfect for Any Occasion!', link: '/gifts' },
];

// Animation variants for sliding effect
const slideVariants = {
  enter: { opacity: 0, x: 100 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const AdSlideshow = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance adverts every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ADVERTS.length);
      setProgress(0); // Reset progress when ad changes
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, ADVERTS.length]);

  // Progress bar animation
  useEffect(() => {
    if (isPaused) return;

    const duration = 5000; // 5 seconds
    const startTime = Date.now();
    const frameDuration = 1000 / 60; // 60fps

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

  // Pause slideshow on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Manual navigation
  const goToAd = (index) => {
    setCurrentAd(index);
    setProgress(0);
  };

  return (
    <div
      className="relative bg-secondary dark:bg-indigo-900 text-gray-900 dark:text-white py-2 text-center text-sm sm:text-base font-medium overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="px-4"
        >
          <a 
            href={ADVERTS[currentAd].link} 
            className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            aria-label={ADVERTS[currentAd].text}
          >
            {ADVERTS[currentAd].text}
          </a>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-200 dark:bg-indigo-700">
        <motion.div
          className="h-full bg-indigo-600 dark:bg-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1">
        {ADVERTS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToAd(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentAd ? 'bg-secondary dark:bg-indigo-400' : 'bg-indigo-300 dark:bg-indigo-600'}`}
            aria-label={`Go to advertisement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdSlideshow;