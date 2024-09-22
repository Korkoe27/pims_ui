import React from 'react'
import { Consultation_nav } from '../extras/data'
import { NavLink } from 'react-router-dom'

const NavMenu = () => {

  const activeLink = 'text-[#2f3192] text-base underline decoration-[#2f3192] decoration-[5px] font-bold underline-offset-[5px]';

  const normalLink = 'text-base text-black font-normal';
  return (
    <div className='flex ml- items-center gap-16 p-0'>
      
        {Consultation_nav.map((item)=>(
          <NavLink
            to={item.link}
            key={item.name}
            onClick={()=>{}}
            className={({isActive}) => isActive ? activeLink : normalLink}>
              <span className='capitalize'>{item.name}</span>
          </NavLink>
        ))}
    
    </div>
  )
}

export default NavMenu
