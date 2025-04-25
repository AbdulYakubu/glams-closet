import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const ShowSearch = () => {
    const { 
        search, 
        setSearch, 
        ShowSearch,
        products,
        setFilteredProducts
    } = useContext(ShopContext);
    
    const [visible, setVisible] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const location = useLocation();

    // Extract unique categories from products
    const categories = ['All Categories', ...new Set(products.map(product => product.category))];

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [location]);

    // Filter products based on search and category
    useEffect(() => {
        let filtered = products;
        
        // Apply category filter
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Apply search filter
        if (search) {
            const searchTerm = search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        
        setFilteredProducts(filtered);
    }, [search, selectedCategory, products, setFilteredProducts]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setShowCategories(false);
    };

    return ShowSearch && visible ? (
        <div className='py-4 pb-7'>
            <div className='text-center max-w-3xl mx-auto'>
                <div className='flex items-center bg-white rounded-full overflow-hidden shadow-sm'>
                    {/* Category Dropdown */}
                    <div className='relative'>
                        <button 
                            onClick={() => setShowCategories(!showCategories)}
                            className='flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-r border-gray-200'
                        >
                            {selectedCategory}
                            <FaChevronDown className='ml-2 text-xs' />
                        </button>
                        
                        {showCategories && (
                            <div className='absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg max-h-60 overflow-auto'>
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategorySelect(category)}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            selectedCategory === category 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Search Input */}
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search products...'
                        className='flex-1 border-none outline-none px-4 py-2 text-sm'
                    />
                    
                    {/* Search Button */}
                    <button className='px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors'>
                        <FaSearch />
                    </button>
                </div>
                
                {/* Active Filters */}
                {(search || selectedCategory !== 'All Categories') && (
                    <div className='flex justify-center items-center mt-3 space-x-2'>
                        {selectedCategory !== 'All Categories' && (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                Category: {selectedCategory}
                                <button 
                                    onClick={() => setSelectedCategory('All Categories')}
                                    className='ml-1.5 inline-flex text-blue-400 hover:text-blue-600'
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {search && (
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                                Search: "{search}"
                                <button 
                                    onClick={() => setSearch('')}
                                    className='ml-1.5 inline-flex text-gray-400 hover:text-gray-600'
                                >
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    ) : null;
};

export default ShowSearch;