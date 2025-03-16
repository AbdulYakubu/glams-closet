import React from 'react'
import { FaDiscord, FaFacebook, FaInstagram, FaLocationDot, FaPhone, FaQuestion, FaSnapchat, FaTiktok, FaTwitter, FaWhatsapp, FaX } from 'react-icons/fa6'
import {FaMailBulk} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer>
      <div className='max-padd-container flex items-start justify-between flex-col lg:flex-row gap-8 py-6 mb-7 bg-primary'>
        <div>
          <h4 className='h4'>We are always here to help</h4>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
        </div>
        <div className=' flexStart flex-wrap gap-8'>
          <div className='flexCenter gap-x-6'>
            <FaLocationDot/>
            <div>
              <h5 className='h5'>Location</h5>
              <p>Koforidua Zongo</p>
            </div>
          </div>
          <div className='flexCenter gap-x-6'>
            <FaPhone />
            <div>
              <h5 className='h5'>Phone</h5>
              <p>+233 542 271 847</p>
            </div>
          </div>
          <div className='flexCenter gap-x-6'>
            <FaMailBulk/>
            <div>
              <h5 className='h5'>Email Support</h5>
              <p>yakubuabdulaziz641@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className='max-padd-container flex items-start justify-between flex-wrap gap-12 mt-12'>
        {/*logo leftside*/}
        <div className='flex flex-col max-w-sm gap-y-5'>
          <div className='bold-32'>
            Glams<span className='text-secondary'>Closet</span>
          </div>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. </p>
          <div className="flexStart gap-7 xl:gap-x-36 flex-wrap grid grid-cols-3">
  {/* Customer Service Section */}
  <ul>
    <h4 className="h4 mb-3">Customer Service</h4>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Help Center</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Payment Methods</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Contact</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Shipping Status</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Complaints</a>
    </li>
  </ul>

  {/* Legal Section */}
  <ul>
    <h4 className="h4 mb-3">Legal</h4>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Privacy Policy</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Cookie Settings</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Terms and Conditions</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Cancellation</a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14">Imprint</a>
    </li>
  </ul>

  {/* Social Section */}
  <ul>
    <h4 className="h4 mb-3">Social</h4>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaWhatsapp /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaSnapchat /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaInstagram /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaTwitter /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaTiktok /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaDiscord /></a>
    </li>
    <li className="my-2">
      <a href="" className="text-gray-30 regular-14"><FaFacebook /></a>
    </li>
  </ul>
</div>
        </div>
      </div>
      {/*copyrights*/}
      <p className='max-padd-container bg-primary medium-14 py-2 px-8 rounded flexBetween'>
        <span>2025 Glams Closet</span>
        <span>
          All rights reserved
        </span>
      </p>
    </footer>
  )
}

export default Footer