import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FaStar, FaStarHalfStroke, FaTruckFast } from 'react-icons/fa6'
import { FaHeart } from 'react-icons/fa'
import { TbShoppingBagPlus } from 'react-icons/tb'
import { motion } from 'framer-motion'
import ProductDescription from '../components/ProductDescription'
import ProductFeatures from '../components/ProductFeatures'
import RelatedProducts from '../components/RelatedProducts'
import Footer from '../components/Footer'
import { Helmet } from 'react-helmet'
import Title from '../components/Title'

const Product = () => {
    const { productId } = useParams()
    const { products, currency, addToCart, updateWishlist } = useContext(ShopContext)
    const [product, setProduct] = useState(null)
    const [image, setImage] = useState("")
    const [size, setSize] = useState("")
    const [wishlistActive, setWishlistActive] = useState(false)
    const [selectedThumbnail, setSelectedThumbnail] = useState(0)

    useEffect(() => {
        const selectedProduct = products.find((item) => item._id === productId)
        if (selectedProduct) {
            setProduct(selectedProduct)
            setImage(selectedProduct.image[0])
            document.title = `${selectedProduct.name} | GlamsClost`
        }
    }, [productId, products])

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full"
                />
            </div>
        )
    }

    const handleWishlistClick = () => {
        updateWishlist(product._id)
        setWishlistActive(!wishlistActive)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    return (
        <>
            <Helmet>
                <title>{product.name} | GlamsClost</title>
                <meta name="description" content={product.description.substring(0, 160)} />
            </Helmet>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    
                    {/* Title Component */}
                    <Title 
                        title1="Product" 
                        title2="Details" 
                        titleStyles="text-center mb-16"
                        title1Styles="text-gray-900"
                        paraStyles="text-gray-600"
                        subtitle={`Check out the full details of ${product.name}, including sizes, features, and related picks.`}
                    />

                    {/* Product data */}
                    <motion.div 
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 backdrop-blur-sm bg-opacity-90"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 p-8">
                            
                            {/* Product Image */}
                            <motion.div 
                                variants={itemVariants}
                                className="flex-1 flex flex-col lg:flex-row gap-6"
                            >
                                <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
                                    {product.image.map((item, i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                                                selectedThumbnail === i 
                                                    ? 'border-gray-900 ring-2 ring-gray-900/20' 
                                                    : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                            onClick={() => {
                                                setImage(item)
                                                setSelectedThumbnail(i)
                                            }}
                                        >
                                            <img
                                                src={item}
                                                alt={`Product thumbnail ${i + 1}`}
                                                className="h-20 w-20 object-cover"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={image}
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 order-1 lg:order-2"
                                >
                                    <div className="border-2 border-gray-100 rounded-xl bg-white flex items-center justify-center p-8 h-full shadow-inner">
                                        <img 
                                            src={image} 
                                            alt={product.name} 
                                            className="max-h-96 object-contain transition-opacity duration-300"
                                        />
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Product Info */}
                            <motion.div 
                                variants={itemVariants}
                                className="flex-1"
                            >
                                <div className="border-b border-gray-100 pb-6 mb-6">
                                    <motion.h1 
                                        initial={{ x: -10 }}
                                        animate={{ x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="text-3xl font-medium text-gray-900 tracking-tight"
                                    >
                                        {product.name}
                                    </motion.h1>
                                    <div className="flex items-center mt-3">
                                        <div className="flex text-yellow-500 mr-2">
                                            {[...Array(4)].map((_, i) => (
                                                <FaStar key={i} className="w-4 h-4" />
                                            ))}
                                            <FaStarHalfStroke className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-gray-600">122 reviews</span>
                                    </div>
                                </div>

                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8"
                                >
                                    <p className="text-2xl font-medium text-gray-900">{currency}{product.price}.00</p>
                                    <p className="text-gray-700 mt-3 leading-relaxed">{product.description}</p>
                                </motion.div>

                                {/* Size selection */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="mb-8"
                                >
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {[...product.sizes].sort((a, b) => {
                                            const order = ["S", "M", "L", "XL", "XXL"]
                                            return order.indexOf(a) - order.indexOf(b)
                                        }).map((item, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSize(item)}
                                                className={`px-4 py-2 border-2 rounded-md text-sm font-medium transition-all ${
                                                    item === size
                                                        ? "bg-gray-900 text-white border-gray-900"
                                                        : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
                                                }`}
                                            >
                                                {item}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Buttons */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="flex items-center gap-3 mb-8"
                                >
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => addToCart(product._id, size)}
                                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-md"
                                    >
                                        <TbShoppingBagPlus className="text-lg" />
                                        Add to Cart
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleWishlistClick}
                                        className={`p-3 border-2 rounded-lg transition-colors duration-200 shadow-sm ${
                                            wishlistActive 
                                                ? "text-red-500 border-red-500 bg-red-50" 
                                                : "text-gray-400 border-gray-200 hover:text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <FaHeart />
                                    </motion.button>
                                </motion.div>

                                {/* Delivery Info */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="border-t border-gray-100 pt-6"
                                >
                                    <div className="flex items-center gap-3 text-gray-700 mb-3">
                                        <FaTruckFast className="text-gray-500 text-lg" />
                                        <span className="text-sm">Free delivery on orders over GHS 2000</span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                            Authenticity You Can Trust
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                            Enjoy Cash on Delivery for Your Convenience
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Product details sections */}
                    <motion.div 
                        variants={containerVariants}
                        className="mt-12 space-y-12"
                    >
                        <motion.div variants={itemVariants}>
                            <ProductDescription />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <ProductFeatures />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <RelatedProducts 
                                category={product.category} 
                                subCategory={product.subCategory} 
                            />
                        </motion.div>
                    </motion.div>
                </div>

                <Footer />
            </motion.div>
        </>
    )
}

export default Product