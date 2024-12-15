// import React from 'react'
// import { CiSearch } from 'react-icons/ci'
// import { FaChevronDown } from 'react-icons/fa6'
// import { GrAdd } from 'react-icons/gr'

// const Navbar = () => {
//   return (
//           <div className="dashboard_header grid items-center grid-cols-12 h-[10%]">
//             <div className='col-span-4'>
//               <h2 className='text-2xl font-bold grid-'>
//                 Good {`${new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}`} , 
//                 <span>{user?.first_name  || "User"}</span> 👋🏾 
//               </h2>
//             </div>
            
//             <div className='flex items-center justify-end gap-5 h-14 col-span-7 w-90 border-[#d0d5dd]'>
//               <div className='flex bg-white items-center text-left gap-0 w-2/3 px-2 border rounded-md'>
//                 <CiSearch title='Search' className='h-5 bg-white cursor-pointer'/>
//                 <input type="search" name="search" readOnly placeholder='Search' className='p-4 focus:outline-none' 
//                   onClick={openSearchModal}
//                 />
//               </div>
//               <div className='flex items-center'>
//                 <button className='flex items-center p-4 h-14 text-white bg-[#2f3192] gap-2 rounded-md text-sm' 
//                   type='button'
//                   onClick={openModal}
//                 >
//                   <GrAdd/>Add New Patient
//                 </button>
//               </div>
//             </div>
//             <div className='relative flex items-end justify-end gap-12 col-span-1'>
//               <div className='flex justify-end gap-3 items-center'>
//                 <span className='bg-[#ffe7cc] px-5 py-2 w-14 h-14 text-[#3e3838] flex justify-center items-center rounded-[100%] font-semibold text-xl'>
//                   {`${user?.first_name[0] || 'K'}${user?.last_name[0] || 'D'}`} {/* Display user's initials */}
//                 </span>
//                 <FaChevronDown 
//                   title="Menu" 
//                   className='cursor-pointer font-800 h-6 w-6'
//                   onClick={toggleDropdown} // Toggle the dropdown
//                 />
//               </div>
//               {/* Dropdown for Logout */}
//               {isDropdownOpen && (
//                 <div className="absolute right-0 top-14 bg-white border rounded-lg p-2 shadow-lg">
//                   <form action="" 
//                   // onSubmit={handleLogout}
//                   >
//                     <button className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left" type="submit">
//                     Logout
//                   </button>
//                   </form>
                  
//                 </div>
//               )}
//             </div>
//           </div>
//   )
// }

// export default Navbar


import React from 'react'

const Navbar = () => {
  return (
    <div>
      
    </div>
  )
}

export default Navbar
