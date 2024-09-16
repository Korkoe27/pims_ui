import React from 'react'
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

const TextField = ({label, type, placeholder}) => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <label htmlFor="">{label}</label>
      <div className='h-14 p-4 border border-[#d0d5dd] flex justify-between rounded-md bg-white'>
        {type === 'tel' && (
          <HiOutlineDevicePhoneMobile  className='w-5 h-5 flex-grow-0'/>
        )}
        <input type={type} placeholder={placeholder} className='p-0 outline-none flex-grow' />
      </div>
    </div>
  )
}

export default TextField;
