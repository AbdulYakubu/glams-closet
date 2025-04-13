import React, { useState } from 'react';
import Upload from '../assets/upload_icon.png';
import axios from 'axios';
import { backend_url, currency } from '../App';
import { toast } from 'react-toastify';

const Add = () => {
  // State management
  const [images, setImages] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    popular: false,
    newArrival: false,
    sizes: [],
  });
  const [loading, setLoading] = useState(false);

  // Available options
  const categories = ['Men', 'Women', 'Kids'];
  const subCategories = ['Topwear', 'Bottomwear', 'Winterwear'];
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(item => item !== size) 
        : [...prev.sizes, size]
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { name, description, price, category, subCategory } = formData;

    if (!name || !description || !price || !category || !subCategory) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error("You are not authenticated.");
        return;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'sizes') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      // Add current date
      data.append('date', new Date().getTime());

      // Add images
      images.forEach((img, index) => {
        if (img) data.append(`image${index + 1}`, img);
      });

      const response = await axios.post(
        `${backend_url}/api/product/add`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Men',
      subCategory: 'Topwear',
      popular: false,
      newArrival: false,
      sizes: [],
    });
    setImages([null, null, null, null]);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Add New Product</h2>
        
        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Product Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">Subcategory *</label>
              <select
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              >
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price *</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₵</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Available Sizes</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {sizeOptions.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-md border ${formData.sizes.includes(size) 
                      ? 'bg-indigo-600 text-white border-indigo-700' 
                      : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <label htmlFor={`image-${index}`} className="block aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-500 overflow-hidden">
                    {image ? (
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <img src={Upload} alt="Upload" className="w-10 h-10 mb-2" />
                        <span className="text-xs">Image {index + 1}</span>
                      </div>
                    )}
                  </label>
                  <input
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                    className="sr-only"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => handleImageChange(index, null)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                id="popular"
                name="popular"
                type="checkbox"
                checked={formData.popular}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">Popular Product</label>
            </div>

            <div className="flex items-center">
              <input
                id="newArrival"
                name="newArrival"
                type="checkbox"
                checked={formData.newArrival}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="newArrival" className="ml-2 block text-sm text-gray-700">New Arrival</label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;