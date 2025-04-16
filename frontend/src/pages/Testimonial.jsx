import React from 'react';
import { motion } from 'framer-motion';
//import { testimonials } from '../data/testimonials';
import Title from '../components/Title';
import { FaCheck, FaStar } from 'react-icons/fa6';
import Footer from '../components/Footer';


import user1 from '../assets/assets/testimonials/user1.png';
import user2 from '../assets/assets/testimonials/user2.png';
import product1 from '../assets/assets/product_1.png';
import product2 from '../assets/assets/product_2_1.png';
import product3 from '../assets/assets/product_2_2.png';
import product4 from '../assets/assets/product_2_3.png';

export const testimonials = [
  {
    user: "Yakubu Abdul Aziz",
    avatar: user1,
    title: "High Quality",
    rating: 5,
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    verified: true,
    products: [product1, product2],
  },
  {
    user: "Ramatu Abdulai",
    avatar: user2,
    title: "Modern Design",
    rating: 5,
    content: "Aliquam tincidunt mauris eu risus. Vestibulum auctor dapibus neque...",
    verified: true,
    products: [product3, product4],
  },
  
];


const Testimonial = () => {
  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className='bg-white flex-1'>
      <div className='max-padd-container py-16'>
        <div className='grid grid-cols-1 xs:grid-cols-[1fr_3fr] gap-16'>
          <div className='flex flex-col gap-10'>
            <Title title1={'What People'} title2={'Say'} paraStyles='!block' />
            <div className='flex flex-col gap-1 bg-primary p-3 rounded-lg'>
              <div className='flex text-yellow-600 gap-2'>
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
              <div className='medium-14'>More than <b>+25,000 reviews</b></div>
            </div>
          </div>

          <motion.div 
            className='grid grid-cols-1 sm:grid-cols-2 gap-6'
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                className='bg-primary rounded-xl p-5 shadow-sm flex flex-col gap-3'
              >
                <div className='flex justify-between items-center'>
                  <div className='flex items-center gap-3'>
                    <img src={t.avatar} alt={t.user} className='rounded-full h-10 w-10 object-cover' />
                    <h5 className='font-medium'>{t.user}</h5>
                  </div>
                  {t.verified && (
                    <div className='bg-secondary text-white rounded-full flex items-center gap-1 px-3 py-1 text-xs'>
                      <FaCheck />
                      Verified
                    </div>
                  )}
                </div>
                <div className='flex gap-1 text-secondary text-sm'>
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <h4 className='font-semibold text-lg'>{t.title}</h4>
                <p className='text-gray-600 text-sm'>{t.content}</p>
                <div className='flex gap-2 mt-2'>
                  {t.products.map((img, i) => (
                    <img key={i} src={img} alt="product" className='h-12 w-12 object-cover rounded-md' />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Testimonial;