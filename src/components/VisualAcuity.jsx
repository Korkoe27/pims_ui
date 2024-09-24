import React from 'react'
import  Header  from "./Header";
import ProgressBar from './ProgressBar';
import NavMenu from './NavMenu';
import { useNavigate } from 'react-router-dom';
import Radios from './Radios';

const VisualAcuity = () => {


  const navigate = useNavigate();
  const Externals = () => {
    navigate("/externals");
  }

  return (
    <div className='ml-72 my-8 px-8 flex flex-col gap-12'>
      <Header/>
      <ProgressBar />
      <NavMenu/>


<form action="" className='flex gap-48'>

<section className="flex flex-col  gap-4">
        
        <aside className="flex flex-col my-6 gap-10">
          <div className="flex flex-col gap-1 w-[375px] mb-20 h-20">
        <label htmlFor="" className="text-base font-medium">VA Chart used</label>
        <select name="vaChart" id="" className='p-4 border border-[#d0d5dd] h-14 rounded-md'></select>
      </div>
          <h1 className="text-base font-medium">Distance VA (unaided)<span className='text-[#d42620]'>*</span></h1>
          <div className='flex gap-4'>

        <div className="flex flex-col justify-end gap-4 items-baseline">
          <h1 className='text-xl font-bold text-center'>OD</h1>
          <h1 className='text-xl font-bold text-center'>OS</h1>
        </div>
        <div className='flex gap-4'>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-normal text-base'>Standard
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor=""  className='text-center font-normal text-base'>PH
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-normal text-base'>+1.00
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>

        </div>
          </div>
        </aside>

        <aside className='flex flex-col gap-3'>
          <h1 className="text-base font-medium">Near VA (unaided)<span className='text-[#d42620]'>*</span></h1>
          <div className="flex flex-col gap-4">
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OD</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OS</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
          </div>
        </aside>
        {/* <div className='flex justify-end items-end my-28 mb-0 flex-col'>
          <button type="submit" className='w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]'>Back</button>
        </div> */}
      </section>

      <section className="flex flex-col gap-12">
        <Radios name={"patientHasPrescription"} label={"Did patient come with a prescription?"}/>

        <div className="flex flex-col h-20 w-[375px]">
          <label htmlFor="prescriptionType" className="text-base font-medium">Type of Prescription</label>
          <select name="prescriptionType" id="" className='h-14 rounded-md border border-[#d0d5dd]'></select>
        </div>


        <div className="flex flex-col gap-6">
          <label htmlFor="patientCurrentPrescription" className="text-base font-medium">Patient’s Current Prescription<span className='text-[#d42620]'>*</span></label>
          <div className='flex gap-4'>

        <div className="flex flex-col justify-end gap-4 items-baseline">
          <h1 className='text-xl font-bold text-center'>OD</h1>
          <h1 className='text-xl font-bold text-center'>OS</h1>
        </div>
        <div className='flex gap-4'>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-medium text-base'>SPH
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor=""  className='text-center font-medium text-base'>CYL
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-medium text-base'>AXIS
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-medium text-base'>ADD
            </label>
              <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
              <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
          </div>
          
        </div>
        
          </div>
          <aside className='flex flex-col gap-3'>
          <h1 className="text-base font-medium">Distance VA with Patient’s Current Prescription<span className='text-[#d42620]'>*</span></h1>
          <div className="flex flex-col gap-4">
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OD</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OS</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
          </div>
        </aside>
          <aside className='flex flex-col gap-3'>
          <h1 className="text-base font-medium">Near VA with Patient’s Current Prescription<span className='text-[#d42620]'>*</span></h1>
          <div className="flex flex-col gap-4">
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OD</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
            <div className='flex gap-3 items-center'>
              <label htmlFor="" className='text-xl font-bold'>OS</label>
              <input type="text" className='rounded-md border border-[#d0d5dd] w-20 h-9 p-2' />
            </div>
          </div>
        </aside>
        </div>

        <div className='gap-8 justify-end  items-end  flex-col flex'>
                    <button type="submit" onClick={Externals} className='w-56 p-4 rounded-lg text-white bg-[#2f3192]'>Attend to patient now</button>
        </div>
      </section>        
 
</form>
    </div>
  )
}

export default VisualAcuity
