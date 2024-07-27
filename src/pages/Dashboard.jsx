import React from 'react'
import { CiSearch } from "react-icons/ci";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";

const Dashboard = () => {
  return (
    <div className='px-[32px] bg-[#f9fafb] w-full'>
      
      <div className="dashboard_header grid  items-center grid-cols-12 h-[10%] ">
        <div className='col-span-6'>
          <h2 className='text-2xl font-bold grid-'>Good {`${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}`}, <span>Korkoe</span>👋🏾</h2>
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

      <div className='flex justify-between'>
        <div className='bg-[#ececf9] p-[16px] h-[138px] w-[340px]'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
            <LuUsers2/>
            Today's Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#2f3192]'>9</span>
           
        </div>
        <div className='bg-[#fbeae9] p-[16px] h-[138px] w-[340px]'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
          <LuClock3 />
            Pending Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#d42620]'>5</span>
           
        </div>
        <div className='bg-[#e7f6ec] p-[16px] h-[138px] w-[340px]'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
            <FiUserCheck/>
            Completed Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#0f973d]'>4</span>
           
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