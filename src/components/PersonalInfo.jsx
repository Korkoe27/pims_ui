import React, { useState } from 'react'
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import CreateAppointment from './CreateAppointment';


const PersonalInfo = () => {
  const navigate = useNavigate();
  const attendToPatient = () => {
    navigate("/case-history");
  }
  const createAppointment = () => {
    navigate(`/createAppointment`);
  }

  const [saveForm, setSaveForm] = useState();

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
              <label htmlFor="last_name" className='text-[#101928]'>Surname</label>
              <input type="text" name='last_name' required className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the last name of the patient' />
            </div>

            

            <div className="flex flex-col gap-2">
              <label htmlFor="first_name" className='text-[#101928]'>First Name</label>
              <input type="text" name='first_name' required className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the first name of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="other_names" className='text-[#101928]'>Other names</label>
              <input type="text" name='other_names' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the other names of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="dateOfBirth" className='text-[#101928]'>Date of Birth</label>
              <input type="date" required className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" name='dob' placeholder='Enter the last name of the patient' />
            </div>


            <div className="flex flex-col gap-2">
              <label htmlFor="gender" className='text-[#101928]'>Gender</label>
              <div className="flex gap-4">
                <label htmlFor="male" className='flex items-center gap-1'>
                  <input type="radio" name="gender" id="male" /> 
                  Male
                </label>
                <label htmlFor="female" className='flex items-center gap-1'>
                  <input type="radio" name="gender" id="female" /> 
                  Female
                </label>
              </div>
            </div>

          </aside>


          <aside className="flex flex-col gap-8 ">
            

          <div className="flex flex-col gap-2">
              <label htmlFor="occupation" className='text-[#101928]'>Occupation</label>
              <select name="occupation" id="occupation" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>

          

            <div className="flex flex-col gap-2">
              <label htmlFor="address" className='text-[#101928]'>Place of Residence</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" name='address' placeholder='Enter the patient’s town/city name' />
            </div>

            
          <div className="flex flex-col gap-2">
              <label htmlFor="region" className='text-[#101928]'>Region of Residence</label>
              <select name="region" id="region" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="landmark" className='text-[#101928]'>Closest Landmark</label>
              <input type="text" name='landmark' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Closest Landmark' />
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="hometown" className='text-[#101928]'>Hometown</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" name='hometown' placeholder='Enter the patient’s hometown name' />
            </div>

            
          </aside>
        </section>

        <section className="flex gap-24 pt-16 border border-t-[#d9d9d9] border-b-0 border-l-0 border-r-0 w-full p-0 justify-between">
          <aside className="flex flex-col gap-8">
            
          <div className="flex flex-col gap-2">
              <label htmlFor="primary_phone" className='text-[#101928]'>Primary Telephone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
              <input type="text" name='primary_phone' className="outline-none" required placeholder='055 555 5555' />  
              </div>
              
            </div>
            
          <div className="flex flex-col gap-2">
              <label htmlFor="alternate_phone" className='text-[#101928]'>Alternate Telephone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
                 <input type="tel" className="outline-none" placeholder='055 555 5555' name='alternate_phone' />
              </div>
             
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="emergency_contact_name" className='text-[#101928]'>Emergency Contact Name</label>
              <input type="text" className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" name='emergency_contact_name' placeholder='Enter the name of the patient’s emergency contact' />
            </div>

                        
          <div className="flex flex-col gap-2">
              <label htmlFor="emergency_contact_number" className='text-[#101928]'>Emergency Contact’s Phone Number</label>
              <div className="flex items-center p-4 bg-white gap-2 w-[375px] border border-[#d0d5dd] h-14 rounded-lg">
              <IoPhonePortraitOutline className='h-5 w-5 text-[#98a2b3]'/>
                 <input type="tel" name='emergency_contact_number' className="outline-none" placeholder='055 555 5555' />
              </div>
             
            </div>
          </aside>

          <aside className="flex flex-col gap-8">
            
                        
          <div className="flex flex-col gap-2">
              <label htmlFor="hospitalId" className='text-[#101928]'>Hospital ID</label>
              <input type="text" name='' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the patient’s hospital ID' />
            </div>

            
            <div className="flex flex-col gap-2">
              <label htmlFor="date_of_first_visit" className='text-[#101928]'>Date of First Visit</label>
              <input type="date" name='date_of_first_visit' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Enter the last name of the patient' />
            </div>

            
          <div className="flex flex-col gap-2">
              <label htmlFor="insurance_provider" className='text-[#101928]'>Health Insurance Provider</label>
              <select name="insurance_provider" id="" className='p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg text-[#98a2b3] placeholder-[#98a2b3]' placeholder='Select an option'></select>
            </div>
              
                        
          <div className="flex flex-col gap-2">
              <label htmlFor="insurance_number" className='text-[#101928]'>Health Insurance Number</label>
              <input type="text" name='insurance_number' className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg" placeholder='Health Insurance Number' />
            </div>
          </aside>
        </section>

        <div className='flex gap-8 justify-center my-16'>
          <button type="button" onClick={createAppointment} className='w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]'>Schedule appointment</button>
          <button type="submit" onClick={attendToPatient} className='w-56 p-4 rounded-lg text-white bg-[#2f3192]'>Attend to patient now</button>
        </div>
      </form> 
      
      
    </div>
  )
}

export default PersonalInfo
