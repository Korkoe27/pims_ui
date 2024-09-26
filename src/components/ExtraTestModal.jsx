import React from 'react'

const ExtraTestModal = () => {
  return (
    <dialog className='p-9 flex flex-col items-end gap-8'>
      <div className='text-left'>
        <h1>Extra Test:</h1>
        <h1>Amplitude of Accommodation</h1>
      </div>

      <div className='flex flex-col'>
        <label htmlFor="results">Amplitude of Accommodation</label>
        <textarea name="testResults" id=""></textarea>
        <button className='text-white bg-[#2f3192] w-16 rounded-lg text-center p-4'>Save</button>
      </div>
    </dialog>
  )
}

export default ExtraTestModal
