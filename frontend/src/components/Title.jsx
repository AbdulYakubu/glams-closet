import React from 'react'

const Title = ({title1,title2, titleStyles, title1Styles, paraStyles}) => {
  return (
    <div className={`${titleStyles} pb-1`}>
      <h3 className={`${title1Styles} h3 md:text-[28px] md:leading-[1.3]`}>
        {title1}
        <span className='text-secondary |font-light'> { title2}</span>
      </h3>
      <p className={`${paraStyles} pb-4 font-semibold`}>
        Discover the best deals on top-quality products, Crafted <br></br>
        to elevate your everyday experience.
      </p>
    </div>
  )
}

export default Title