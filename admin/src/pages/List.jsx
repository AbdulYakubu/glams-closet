import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_url, currency } from '../App'
import { toast } from 'react-toastify'
import { TbTrash } from 'react-icons/tb'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.post(backend_url + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message || "Failed to fetch products")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Something went wrong")
    }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backend_url + '/api/product/remove',
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message || "Product removed")
        await fetchList()
      } else {
        toast.error(response.data.message || "Failed to remove product")
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || "Error removing product")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='px-2 sm:px-8 sm:mt-14'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center py-1 px-2 bg-white bold-14 sm:bold-15 mb-1 rounded'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Remove</h5>
        </div>
        {list.map((item) => (
          <div
            key={item._id}
            className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr] md:grid-cols-[1fr_3.5fr_1.5fr_1fr_1fr] items-center gap-2 p-1 bg-white rounded-xl'
          >
            <img className='w-12 rounded-lg' src={item.image[0]} alt="product-img" />
            <h5 className='text-sm font-semibold'>{item.name}</h5>
            <p className='text-sm font-semibold'>{item.category}</p>
            <div className='text-sm font-semibold'>{currency}{item.price}</div>
            <div onClick={() => removeProduct(item._id)}>
              <TbTrash className='text-right md:text-center cursor-pointer text-lg text-red-500' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List