import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FaStar, FaStarHalfStroke, FaTruckFast } from 'react-icons/fa6'
import { FaHeart } from 'react-icons/fa'
import { TbShoppingBagPlus } from 'react-icons/tb'

const Product = () => {
    const { productId } = useParams()
    const { products, currency } = useContext(ShopContext)
    const [product, setProduct] = useState(null)
    const [image, setImage] = useState("")
    const [size, setSize] = useState("")

    const fetchProductData = async () => {
        const selectedProduct = products.find((item) => item._id === productId)
        if (selectedProduct) {
            setProduct(selectedProduct)
            setImage(selectedProduct.image[0])
            //console.log(selectedProduct)
        }
    }

    useEffect(() => {
        fetchProductData()
    }, [productId, products])

    if (!product) {
        return <div> ...Loading</div>
    }
  return (
      <div>
          <div>
              {/*Product data*/}
              <div>
                  {/*Product Image*/}
                  <div className='flex flex-1 gap-x-2 xl:flex-1'>
                      <div className='flexCenter flex-col gap-[7px] flex-wrap'>
                          {product.image.map((item, i) => (
  <img onClick={() => setImage(item)} key={i} src={item} alt="product-image"
    className='max-h-[89px] rounded-lg'
  />
))}

                      </div>
                      <div className='max-h-[377px] w-auto flex'>
                          <img src={image} alt="product-image"
                          className='rounded-xl bg-gray-10'/>
                      </div>
                  </div>
                  {/*Product Info */}
                  <div>
                      <h3>{product.name}</h3>
                      {/* Rating and price */}
                      <div>
                          <div>
                              <div>
                                  <FaStar />
                                  <FaStar />
                                  <FaStar />
                                  <FaStar />
                                  <FaStarHalfStroke/>
                              </div>
                              <span>{ 122}</span>
                          </div>
                      </div>
                      <h4>{currency}{product.price}.00</h4>
                      <p>{product.description}</p>
                      <div>
                          <div>
                              {[...product.sizes].sort((a, b) => {
                                  const order = ["S", "M", "L", "XL", "XXL"]
                                  return order.indexOf(a)-order.indexOf(b)
                              }).map((item, i) => (
                                  <button>{ item}</button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <button> Add to Cart <TbShoppingBagPlus /></button>
                          <button>Add to Favorite <FaHeart/></button>
                      </div>
                      <div>
                          <FaTruckFast className='text-lg' />
                          <span>Free delivery on orders over Ghs2000</span>
                      </div>
                      <hr className='my-3 w-2/3' />
                      <div>
                          <div>Authenticity You can Trust</div>
                          <div>Enjoy Cash on Delivery fro Your Convenience </div>
                          <div>
                              <div>Enjoy Cash on Delivery fro Your Convenience </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default Product