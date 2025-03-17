import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Testimonial from './pages/Testimonial'
import Product from './pages/Product'

const App = () => {
  return (
    <main className='overflow-hidden text-[#404040]'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/testimonial' element={<Testimonial />} />
        <Route path='/product/:productId' element = {<Product/>} />
        
      </Routes>
    </main>
  )
}

export default App
