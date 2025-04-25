import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import slide1 from '../assets/assets/bg-hero.jpeg';
import slide2 from '../assets/assets/abaaya.webp';
import slide3 from '../assets/assets/hero_1.jpg';

const fallbackImage = 'https://via.placeholder.com/1920x1080?text=Image+Not+Found';

const slides = [
  {
    image: slide1,
    title: 'Elegant Black Abaya',
    description: 'Timeless elegance with intricate embroidery, perfect for any occasion.',
    shopLink: '/collection',
    badge: 'BEST SELLER',
  },
  {
    image: slide2,
    title: 'Modern Beige Abaya',
    description: 'Contemporary design with soft fabrics for everyday comfort.',
    shopLink: '/collection',
    badge: 'NEW ARRIVAL',
  },
  {
    image: slide3,
    title: 'Festive Embroidered Abaya',
    description: 'Celebrate in style with luxurious details and vibrant accents.',
    shopLink: '/collection',
    badge: 'LIMITED EDITION',
  },
];

// Preload images
slides.forEach(slide => {
  const img = new Image();
  img.src = slide.image;
});

const SlideContent = memo(({ slide }) => (
  <motion.div
    className="text-white max-w-lg z-10 flex flex-col items-start space-y-4 sm:space-y-6"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, duration: 0.6 }}
  >
    <motion.div
      className="bg-gradient-to-r from-amber-500 to-amber-600 text-white bg-secondary px-4 py-1.5 rounded-full text-sm font-medium"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      {slide.badge}
    </motion.div>
    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white bg-primary">
      {slide.title}
    </h1>
    <p className="text-base md:text-lg text-gray-100 font-medium max-w-md">
      {slide.description}
    </p>
    <Link
      to={slide.shopLink}
      className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white bg-secondary font-semibold text-sm rounded-full hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      Shop Now
      <motion.span
        className="ml-2"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <FaArrowRight />
      </motion.span>
    </Link>
  </motion.div>
));

const Hero = memo(() => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Image loading
  useEffect(() => {
    setIsLoading(true);
    const img = new Image();
    img.src = slides[currentSlide].image || fallbackImage;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
  }, [currentSlide]);

  // Touch handlers
  const onTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) {
      setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section
      className="relative w-full h-[70vh] sm:h-screen overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div
            className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <motion.img
            src={slides[currentSlide].image || fallbackImage}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
            loading="lazy"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/70 to-amber-900/40" />
          <div className="absolute inset-0 flex items-center justify-center sm:justify-start px-6 sm:px-12">
            <SlideContent slide={slides[currentSlide]} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`transition-all w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Decorative glow elements */}
      <motion.div
        className="absolute top-1/4 -left-20 w-32 h-32 sm:w-40 sm:h-40 bg-amber-400/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-32 h-32 sm:w-40 sm:h-40 bg-purple-400/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </section>
  );
});

export default Hero;
