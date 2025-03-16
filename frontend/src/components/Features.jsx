import React from 'react'
import Img1 from '../assets/assets/features/feature1.png'
import Img2 from '../assets/assets/features/feature2.png'

const Features = () => {
  return (
    <section className='max-padd-container  pt-14 pb-20 '>
      {/*Container*/}
      <div className='grid grid-cols-1 xl:grid-cols-[1.5fr_2fr] gap-6 gap-y-12 rounded-xl'>
        <div className='flexCenter gap-x-10'>
          <div>
            <img src={Img1} alt="feature-img" height={77} width={222} className='rounded-full object-cover'/>
          </div>
          <div>
            <img src={Img2} alt="feature-img" height={77} width={222} className='rounded-full object-cover' />
          </div>
        </div>
        <div className='flexCenter flex-wrap sm:flex-nowrap gap-x-5'>
          <div className='p-4 rounded-3xl'>
            <h4 className='md:text-[17px] h4 capitalize'>Quality Product</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          </div>
          <div className='p-4 rounded-3xl'>
            <h4 className='md:text-[17px] h4 capitalize'>Fast Delivery</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          </div>
          <div className='p-4 rounded-3xl'>
            <h4 className='md:text-[17px] h4 capitalize'>Secure Payment</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features