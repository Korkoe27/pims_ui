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

  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-black font-semibold text-md hover:bg-[#e3effc] my-2';

  return (

    
    <div className=" shadow-lg h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      <div className="">
      <Link to="/" onClick={() => {}} className="items-center text-xl gap-3 ml-3 mt-4">
      <Logo displayType='flex'/>
      </Link>
      </div>
      <div className='mt-10'>
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
          </NavLink>
        ))} 



    </div>
    </div>
  )
}

export default Sidebar
