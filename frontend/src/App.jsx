import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Testimonial from './pages/Testimonial'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlaceOrder from './pages/PlaceOrder'

const App = () => {
  return (
    <main className='overflow-hidden text-[#404040]'>
      <ToastContainer/>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/testimonial' element={<Testimonial />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart/>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path='/place-order' element={ <PlaceOrder/>} />
        
      </Routes>
    </main>
  )
}

export default App
