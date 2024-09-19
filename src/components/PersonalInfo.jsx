
import React from 'react'
import { IoPhonePortraitOutline } from "react-icons/io5";

const PersonalInfo = () => {
  return (
    <div className='ml-72 w-screen pl-9 p-0 bg-[#f9fafb]'>
      
      <div className='flex flex-col gap-4 my-7'>
        <h1 className='text-2xl font-semibold'>New Patient</h1>
        <p className='text-base font-normal '>Fill out the following of your new patient</p>
      </div>



      <form action="" className='w-[846px]'>

        <section className='flex gap-24 h-[450px] m-0'>


          <aside className='flex flex-col gap-8'>
            <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Surname</label>
          <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the last name of the patient' />
        </div>

        <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>First Name</label>
        <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the first name of the patient' />
      </div>

      <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Other Names</label>
        <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the other names of the patient' />
      </div>

      <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Date of Birth</label>
          <input type="date" className='w-full  border border-[#d0d5dd] m-0 h-14 p-4 rounded-lg' placeholder='' />
        
      </div>

      <div className="flex flex-col w-[375px]">
        <label htmlFor="gender" className='text-base font-medium text-[#101928]'>Gender</label>
        <div className='flex gap-3'>
          <input type="radio" name='gender' className='h-6 w-6' value="male" id='male'  />
          <label htmlFor="gender" className='text-base font-medium text-[#101928]'>Male</label>
          <input type="radio" name='gender' className='h-6 w-6' value="female" id='female'  />
          <label htmlFor="gender" className='text-base font-medium text-[#101928]'>Female</label>

        </div>
        
      </div>
          </aside>

        

        <aside className='flex flex-col gap-8'>
          <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Occupation</label>
        <select name="occupation" placeholder="Select an option" id="" className="w-full outline-none m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
        <option disabled className='text-base font-medium text-[#101928]' selected>Select your option</option>
        </select>
      </div>
      
      
      <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Place of Residence</label>
        <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the patient’s town/city name' />
      </div>
      
      <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Region of Residence</label>
        <select name="region" placeholder="Select an option" id="" className="w-full outline-none m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
        <option disabled selected>Select your option</option>
        </select>
      </div> 
      
      <div className="flex flex-col w-[375px]">
        <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Closest Landmark</label>
        <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the closest landmark to patient’s residence' />
      </div>
      
      

      <div className="flex flex-col w-[375px]">
        <label htmlFor="hometown" className='text-base font-medium text-[#101928]'>Hometown</label>
        <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder="Enter the patient's hometown name" />
      </div>
        </aside>
      
     

        </section>



    

        <section className='flex gap-24 border m-0 border-t-[#d9d9d9] border-b-0 border-r-0 border-l-0 h-[450px] flex-wrap justify-stretch items-center'>


    <aside className='flex flex-col gap-8'>
      <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Primary Telephone Number</label>
          <div className="flex w-full gap-2 m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
            <IoPhonePortraitOutline className='w-5 h-5 text-[#98a2b3]'/>
            <input type="tel" className='outline-none' placeholder='055 555 5555' />
          </div>
        </div>
        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Alternate Telephone Number</label>
          <div className="flex w-full gap-2 m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
            <IoPhonePortraitOutline className='w-5 h-5 text-[#98a2b3]'/>
            <input type="tel" className='outline-none' placeholder='055 555 5555' />
          </div>
        </div>


        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Emergency Contact Name</label>
          <input type="text" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the name of the patient’s emergency contact' />
        </div>
        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Emergency Contact’s Phone Number</label>
          <div className="flex w-full gap-2 m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
            <IoPhonePortraitOutline className='w-5 h-5 text-[#98a2b3]'/>
            <input type="tel" className='outline-none' placeholder='055 555 5555' />
          </div>
          
        </div>

        




    </aside>
        

        <aside className="flex flex-col gap-8">
      <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Hospital ID</label>
          <input type="tel" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the patient’s hospital ID' />
        </div>


        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Date of First Visit</label>
          <input type="date" className='w-full  m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' defaultValue="01-01-1990" placeholder='01-01-1990' />
        </div>

        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Health Insurance Provider</label>
          <select name="healthInsurer" placeholder="Select an option" id="" className="w-full outline-none m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg">
        <option disabled selected>Select your option</option>
        </select>
        </div>

        <div className="flex flex-col w-[375px]">
          <label htmlFor="surname" className='text-base font-medium text-[#101928]'>Health Insurance Number</label>
          <input type="text" className='w-full placeholder-[#98a2b3] m-0 border border-[#d0d5dd] h-14 p-4 rounded-lg' placeholder='Enter the patient’s health insurance number' />
        </div>
        </aside>
        
        </section>


        <div className='flex gap-8 justify-center w-[846px] px-0  my-8'>
          <button type="button" className=' border h-14 p-4 border-[#2f3192] text-[#2f3192] bg-white rounded-lg w-56'>Schedule appointment</button>
          <button type="button" className='bg-[#2f3192] w-56 rounded-lg h-14 p-4 text-white'>Attend to patient now</button>
        </div>



      </form>
    </div>
  )
}

export default PersonalInfo
