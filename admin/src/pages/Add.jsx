import React, { useState } from 'react'
import Upload from '../assets/upload_icon.png'
import axios from 'axios'
import { backend_url } from '../App'
import { toast } from 'react-toastify'

// Add Product Page Component
const Add = () => {
  // States for images (false means no image yet)
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  // Product info states
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [popular, setPopular] = useState(false)
  const [newArrival, setNewArrival] = useState(false) // ✅ Added newArrival state
  const [sizes, setSizes] = useState([])

  // Handle form submission to send product data to backend
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        toast.error("You are not authenticated.")
        return
      }

      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('popular', popular)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('newArrival', newArrival) // ✅ Include newArrival in formData
      formData.append('date', new Date().getTime())

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(
        `${backend_url}/api/product/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setName("")
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice("")
        setPopular(false)
        setNewArrival(false)
        setSizes([])
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  return (
    <div className='px-2 sm:px-8 sm:mt-14'>
      <div>
        <form className='flex flex-col gap-y-3 medium-14 lg:w-[777px]' onSubmit={onSubmitHandler}>
          {/* Product Name */}
          <div className='w-full'>
            <h5 className='h5'>Product Name</h5>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder='Write here.....'
              className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
            />
          </div>

          {/* Description */}
          <div className='w-full'>
            <h5 className='h5'>Product Description</h5>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows={5}
              placeholder='Write here.....'
              className='px-3 py-1.5 ring-1 ring-slate-900/10 rounded bg-white mt-1 w-full max-w-lg'
            />
          </div>

          {/* Category, Subcategory & Price */}
          <div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-row gap-4'>
                <div>
                  <h5 className='h5'>Category</h5>
                  <select
                    onChange={(e) => setCategory(e.target.value)}
                    className='max-w-20 px-3 py-2 text-gray-300 ring-1 ring-slate-900/5 bg-white'
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div>
                  <h5 className='h5'>Sub Category</h5>
                  <select
                    onChange={(e) => setSubCategory(e.target.value)}
                    className='max-w-28 px-3 py-2 text-gray-300 ring-1 ring-slate-900/5 bg-white'
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Buttonwear">Buttonwear</option>
                    <option value="Winterwear">Winterwear</option>
                  </select>
                </div>
              </div>

              <div>
                <h5 className='h5'>Product Price</h5>
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  type="number"
                  min="0"
                  placeholder='10'
                  className='px-3 py-2 bg-white rounded max-w-24 ring-1 ring-slate-900/5'
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h5 className='h5'>Product Sizes</h5>
            <div className='flex gap-3 mt-2'>
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <div
                  key={size}
                  onClick={() =>
                    setSizes(prev =>
                      prev.includes(size)
                        ? prev.filter(item => item !== size)
                        : [...prev, size]
                    )
                  }
                >
                  <span className={`${sizes.includes(size) ? 'bg-[#272626] text-white' : 'bg-white'} text-gray-300 rounded ring-1 ring-slate-900/5 px-3 py-1 cursor-pointer`}>
                    {size}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className='flex gap-2 pt-2'>
            {[image1, image2, image3, image4].map((img, i) => (
              <label key={i} htmlFor={`image${i + 1}`}>
                <img
                  src={img ? URL.createObjectURL(img) : Upload}
                  alt="upload-icon"
                  className='w-16 h-16 aspect-square object-cover ring-1 ring-slate-900/5 rounded-lg cursor-pointer'
                />
                <input
                  onChange={(e) => {
                    const setter = [setImage1, setImage2, setImage3, setImage4][i];
                    setter(e.target.files[0]);
                  }}
                  type="file"
                  id={`image${i + 1}`}
                  hidden
                />
              </label>
            ))}
          </div>

          {/* Popular & New Arrival */}
          <div className='flexStart gap-2 my-2'>
            <input
              onChange={() => setPopular(prev => !prev)}
              checked={popular}
              type="checkbox"
              id='popular'
            />
            <label htmlFor="popular" className='cursor-pointer'>Add to popular</label>
          </div>

          <div className='flexStart gap-2 mb-4'>
            <input
              onChange={() => setNewArrival(prev => !prev)}
              checked={newArrival}
              type="checkbox"
              id='newArrival'
            />
            <label htmlFor="newArrival" className='cursor-pointer'>Mark as New Arrival</label>
          </div>

          {/* Submit */}
          <button type='submit' className='btn-dark mt-3 max-w-44 sm:w-full'>
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}

export default Add