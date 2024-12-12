import React, {useRef, useEffect, useState} from 'react'
import { CiSearch } from "react-icons/ci";
import { LuUsers2 } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { Form } from 'react-router-dom';

const SearchModalUnfilled = ({setSearchModalVisibility}) => {


    const specificElementRef = useRef(null);

    const [selectedFilters, setSelectedFilters] = useState({
        date: false,
        name: false,
        diagnosis: false
      });
    
      // Function to toggle the selection of a filter
      const toggleSelection = (filter) => {
        setSelectedFilters(prev => ({
          ...prev,
          [filter]: !prev[filter]
        }));
      };
    

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape'){
                setSearchModalVisibility(false);
            }
        };
        const handleClickOutside = (event) => {
            if(
                specificElementRef.current && 
                !specificElementRef.current.contains(event.target)
            ){
                setSearchModalVisibility(false);
            }
        };
        window.addEventListener('keydown',handleEscape);
        window.addEventListener('mousedown',handleClickOutside);

        return () =>{
            window.removeEventListener('keydown',handleEscape);
            window.removeEventListener('mousedown',handleClickOutside);
        };
    },
    [setSearchModalVisibility]);
    


  return (
    <Form 
    className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] '
    >
        <dialog ref={specificElementRef} className=
         "bg-white flex p-8 rounded-lg flex-col my-20 m-auto w-[775px] border h-[616px] justify-start modal-overlay">
            <div className='flex rounded-lg justify-start p-4 items-center h-[5rem] w-full border border-[#d0d5dd]'>
            <CiSearch title='Search' className='w-[20px] h-[20px] opacity-30 bg-white cursor-pointer'/>
                <input type="search" name="" autoFocus placeholder='Search' className=' border-none p-4 flex-grow w-full h-full focus:outline-none' id="" />
            </div>

            <div className='flex flex-col my-6 pb-4 gap-2 justify-center items-stretch border border-l-0 border-t-0 border-r-0 border-b-[#dee3e7]'>
                <h3 className='text-sm text-left py-2 text-[#00000080]'>Filter results</h3>
                <div className='flex justify-normal gap-4 mb-6'>
                <span
                className={`flex items-center gap-1 border rounded-lg w-30 px-2 py-2 justify-center filters ${selectedFilters.date ? 'border-red-500 text-red-500' : 'text-[#667185] border-[#d0d5dd]'} cursor-pointer`}
                    onClick={() => toggleSelection('date')}
                    >
                    <IoCalendarClearOutline />
                    Date
                    <IoClose className={`ml-1 ${selectedFilters.date ? 'flex' : 'hidden'} closeFilter`} />
                    </span>
                    <span
                        className={`flex items-center gap-1 border rounded-lg w-30  px-2 py-2 justify-center filters ${selectedFilters.name ? 'border-red-500 text-red-500' : 'text-[#667185] border-[#d0d5dd]'} cursor-pointer`}
                        onClick={() => toggleSelection('name')}
                        >
                    <LuUsers2/>
                    Name
                    <IoClose className={`ml-1 ${selectedFilters.name ? 'flex' : 'hidden'} closeFilter`} />
                    </span>
                    <span
                        className={`flex items-center gap-1 border rounded-lg w-30 px-2 py-2 justify-center filters ${selectedFilters.diagnosis ? 'border-red-500 text-red-500' : 'text-[#667185] border-[#d0d5dd]'} cursor-pointer`}
                        onClick={() => toggleSelection('diagnosis')}
                        >
                    <LuPencil/>
                    Diagnosis
                    <IoClose className={`ml-1 ${selectedFilters.diagnosis ? 'flex' : 'hidden'} closeFilter`} />
                    </span>
                </div>

            </div>

            <div >
                <h3 className='text-sm text-[#00000080] my-4'>Recent Searches</h3>

            <div className='flex items-center justify-normal gap-8'>
                <div className='flex items-center gap-3 justify-center'>
                    <span className='w-10 h-10 bg-[#ececf9] flex items-center justify-center rounded-full font-semibold text-base text-[#101928]'>KD</span>
                    <span className='text-black font-normal text-base'>Korkoe Dumashie</span>
                </div>
                <div className='flex items-center gap-3 justify-center'>
                    <span className='w-10 h-10 bg-[#ececf9] flex items-center justify-center rounded-full font-semibold text-base text-[#101928]'>JD</span>
                    <span className='text-black font-normal text-base'>Jane Doe</span>
                </div>
            </div>
                
            </div>
            
        </dialog>


    </Form>
  )
}

export default SearchModalUnfilled
