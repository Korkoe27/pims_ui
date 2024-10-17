import React, {useState} from 'react'
import ProgressBar from './ProgressBar'
import Header from './Header'
import NavMenu from './NavMenu'
import { GrAdd } from 'react-icons/gr';

const Refraction = () => {


const [view, setDiv] = useState(false);
const [phoria, displayPhoria] = useState(false);
const toggleOpenDiv = () =>{

    setDiv(true);
};
const toggleCloseDiv = () =>{

    setDiv(false);
};
const togglePhoria = () =>{

    displayPhoria(true);
};
const closePhoria = () =>{

    displayPhoria(false);
};

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

            {!view && (
        <button 
        onClick={toggleOpenDiv}
        className='text-[#2f3192] font-semibold flex items-center gap-2'>
        <GrAdd className='w-5 h-5'/>
            Add cycloplegic refraction
        </button> 
            )}


{view && (


<aside className="flex flex-col gap-4">


    <div className='flex justify-between items-center'>
    <h1 className="text-[#101928] text-medium text-base">Cycloplegic Refraction Results</h1>
    <span className='text-base font-medium cursor-pointer'
    onClick={toggleCloseDiv}>X</span>
    </div>


<div className='flex gap-4'>

        <div className="flex flex-col justify-end gap-4 items-baseline">
        <h1 className='text-xl font-bold text-center'>OD</h1>
        <h1 className='text-xl font-bold text-center'>OS</h1>
        </div>
        <div className='flex gap-4 my-'>
        <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-normal text-base'>SPH
            </label>
            <input type="text" name='rightCycloplegicRefractionSph' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
            <input type="text" name='leftCycloplegicRefractionSph' className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
        </div>
        <div className='flex flex-col'>
            <label htmlFor=""  className='text-center font-normal text-base'>CYL
            </label>
            <input type="text" name='rightCycloplegicRefractionCyl' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
            <input type="text" name='leftCycloplegicRefractionCyl' className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
        </div>
        <div className='flex flex-col'>
            <label htmlFor=""  className='text-center font-normal text-base'>AXIS
            </label>
            <input type="text" name='rightCycloplegicRefractionAxis' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
            <input type="text" name='leftCycloplegicRefractionAxis' className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
        </div>
        <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-normal text-base'>VA@6m
            </label>
            <input type="text" name='rightCycloplegicRefractionVA@6m' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd]' />
            <input type="text" name='leftCycloplegicRefractionVA@6m' className='w-20 h-9 rounded-md border border-[#d0d5dd]' />
        </div>
    </div>
    </div>
</aside>
)}


{!phoria && (
            <button 
            onClick={togglePhoria}
            className='text-[#2f3192] font-semibold flex items-center gap-2'>
            <GrAdd className='w-5 h-5'/>
            Add Phoria Results
        
        </button>
)}


{phoria &&  (
    <aside className='w-fit flex flex-col gap-4'>
    <div className='flex justify-between items-center'>
    <h1 className="text-[#101928] text-medium text-base">Phoria</h1>
    <span className='text-base font-medium cursor-pointer'
    onClick={closePhoria}
    >X</span>
    </div>
    <div className="flex gap-4">
    <div className="flex flex-col justify-end gap-4 items-baseline">
        <h1 className='text-xl font-bold text-center'>OD</h1>
        <h1 className='text-xl font-bold text-center'>OS</h1>
    </div>
    <div className="flex gap-4">   
            <div className='flex flex-col'>
            <label htmlFor=""  className='text-center font-normal text-base'>Amount
            </label>
            <input type="text" name='rightPhoriaAmount' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd] p-2' placeholder='eg 2PD' />
            <input type="text" name='leftPhoriaAmount' className='w-20 h-9 rounded-md border border-[#d0d5dd] p-2' placeholder='eg 2PD' />
        </div>
        <div className='flex flex-col'>
            <label htmlFor="" className='text-center font-normal text-base'>Direction
            </label>
            <input type="text" name='rightPhoriaDirection' className='w-20 h-9 mb-4 rounded-md border border-[#d0d5dd] p-2' placeholder='Eso/Exo' />
            <input type="text" name='leftPhoriaDirection' className='w-20 h-9 rounded-md border border-[#d0d5dd] p-2' placeholder='Eso/Exo' />
        </div>
            </div>

            </div> 
</aside> 
)}

            </div>
        </aside>

        <button className="text-white bg-[#2f3192] w-48 h-14 p-4 rounded-lg" type='button'>Save and proceed</button>


    </form>

    </div>
  )
}

export default Refraction
