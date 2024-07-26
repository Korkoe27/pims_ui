import React from 'react'
import { CiSearch } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";

const Dashboard = () => {
  return (
    <div className='px-[32px] bg-[#f9fafb] w-full'>
      
      <div className="dashboard_header grid  items-center grid-cols-12 h-[10%] ">
        <div className='col-span-6'>
          <h2 className='text-2xl font-bold grid-'>Good {`${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}`}, <span>Korkoe</span>👋🏾</h2>
        </div>
        


        <div className='flex items-center col-span-4 px-2 border  rounded-[6px] w-[375px] border-[#d0d5dd]'>
          <CiSearch title='Search' className='w-[20px] h-[20px] bg-white cursor-pointer'/>
          <input type="search" name="search" placeholder='Search' className='flex-grow p-4 focus:outline-none' />
        </div>
        <div className='flex justify-between col-span-2 '>
          <div>
            <button className='flex items-center text-white bg-[#2f3192] gap-[10px] rounded-[6px] p-[13px]'><IoMdAdd/>Add New Patient</button>
          </div>
          <div className='flex justify-evenly col-span-1 items-center '>
            <div className='bg-[#ffe7cc] p-[9px] rounded-[200px]'>
           <span className='w-[45px] h-[18px] text-[15px] font-[500]'>KD</span>   
            </div>
            <FaChevronDown title="Menu"className='cursor-pointer font-800 h-[24px]'/>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard




{/* <CiSearch /> */}
{/* <CiClock2 /> */}
{/* <FiUserCheck /> */}
{/* <IoMdAdd /> */}
//  <LuUsers2/>
{/* <FaChevronDown /> */}

// 👋🏾