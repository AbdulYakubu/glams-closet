import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import banner from '../assets/assets/banner.png'

const Banner = () => {
  return (
    <section className='mx-auto max-w-[1440px]'>
      <div className='flexBetween bg-white'>
        {/*Left Side*/}
        <div className=' lg:block flex-1 px-6 xl:px-12'>
          <h2 className='h2 uppercase md:text-[35px] md:leading-[1.3]'>Affordable Style, Timeless Appeal</h2>
          <h3 className='h4 uppercase'>Transform Your Closet Today</h3>
          <div className='flex mt-5'>
            <Link to={'/collection'} className='btn-secondary !py-0 !pr-0 rounded-full flexCenter gap-x-2 group'>
              Explore Collection
              <FaArrowRight className='bg-white text-tertiary rounded-full h-9 w-9 p-3 m-[3px] group-hover:-rotate-[20deg] transition-all duration-500'/>
            </Link>
          </div>
        </div>
        {/*Image Side*/}
        <div className='flex-1'>
          <img src={banner} alt='bannerImg' className='rounded-tl-3xl rounded-bl-3xl'/>
        </div>
      </div>
    </section>
  )
}

export default Banner