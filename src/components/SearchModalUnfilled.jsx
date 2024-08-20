import React, {useRef, useEffect} from 'react'
import { CiSearch } from "react-icons/ci";
import { LuUsers2 } from "react-icons/lu";
import { LuPencil } from "react-icons/lu";
// import { IoClose } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";

const SearchModalUnfilled = ({setSearchModalVisibility}) => {

    const specificElementRef = useRef(null);



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
    
    
// {/* <IoClose /> */}

  return (
    <div 
    className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] '
    >
        <dialog ref={specificElementRef} className=
         "bg-white flex p-8 rounded-lg flex-col m-auto w-[775px] border h-[616px] justify-start modal-overlay">
            <div className='flex rounded-lg justify-start p-4 items-center h-[5rem] w-full border border-[#d0d5dd]'>
            <CiSearch title='Search' className='w-[20px] h-[20px] opacity-30 bg-white cursor-pointer'/>
                <input type="search" name="" placeholder='Search' className=' border-none p-4 flex-grow w-full h-full focus:outline-none' id="" />
            </div>

            <div className='flex flex-col my-3 pb-4 gap-2 justify-center items-stretch border border-l-0 border-t-0 border-r-0 border-b-[#dee3e7]'>
                <h3 className='text-sm text-left py-2 text-[#00000080]'>Filter results</h3>
                <div className='flex justify-normal gap-4'>
                    <span className='flex items-center gap-1 border rounded-lg w-[78px] p-1 justify-center text-[#667185] border-[#d0d5dd] cursor-pointer'
                    
                    >
                    <IoCalendarClearOutline/>
                    Date
                    </span>
                    <span className='flex items-center gap-1 border rounded-lg w-[86px] p-1 justify-center text-[#667185] border-[#d0d5dd] cursor-pointer'
                    
                    >
                    <LuUsers2/>
                    Name
                    </span>
                    <span className='flex items-center gap-2 border rounded-lg w-[110px] p-1 justify-center text-[#667185] border-[#d0d5dd] cursor-pointer'
                    
                    >
                    <LuPencil className='text-[#000000] '/>
                    Daignosis
                    </span>
                </div>

            </div>
            
        </dialog>


    </div>
  )
}

export default SearchModalUnfilled
