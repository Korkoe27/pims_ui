import React from 'react';
import Logo from './Logo';
import { Link, NavLink } from 'react-router-dom';
import { HiUser } from "react-icons/hi2";
import { Sidebar_links } from '../extras/data.js';
import { useAuth } from '../hooks/AuthProvider';




const Sidebar = () => {


  const { user, logOut } = useAuth();

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-blue-900 font-bold text-md my-2 bg-[#e3effc]';

  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-black font-normal text-md hover:bg-[#e3effc] my-2';

  return (

    
    <div className="w-72  bg-white fixed flex flex-col shadow-lg h-screen overscroll-contain md:overflow-hidden overflow-auto md:hover:overflow-auto">
      <div className="">
      <Link to="" onClick={() => {}} className="items-center text-xl gap-3 ml-3 mt-4">
      <Logo displayType='flex'/>
      </Link>
      </div>
      <div className='mt-10 border border-l-0 border-t-0 border-r-0 border-b-[#f0f2f5]'>
        {Sidebar_links.map((item) => (
          <NavLink
           to={item.path}
           key={item.name}
          //  onClick={() => {}}
           className={({ isActive }) =>
          isActive ? activeLink : normalLink}
          >
            {item.icon}
            <span className='capitalize'>
              {item.name}
            </span>
            <span className={`${item.name !== "appointments" ? "hidden" : "flex bg-[#f0f2f5] w-[2rem] h-[1.5rem] justify-center items-center rounded-full font-medium text-[#344054] text-[0.75rem] relative top-0 right-0 transform translate-x-[100%]"}`}>9</span>

          </NavLink>
        ))} 




    </div>
    <div className="flex gap-3 bottom-0 absolute p-6 items-center">
      <span className="rounded-full bg-[#ffece5] w-10 h-10 p-3">
      <HiUser />
      </span>
      <span className='flex flex-col gap-1'>
        <h4 className="text-[#101928] text-center text-base font-semibold">{user?.first_name || "User"}</h4>
        <p className="text-[#475367] text-center text-base font-normal">Optometrist</p>
      </span>
      <span className="">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.25 3.333a.833.833 0 0 0 0-1.667H5A3.333 3.333 0 0 0 1.667 5v10A3.333 3.333 0 0 0 5 18.333h1.25a.833.833 0 0 0 0-1.666H5c-.92 0-1.667-.747-1.667-1.667V5c0-.92.746-1.667 1.667-1.667h1.25z" fill="#000"/>
        <path d="M18.922 10.59a.833.833 0 0 0 0-1.18L15.59 6.078a.833.833 0 1 0-1.178 1.179l1.91 1.91H6.667a.833.833 0 0 0 0 1.667h9.654l-1.91 1.91a.833.833 0 0 0 1.178 1.18l3.333-3.334z" fill="#000"/>
        </svg>

      </span>
    </div>
    </div>
  )
}

export default Sidebar
