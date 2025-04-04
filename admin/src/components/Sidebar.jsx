import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSquarePlus } from 'react-icons/fa6';
import { MdFactCheck } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { FaListAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className='max-sm:flexCenter max-xs:pb-3 rounded bg-white pb-3 sm:w-1/5 sm:min-h-screen'>
      <div>
        {/*logo*/}
        <Link to={'/'}>Glams<span>Closet</span></Link>
        <div>
          <NavLink>
            <FaSquarePlus/>
            <div className='text-5xl'>Add Item</div>
          </NavLink>
          <div>
            <button>
              <FiLogOut/>
              <div>Logout</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar