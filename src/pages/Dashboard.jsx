import React, { useState} from 'react';
import { CiSearch } from "react-icons/ci";
import { LuClock3 } from "react-icons/lu";
import { FiUserCheck } from "react-icons/fi";
import { LuUsers2 } from "react-icons/lu";
import { GrAdd } from "react-icons/gr";
import { FaChevronDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import PatientModal from "../components/PatientModal";
import SearchModalUnfilled from '../components/SearchModalUnfilled';

const Dashboard = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);



  const [isSearchModalVisible, setSearchModalVisibility] = useState(false);
  const openSearchModal = () => {
    setSearchModalVisibility(true);
  };

  return (
    <div className="px-8 ml-72 flex flex-col mt-4 gap-8 bg-[#f9fafb] w-full">
     {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}
     {isSearchModalVisible && <SearchModalUnfilled setSearchModalVisibility={setSearchModalVisibility}/>}

      
      <div  className="dashboard_header grid  items-center grid-cols-12 h-[10%] ">
        <div className='col-span-4'>
          <h2 className='text-2xl font-bold grid-'>Good {`${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}`}, <span>Korkoe</span>👋🏾</h2>
        </div>
        


        <div className='flex items-center justify-start h-14 gap-5  col-span-4 w-90 border-[#d0d5dd]'>
          <div className='flex bg-white items-center text-left gap-0 w-full px-2  border  rounded-md'>
            <CiSearch title='Search' className='h-5 bg-white cursor-pointer'/>
          <input type="search" name="search" placeholder='Search' className=' p-4 focus:outline-none' 
          onClick={openSearchModal}
          />
          </div>
          
            
        </div>
        <div className='flex items-end justify-end gap-12 col-span-4 '>
      <div className='flex items-center'>
                  <button className='flex items-center p-4 h-14 text-white bg-[#2f3192] gap-2 rounded-md text-sm'
                  // ref={trigger}
                  onClick={openModal}
                  ><GrAdd/>Add New Patient</button>
                </div> 
          <div className='flex  justify-end gap-3 items-center '>
           <span className='bg-[#ffe7cc] px-5 py-2 w-14  h-14  text-[#3e3838] flex justify-center items-center rounded-[100%] font-semibold text-xl'>KD</span>   
            <FaChevronDown title="Menu"className='cursor-pointer font-800 h-6 w-6'/>
          </div>
        </div>
      </div>



      <div className='grid grid-cols-12 gap-9 w-full'>
        <div className='bg-[#ececf9] p-4 h-36 col-span-4 w-full'>
          <h3 className='flex items-center text-base gap-[12px] font-normal'>
            <LuUsers2 className='w-6 h-6'/>
            Today's Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#2f3192]'>9</span>
           
        </div>
        <div className='bg-[#fbeae9] p-4 h-36 w-full col-span-4'>
          <h3 className='flex items-center text-base gap-[12px] font-normal'>
          <LuClock3 className='w-6 h-6'/>
            Pending Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#d42620]'>5</span>
           
        </div>
        <div className='bg-[#e7f6ec] p-4 h-36 w-full flex flex-col col-span-4'>
          <h3 className='flex items-center text-base gap-[12px] font-normal'>
            <FiUserCheck className='w-6 h-6'/>
            Completed Appointments
          </h3>
          <span className='text-[50px] font-bold text-[#0f973d]'>4</span>
           
        </div>
      </div>

      <div>
        

        <div className='flex flex-col gap-20'>
          
<div className="">

  <div className='flex justify-between my-[15px]'>
    <h2 className='font-bold text-xl'>Upcoming Appointments</h2>
    <Link href="#" className='text-[#2f3192] text-right  font-semibold'>See all</Link>
  </div>
    <table className="w-full">
        
        <thead className=" text-black uppercase text-left h-16 bg-[#f0f2f5]">
            <tr className='rounded-lg'>
                <th scope="col" className="px-3 min-w-40 py-3 text-base font-semibold normal-case">
                    Date
                </th>
                <th scope="col" className="px-3 min-w-40 py-3 text-base font-semibold normal-case">
                Patient’s ID
                </th>
                <th scope="col" className="px-3 min-w-40 py-3 text-base font-semibold normal-case">
                    Name
                </th>
                <th scope="col" className="px-3 min-w-40 py-3 text-base font-semibold normal-case">
                Patient Type
                </th>
                <th scope="col" className="px-3 min-w-40 py-3 text-base font-semibold normal-case">
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Old
                </td>
                <td className="py-3 flex  justify-end gap-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                <Link to="#" className='font-medium text-[#2f3192] px-4 flex justify-center py-2 border border-solid rounded-lg w-14 border-[#2f3192]'>Edit</Link>
                    <Link to='#' className='text-white bg-[#2f3192] px-4 py-2 rounded-lg'>Attend to Patient</Link>
                </td>
            </tr>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                10-07-2024
                </td>
                <td className="px-3 py-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/24
                </td>
                <td className="px-3 py-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Kwabena Debrah
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Old
                </td>
                <td className="py-4 flex  justify-end gap-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                    <Link to="#" className='font-medium text-[#2f3192] px-4 flex justify-center py-2 border border-solid rounded-lg w-14 border-[#2f3192]'>Edit</Link>
                    <Link to='#' className='text-white bg-[#2f3192] px-4 py-2 rounded-lg'>Attend to Patient</Link>
                </td>
            </tr>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                27-07-2024
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/30
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Frimpong B.O Dapaah
                </td>
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                New
                </td>
                <td className="py-3 flex  justify-end gap-4 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9] items-center text-center">
                <Link to="#" className='font-medium text-[#2f3192] px-4 flex justify-center py-2 border border-solid rounded-lg w-14 border-[#2f3192]'>Edit</Link>
                <Link to='#' className='text-white bg-[#2f3192] px-4 py-2 rounded-lg'>Attend to Patient</Link>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<div className="my-5">

  <div className='flex justify-between my-4'>
    <h2 className='font-bold text-xl'>Recent Patient Activity</h2>
    <Link  className='text-[#2f3192] text-right  font-semibold'>See all</Link>
  </div>
    <table className="w-full">
        
        <thead className=" text-black uppercase text-left rounded-[8px] h-16 bg-[#f0f2f5]">
            <tr>
                <th scope="col" className="px-3 min-w-[168px] py-3 text-base font-semibold normal-case">
                    Date
                </th>
                <th scope="col" className="px-3 min-w-[168px] py-3 text-base font-semibold normal-case">
                Patient’s ID
                </th>
                <th scope="col" className="px-3 py-3 min-w-[168px] text-base font-semibold normal-case">
                    Name
                </th>
                <th scope="col" className="px-3 py-3 min-w-[168px] text-base font-semibold normal-case">
                Diagnosis
                </th>
                <th scope="col" className="px-3 py-3 min-w-[168px] text-base font-semibold normal-case">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Allergic Conjunctivitis
                </td>
                <td className="px-1 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#e7f6ec] text-[#036b26] capitalize text-base font-medium me-2 w-20 py-2 px-3 rounded-xl">completed</span>
                </td>
            </tr>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Refractive Error
                </td>
                <td className="px-1 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#e7f6ec] text-[#036b26] capitalize text-base font-medium me-2 py-2 w-20 px-3 rounded-xl">completed</span>
                </td>
            </tr>
            <tr className="text-left">
                <td className="px-3 py-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                07-05-2024
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                2122/10/22
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Korkoe A.K Dumashie
                </td>
                <td className="px-3 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                Anterior Uveitis
                </td>
                <td className="px-1 py-3 my-3 border border-l-0 border-t-0 border-r-0 border-b-[#d9d9d9]">
                <span className="bg-[#fbeae9] w-20 text-[#9e0a05] capitalize text-base font-medium me-2 py-[4px] px-[12px] rounded-xl">referred</span>
                </td>
            </tr>
        </tbody>
    </table>
</div>

      </div>
  
        </div>

      
    </div>
  )
}

export default Dashboard



