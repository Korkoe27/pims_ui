import React from 'react'
import ProgressBar from './ProgressBar'
import Header from './Header'
import NavMenu from './NavMenu'
import { GrAdd } from 'react-icons/gr';

const Refraction = () => {
  return (
    <div className='ml-72 my-8 px-16 flex flex-col gap-12'>
        <Header/>
      <ProgressBar />
      <NavMenu/>

    <form className="flex flex-col gap-20">
        <div className="flex flex-col gap-1 h-20 w-[375px]">
            <label htmlFor="objectRefraction" className='text-base text-[#101928] font-medium'>Method for Objective Refraction</label>
            <select name="objectRefraction" className='w-full p-4 h-14 rounded-md border border-[#d0d5dd] bg-white ' id=""></select>
        </div>

        <aside className=" flex flex-col gap-16">

            <h1 className='text-[#101928] text-base'>Objective Refraction Results</h1>
        <div className='flex gap-4'>

                <div className="flex flex-col justify-end gap-4 items-baseline">
                <h1 className='text-xl font-bold text-center'>OD</h1>
                <h1 className='text-xl font-bold text-center'>OS</h1>
                </div>
                <div className='flex gap-4 my-'>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>Standard
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor=""  className='text-center font-normal text-base'>CYL
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>AXIS
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>VA@6m
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                </div>
        </div>

        <h1 className="text-[#101928] text-base">Subjective Refraction Results</h1>

        <div className='flex gap-4'>

                <div className="flex flex-col justify-end gap-4 items-baseline">
                <h1 className='text-xl font-bold text-center'>OD</h1>
                <h1 className='text-xl font-bold text-center'>OS</h1>
                </div>
                <div className='flex gap-4 my-'>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>Standard
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor=""  className='text-center font-normal text-base'>CYL
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>AXIS
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>ADD
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>VA@6m
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="" className='text-center font-normal text-base'>VA@0.4m
                    </label>
                    <input type="text" className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
                    <input type="text" className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
                </div>
            </div>

            
        </div>
        <div className="flex flex-col gap-16 w-fit">
                <button className='text-[#2f3192] font-semibold flex items-center gap-2'>
                    <GrAdd className='w-5 h-5'/>
                    Add cycloplegic refraction</button>
                    <button className='text-[#2f3192] font-semibold flex items-center gap-2'>
                        <GrAdd className='w-5 h-5'/>
                        Add Phoria Results</button>
            </div>
        </aside>

        <button className="text-white bg-[#2f3192] w-48 h-14 p-4 rounded-lg" type='button'>Save and proceed</button>


    </form>

    </div>
  )
}

export default Refraction
