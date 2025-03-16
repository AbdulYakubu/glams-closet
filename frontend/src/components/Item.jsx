import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../assets/assets/data'; 
import { FaStar } from 'react-icons/fa6';

const Item = ({product}) => {
    return (
        <div className='bottom-12 relative'>
            {/*images*/}
          <Link className='flexCenter relative top-12 overflow-hidden m-2.5 rounded-xl'>
                <img src={product.image[0]} alt="product-img" />
            </Link>
            {/*info*/}
            <div className='p-3 rounded-lg pt-12 bg-white'>
                <h4 className='bold-15 line-clamp-1 lmy-0'>{product.name}</h4>
                <div className='flexBetween pt-1'>
            <h5 className='h5 pr-2'>Ghs{product.price}</h5>
             <div className='flex items-baseline gap-x-1'>
                    <FaStar className='text-secondary'/>
                    <h5 className='h5 relative -bottom-0.5'>4.8</h5>
                </div>
                </div>
               
                <p className='line-clamp-2 py-1'>{ product.description}</p>
            </div>
        </div>
        
        
  )
}
export default Item