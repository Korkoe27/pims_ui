import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { GrAdd } from "react-icons/gr";
import { FaChevronDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import PatientModal from "../components/PatientModal";

const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="px-[32px] bg-[#f9fafb] w-full">
     {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
      
      <div className="dashboard_header grid  items-center grid-cols-12 h-[10%] ">
        <div className='col-span-4'>
          <h2 className='text-2xl font-bold grid-'>Good {`${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}`}, <span>Korkoe</span>👋🏾</h2>
        </div>
        


        <div className='flex items-center col-span-4 px-2 border  rounded-[6px] w-full border-[#d0d5dd]'>
          <CiSearch title='Search' className='w-[20px] h-[20px] bg-white cursor-pointer'/>
          <input type="search" name="search" placeholder='Search' className='flex-grow p-4 focus:outline-none' />
        </div>
        <div className='flex justify-end gap-5 col-span-4 '>
          <div className='flex items-center '>
            <button className='flex items-center p-[10px] text-white bg-[#2f3192] gap-[10px] rounded-[6px]'
            // ref={trigger}
            onClick={openModal}
            ><GrAdd/>Add New Patient</button>
          </div>    
           
          

          <div className='flex justify-between gap-3 items-center '>
            <div className='bg-[#ffe7cc] p-[9px] rounded-[200px]'>
           <span className='w-[45px] h-[18px] text-[15px] font-[500]'>KD</span>   
            </div>
            <FaChevronDown title="Menu"className='cursor-pointer font-800 h-[24px]'/>
          </div>
        </div>
      </div>



      <div className='flex justify-between'>
        <div className='bg-[#ececf9] p-[15px] h-[130px] w-auto'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
            <LuUsers2/>
            Today's Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#2f3192]'>9</span>
           
        </div>
        <div className='bg-[#fbeae9] p-[15px] h-[130px] w-auto'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
          <LuClock3 />
            Pending Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#d42620]'>5</span>
           
        </div>
        <div className='bg-[#e7f6ec] p-[15px] h-[130px] w-auto'>
          <h3 className='flex items-center text-[18px] gap-[12px] font-medium'>
            <FiUserCheck/>
            Completed Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#0f973d]'>4</span>
           
        </div>
      </div>

      <div>
        

<div className="my-[20px]">

  <div className='flex justify-between my-[15px]'>
    <h2 className='font-bold text-[12px]'>Upcoming Appointments</h2>
    <a href="#" className='text-[#2f3192] text-right  font-semibold'>See all</a>
  </div>
    <table className="w-full">
        
        <thead className=" text-black uppercase text-left h-[55px]  bg-[#f0f2f5]">
            <tr className='rounded-[8px]'>
                <th scope="col" className="px-3 py-3">
                    Date
                </th>
                <th scope="col" className="px-3 py-3">
                Patient’s ID
                </th>
                <th scope="col" className="px-3 py-3">
                    Name
                </th>
                <th scope="col" className="px-3 py-3">
                Patient Type
                </th>
                <th scope="col" className="px-3 py-3">
                    <span className="sr-only"></span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-1 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Old
                </td>
                <td className="py-3 flex  justify-end gap-[45px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                <Link to="#" className='font-medium text-[#2f3192] px-[16px] flex justify-center py-[8px] border border-solid rounded-[8px] w-[50px] border-[#2f3192]'>Edit</Link>
                    <Link to='#' className='text-white bg-[#2f3192] px-[16px] py-[8px] rounded-[8px]'>Atten to Patient</Link>
                </td>
            </tr>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                10-07-2024
                </td>
                <td className="px-3 py-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/24
                </td>
                <td className="px-3 py-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Kwabena Debrah
                </td>
                <td className="px-1 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Old
                </td>
                <td className="py-4 flex  justify-end gap-[45px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                    {/* <a href="#" className="font-medium text-[#2f3192] px-[16px] py-[8px] border rounded-[8px] w-[50px] border-[#2f3192]">Edit</a>  */}
                    <Link to="#" className='font-medium text-[#2f3192] px-[16px] flex justify-center py-[8px] border border-solid rounded-[8px] w-[50px] border-[#2f3192]'>Edit</Link>
                    <Link to='#' className='text-white bg-[#2f3192] px-[16px] py-[8px] rounded-[8px]'>Atten to Patient</Link>
                </td>
            </tr>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                27-07-2024
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/30
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Frimpong B.O Dapaah
                </td>
                <td className="px-1 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                New
                </td>
                <td className="py-3 flex  justify-end gap-[45px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                <Link to="#" className='font-medium text-[#2f3192] px-[16px] flex justify-center py-[8px] border border-solid rounded-[8px] w-[50px] border-[#2f3192]'>Edit</Link>
                <Link to='#' className='text-white bg-[#2f3192] px-[16px] py-[8px] rounded-[8px]'>Atten to Patient</Link>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div className="my-[20px]">

  <div className='flex justify-between my-[15px]'>
    <h2 className='font-bold text-[12px]'>Recent Patient Activity</h2>
    <a href="#" className='text-[#2f3192] text-right  font-semibold'>See all</a>
  </div>
    <table className="w-full">
        
        <thead className=" text-black uppercase text-left rounded-[8px] h-[55px] bg-[#f0f2f5]">
            <tr>
                <th scope="col" className="px-3 py-3">
                    Date
                </th>
                <th scope="col" className="px-3 py-3">
                Patient’s ID
                </th>
                <th scope="col" className="px-3 py-3">
                    Name
                </th>
                <th scope="col" className="px-3 py-3">
                Diagnosis
                </th>
                <th scope="col" className="px-3 py-3">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Allergic Conjunctivitis
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#e7f6ec] text-[#036b26] capitalize text-xs font-medium me-2 py-[4px] px-[12px] rounded-[12px]">completed</span>
                </td>
            </tr>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Refractive Error
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#e7f6ec] text-[#036b26] capitalize text-xs font-medium me-2 py-[4px] px-[12px] rounded-[12px]">completed</span>
                </td>
            </tr>
            <tr className="text-left">
                <td className="border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Anterior Uveitis
                </td>
                <td className="px-1 py-3 my-[10px] border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#fbeae9] text-[#9e0a05] capitalize text-xs font-medium me-2 py-[4px] px-[12px] rounded-[12px]">referred</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>

      </div>
  
      
    </div>
  )
}

export default Dashboard



