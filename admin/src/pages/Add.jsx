import React, { useState } from "react";
import Upload from "../assets/upload_icon.png";
import axios from "axios";
import { backend_url, currency } from "../App";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";

const Add = () => {
  // State management
  const [images, setImages] = useState([null, null, null, null]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Bags",
    subCategory: "Handbags",
    popular: false,
    newArrival: false,
    sizes: [],
  });
  const [loading, setLoading] = useState(false);

  // Available options
  const categories = [
    "Bags",
    "Perfumes and Self Care Products",
    "Egypt Abaya",
    "Dubai Abaya",
    "Ready to Wear",
    "Cuft Packages",
    "Khimars",
    "Veils and Hijab Accessories",
  ];

  const subCategories = {
    Bags: ["Handbags", "Tote Bags", "Clutches", "Backpacks", "Travel Bags"],
    "Perfumes and Self Care Products": [
      "Women's Perfumes",
      "Men's Perfumes",
      "Luxury Fragrances",
      "Body Care",
      "Hair Care",
    ],
    "Egypt Abaya": ["Traditional", "Modern", "Embroidered"],
    "Dubai Abaya": ["Luxury", "Designer", "Open Style"],
    "Ready to Wear": ["Casual", "Formal", "Party Wear"],
    "Cuft Packages": ["Premium", "Deluxe", "Standard"],
    Khimars: ["Traditional", "Modern", "Embroidered"],
    "Veils and Hijab Accessories": [
      "Hijabs",
      "Under Scarves",
      "Pins and Accessories",
    ],
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "category" && { subCategory: subCategories[value][0] }), // Reset subcategory when category changes
    }));
  };

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
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
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You are not authenticated.");
        return;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "sizes") {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      // Add current date
      data.append("date", new Date().getTime());

      // Add images
      images.forEach((img, index) => {
        if (img) data.append(`image${index + 1}`, img);
      });

      const response = await axiosInstance.post("/api/product/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          headers: `Bearer ${token}`,
        },
      });

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
      name: "",
      description: "",
      price: "",
      category: "Bags",
      subCategory: "Handbags",
      popular: false,
      newArrival: false,
      sizes: [],
    });
    setImages([null, null, null, null]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h2 className="text-3xl font-bold text-center">Add New Product</h2>
          <p className="text-center text-indigo-100 mt-2">
            Fill in the details below to add a new product
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="p-6 space-y-6">
          {/* Product Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                placeholder="Enter product name"
                required
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                placeholder="Provide detailed product description"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label
                htmlFor="subCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subcategory *
              </label>
              <select
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                required
              >
                {subCategories[formData.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price *
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currency}</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Sizes
              </label>
              <div className="mt-1 flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      formData.sizes.includes(size)
                        ? "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (Max 4)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              First image will be used as the main display image
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`image-${index}`}
                    className={`block aspect-square w-full rounded-lg border-2 border-dashed ${
                      image
                        ? "border-transparent"
                        : "border-gray-300 hover:border-indigo-400"
                    } cursor-pointer overflow-hidden transition-all`}
                  >
                    {image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-xs">Image {index + 1}</span>
                      </div>
                    )}
                  </label>
                  <input
                    id={`image-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="sr-only"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={() => handleImageChange(index, null)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex items-center">
              <input
                id="popular"
                name="popular"
                type="checkbox"
                checked={formData.popular}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="popular"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Popular Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="newArrival"
                name="newArrival"
                type="checkbox"
                checked={formData.newArrival}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="newArrival"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                New Arrival
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="-ml-1 mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
