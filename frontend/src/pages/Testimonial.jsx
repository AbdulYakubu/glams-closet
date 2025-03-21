import React from 'react'
import Title from '../components/Title'
import { FaCheck, FaStar } from 'react-icons/fa6'
import user1 from '../assets/assets/testimonials/user1.png'
import user2 from '../assets/assets/testimonials/user2.png'
import product1 from '../assets/assets/product_1.png'
import product2 from '../assets/assets/product_2_1.png'
import product3 from '../assets/assets/product_2_2.png'
import product4 from '../assets/assets/product_2_3.png'
import Footer from '../components/Footer'

const Testimonial = () => {
  return (
    <div>
      <div className='bg-primary mb-16'>
        <div className='max-padd-container py-10'>
          {/*container*/}
          <div className=' grid grid-cols-1 xs:grid-cols-[1fr_3fr] gap-20 mb-16 rounded-2xl'>
            {/*Left side*/}
            <div className='flex items-start justify-between flex-col gap-10'>
              <Title title1={'What People'} title2={'Says'} title1Styles={'pb-10'} paraStyles={'!block'} />
              <div className='flex flex-col gap-1 bg-white p-2 rounded'>
                <div className='flex text-secondary gap-2'>
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <div className='medium-14'>more than <b>+25,000 reviews</b></div>
              </div>
            </div>
            {/*Right side*/}
            <div className='grid grid-cols-2 sm:grid-cols-2 gap-7'>
              {/* Review Card */}
              <div className='flex flex-col gap-1 rounded-lg p-4 bg-white'>
                <div className='flexBetween'>
                  <div className='flexCenter gap-x-2'>
                    <img
                      src={user1}
                      alt="testimonial-img"
                      height={44}
                      width={44}
                      className='rounded-full'
                    />
                    <h5>Yakubu Abdul Aziz</h5>
                  </div>
                  <div className='bg-secondary text-white rounded-full flexCenter gap-x-2 p-1 px-2 text-xs font-semibold'>
                    <FaCheck />
                    verified 
                  </div>
                </div>
                <hr className='h-[1px] w-full my-2' />
                <div className='flex gap-x-1 text-secondary mt-5 mb-1 text-xs'>
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <h4 className='h4'>High Quality</h4>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt corrupti ratione praesentium pariatur est eveniet, vel accusantium libero temporibus aspernatur necessitatibus sint, sequi ducimus velit? Sint voluptate eligendi molestias vitae?</p>
                <div className='flex gap-x-1 mt-5'>
                <img
                  src={product1}
                  alt="testimonial-img"
                  height={44}
                  width={44}
                  className='rounded aspect-square object-cover'
                />
                <img
                  src={product2}
                  alt="testimonial-img"
                  height={44}
                  width={44}
                  />
                  </div>
              </div>
              <div className='flex flex-col gap-1 rounded-lg p-4 bg-white'>
                <div className='flexBetween'>
                  <div className='flexCenter gap-x-2'>
                    <img
                      src={user2}
                      alt="testimonial-img"
                      height={44}
                      width={44}
                      className='rounded-full'
                    />
                    <h5>Ramatu Abdulai</h5>
                  </div>
                  <div className='bg-secondary text-white rounded-full flexCenter gap-x-2 p-1 px-2 text-xs font-semibold'>
                    <FaCheck />
                    verified 
                  </div>
                </div>
                <hr className='h-[1px] w-full my-2' />
                <div className='flex gap-x-1 text-secondary mt-5 mb-1 text-xs'>
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <h4 className='h4'>Modern Design</h4>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt corrupti ratione praesentium pariatur est eveniet, vel accusantium libero temporibus aspernatur necessitatibus sint, sequi ducimus velit? Sint voluptate eligendi molestias vitae?</p>
                <div className='flex gap-x-1 mt-5'>
                <img
                  src={product3}
                  alt="testimonial-img"
                  height={44}
                  width={44}
                  className='rounded aspect-square object-cover'
                />
                <img
                  src={product4}
                  alt="testimonial-img"
                  height={44}
                  width={44}
                  />
                  </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Testimonial