import React from 'react'

const CreateAppointment = () => {
  return (
    <div className='ml-72 my-8 px-8 w-fit flex flex-col bg-[#f9fafb] gap-12'>
      <aside className="flex flex-col gap-4 items-start justify-center">
        <h1 className="font-semibold text-xl">Schedule an Appointment</h1>
        <form action="" method="post" className='flex flex-col gap-4'>
        <div className="flex flex-col gap-2">
            <label htmlFor="appointment_date" className="font-medium text-base">
                Appointment Date
            </label>
            <input type="date" name="appointment_date" id="" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg' />
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="appointment_type" className="font-medium text-base">Appointment Type</label>
            <select name="appointment_type" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg' id="">
                <option  value="" selected disabled>Appointment Type</option>
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="status" className="font-medium text-base">Appointment Status</label>
            <select name="status" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg' id="">
                <option  value="" selected disabled>Appointment Status</option>
            </select>
        </div>
        <div className="flex flex-col gap-2">
            <label htmlFor="notes" className="font-medium text-base">Notes</label>
            <textarea name="notes" id="" placeholder='Add some notes about the patient' className='h-30 p-4 border resize-none max-w-full' ></textarea>
        </div>

        <button className='w-56 p-4 rounded-lg text-white text-lg font-medium  bg-[#2f3192]'>Set Appointment</button>
        </form>
      </aside>
    </div>
  )
}

export default CreateAppointment
