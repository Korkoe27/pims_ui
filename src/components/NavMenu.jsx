import React from 'react'
import { Consultation_nav } from '../extras/data'
import { NavLink } from 'react-router-dom';
import { IoIosCheckmarkCircle } from "react-icons/io";

const NavMenu = () => {

  const activeLink = 'text-[#2f3192] text-base underline decoration-[#2f3192] decoration-[5px] font-bold underline-offset-[5px]';

  const normalLink = 'text-base text-black font-normal';
  return (
    <div className='flex items-center gap-16'>


        {Consultation_nav.map((item)=>(
          <NavLink
            to={item.link}
            key={item.name}
            onClick={()=>{}}
            className={({isActive}) => isActive ? activeLink : normalLink}>
              <span className='flex justify-center'>
              <IoIosCheckmarkCircle size={20} color='#0f973d' /></span>
              <span className='capitalize'>{item.name}</span>
          </NavLink>
        ))}
    
    </div>
  )
}

export default NavMenu
