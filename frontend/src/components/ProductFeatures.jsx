import React from 'react'
import { RiSecurePaymentLine } from 'react-icons/ri'
import { TbArrowBackUp, TbTruckDelivery } from 'react-icons/tb'
import { motion } from 'framer-motion'
import Title from './Title' // adjust path if needed

const featureItems = [
  {
    icon: <TbArrowBackUp className="text-2xl text-amber-600" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy. Change your mind? We'll make it right.",
    color: "bg-amber-50"
  },
  {
    icon: <TbTruckDelivery className="text-2xl text-rose-600" />,
    title: "Fast Delivery",
    description: "Express shipping available. Most orders delivered within 2-3 business days.",
    color: "bg-rose-50"
  },
  {
    icon: <RiSecurePaymentLine className="text-2xl text-indigo-600" />,
    title: "Secure Payment",
    description: "Industry-standard encryption protects all transactions. Shop with confidence.",
    color: "bg-indigo-50"
  }
]

const ProductFeatures = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="mb-10 text-center">
          <Title
            title1="Why Shop"
            title2="With Us"
            titleStyles="mb-6"
            title1Styles="text-gray-900"
            paraStyles="text-gray-600"
            subtitle="Enjoy a seamless shopping experience with our top-tier service guarantees."
          />
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featureItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`${item.color} p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-white shadow-xs">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProductFeatures