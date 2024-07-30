import React from 'react';
import Logo from './Logo';
import { Link, NavLink } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { MdOutlineRestorePage } from "react-icons/md";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuUsers2 } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { Sidebar_links } from '../extras/data';




const Sidebar = () => {

  function getLinks(item) {
    return [item.name,item.icon, item.path].join(" ");
  }

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-blue-900 font-bold text-md my-2 bg-[#e3effc]';

  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-black font-normal text-md hover:bg-[#e3effc] my-2';

  return (

    
    <div className="w-[270px] bg-white shadow-lg h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      <div className="">
      <Link to="/" onClick={() => {}} className="items-center text-xl gap-3 ml-3 mt-4">
      <Logo displayType='flex'/>
      </Link>
      </div>
      <div className='mt-10 border border-l-0 border-t-0 border-r-0 border-b-[#f0f2f5]'>
        {Sidebar_links.map((item) => (
          <NavLink
           to={item.path}
           key={item.name}
           onClick={() => {}}
           className={({ isActive }) =>
          isActive ? activeLink : normalLink}
          >
            {item.icon}
            <span className='capitalize'>
              {item.name}
            </span>
            <span className={`${item.name != "appointments" ? "hidden" : "flex bg-[#f0f2f5] w-[20px] justify-center rounded-[10px] relative font-medium text-[#344054]   text-[12px] right-[-100px] h-[17px]"}`}>9</span>
          </NavLink>
        ))} 




    </div>
    </div>
  )
}

export default Sidebar
