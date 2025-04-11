import React, { useContext, useEffect, useState } from 'react'
import Title from "./Title"
import { ShopContext } from '../context/ShopContext'
import Item from './Item'

const RelatedProducts = ({category, subCategory}) => {
  const { products } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products.slice()

      filtered = filtered.filter((item) => category === item.category)
      filtered = filtered.filter((item) => subCategory === item.subCategory)
      setRelated(filtered.slice(0, 5))
    }
  }, [products, category, subCategory]) // Added category and subCategory to the dependency array

  return (
    <section className='py-16'>
      <Title title1={'Related'} title2={'Products'} title1Styles={'pb-4'} />
      <div className='grid xs:grid-cols-5 grid-cols-1 md:grid-cols-5 gap-4'>
        {related.map((product) => (
          <Item key={product._id} product={product} /> 
        ))}
      </div>
    </section>
  )
}

export default RelatedProducts