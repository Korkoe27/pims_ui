import React from 'react'
import { IoPhonePortraitOutline } from "react-icons/io5";


const PersonalInfo = () => {
  return (
    <div className='px-72 bg-[#f9fafb] h-full w-full'>

      <div className="flex flex-col gap-4 px-8 my-6">
          <h1 className='text-2xl font-semibold'>New Patient</h1>
          <p className="text-base">Fill out the following details of your new patient</p>
      </div>
      
       <form action="" className='px-8 w-fit'>
        <section className="flex gap-24 pb-16  justify-between">


          <aside className="flex flex-col gap-8">

            <div className="flex flex-col gap-2">
              <label htmlFor="surname" className='text-[#101928]'>Surname</label>
              <input type="text" name='lastName' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the last name of the patient' />
            </div>

            

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className='text-[#101928]'>First Name</label>
              <input type="text" name='firstName' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the first name of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="otherNames" className='text-[#101928]'>Other names</label>
              <input type="text" name='otherNames' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the other names of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Date of Birth</label>
              <input type="date" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the last name of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className='text-[#101928]'>Gender</label>
              <div className="flex gap-4">
                <label htmlFor="male" className='flex items-center gap-1'>
                  <input type="radio" name="gender" id="" /> 
                  Male
                </label>
                <label htmlFor="female" className='flex items-center gap-1'>
                  <input type="radio" name="gender" id="" /> 
                  Female
                </label>
              </div>
            </div>

          </aside>


          <aside className="flex flex-col gap-8 ">
            

          <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Occupation</label>
              <select name="occupation" id="" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>

          

            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Place of Residence</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the patient’s town/city name' />
            </div>

            
          <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Region of Residence</label>
              <select name="regionOfResidence" id="" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Closest Landmark</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Closest Landmark' />
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Hometown</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the patient’s hometown name' />
            </div>

            
          </aside>
        </section>

        <section className="flex gap-24 pt-16 border border-t-[#d9d9d9] border-b-0 border-l-0 border-r-0 w-full p-0 justify-between">
          <aside className="flex flex-col gap-8">
            
          <div className="flex flex-col gap-2">
              <label htmlFor="primaryTelephoneNumber" className='text-[#101928]'>Primary Telephone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
              <input type="text" className="outline-none" placeholder='055 555 5555' />  
              </div>
              
            </div>
            
          <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Alternate Telephone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
                 <input type="tel" className="outline-none" placeholder='055 555 5555' />
              </div>
             
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Emergency Contact Name</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the name of the patient’s emergency contact' />
            </div>

                        
          <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Emergency Contact’s Phone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
                 <input type="tel" className="outline-none" placeholder='055 555 5555' />
              </div>
             
            </div>
          </aside>

          <aside className="flex flex-col gap-8">
            
                        
          <div className="flex flex-col gap-2">
              <label htmlFor="hospitalId" className='text-[#101928]'>Hospital ID</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the patient’s hospital ID' />
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Date of First Visit</label>
              <input type="date" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the last name of the patient' />
            </div>

            
          <div className="flex flex-col gap-2">
              <label htmlFor="healthInsuranceProvider" className='text-[#101928]'>Health Insurance Provider</label>
              <select name="healthInsuranceProvider" id="" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>
              
                        
          <div className="flex flex-col gap-2">
              <label htmlFor="healthInsuranceNumber" className='text-[#101928]'>Health Insurance Number</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Health Insurance Number' />
            </div>
          </aside>
        </section>

        <div className='flex gap-8 justify-center my-16'>
          <button type="submit" className='w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]'>Schedule appointment</button>
          <button type="submit" className='w-56 p-4 rounded-lg text-white bg-[#2f3192]'>Attend to patient now</button>
        </div>
      </form> 
      
      
    </div>
  )
}

export default PersonalInfo
