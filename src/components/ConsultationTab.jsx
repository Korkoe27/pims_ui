import React from 'react'
import { Consultation_nav } from '../extras/data'
import { NavLink } from 'react-router-dom'

const ConsultationTab = () => {

  const activeLink = 'text-[#2f3192] text-base underline decoration-[#2f3192] decoration-[5px] font-bold underline-offset-[5px]';

  const normalLink = 'text-base text-black font-normal';
  return (
    <div className='flex items-center gap-16 p-0'>
      
        {Consultation_nav.map((item)=>(
          <NavLink
            to={item.path}
            key={item.name}
            onClick={()=>{}}
            className={({isActive}) => isActive ? activeLink : normalLink}>
          </NavLink>
        ))}
    
    </div>
  )
}

export default ConsultationTab
