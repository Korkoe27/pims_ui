import React from 'react'

const ExtraTestModal = ({title}) => {
  return (
    <dialog className='p-9 flex flex-col items-end gap-8'>
      <div className='text-left'>
        <h1>Extra Test:</h1>
        <h1>{title}</h1>
      </div>

      <div className='flex flex-col'>
        <label htmlFor="testResults">{title}</label>
        <textarea name="testResults" id="testResults"></textarea>
        <button className='text-white bg-[#2f3192] w-16 rounded-lg text-center p-4'>Save</button>
      </div>
    </dialog>
  )
}

export default ExtraTestModal
