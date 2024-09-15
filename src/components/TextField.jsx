import React from 'react'

const TextField = ({label,type,placeholder}) => {
  return (
    <div className='flex flex-col items-start gap-3'>
      <label htmlFor="">{label}</label>
      <div className='h-14 p-4 border border-[#d0d5dd] rounded-md bg-white'>
        <input type={type} placeholder={placeholder} className='p-0 outline-none'/>
      </div>
      
    </div>
  )
}

export default TextField
