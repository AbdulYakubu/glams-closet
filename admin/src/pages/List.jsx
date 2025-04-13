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
    <div className='px-4 sm:px-8 sm:mt-14'>
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-[1fr_3fr_2fr_1.5fr_1fr] items-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>Remove</h5>
        </div>
        {list.map((item) => (
          <div
            key={item._id}
            className='grid grid-cols-[1fr_3fr_2fr_1.5fr_1fr] items-center gap-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'
          >
            <img className='w-16 h-16 object-cover rounded-lg border' src={item.image[0]} alt="product-img" />
            <h5 className='text-lg font-semibold text-gray-800'>{item.name}</h5>
            <p className='text-sm text-gray-600'>{item.category}</p>
            <div className='text-lg font-semibold text-gray-800'>{currency}{item.price}</div>
            <div onClick={() => removeProduct(item._id)} className='cursor-pointer hover:text-red-600'>
              <TbTrash className='text-xl text-red-500 transition-colors duration-200' />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List