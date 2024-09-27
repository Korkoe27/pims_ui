import React, {useState} from 'react'
import ProgressBar from './ProgressBar'
import Header from './Header'
import NavMenu from './NavMenu'
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaChartSimple, FaPen } from 'react-icons/fa6';
import { GrAdd } from 'react-icons/gr';

const Externals = () => {

  const [isSectionVisible, setSectionVisible] = useState(false);

  const toggleSection = () =>{
    setSectionVisible(!isSectionVisible);
  };

  return (
    <div className='ml-72 my-8 w-fit px-8 flex flex-col bg-[#f9fafb] gap-12'>
        <Header/>
      <ProgressBar />
      <NavMenu/>
    <form action="" className='flex flex-col w-fit'>

      <button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Eyelids & Eyelashes</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>

      {isSectionVisible && (
      <aside className="flex flex-col gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightSwelling" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightSwelling" id="" />
            Yes
          </label>
          <label htmlFor="leftSwelling" className='flex items-center'>
            <input type="radio" value={'no'} name="leftSwelling" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Swelling</h1>
          <div className="flex gap-4">
          <label htmlFor="rightSwelling" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightSwelling" id="" />
            Yes
          </label>
          <label htmlFor="leftSwelling" className='flex items-center'>
            <input type="radio" value={'no'} name="leftSwelling" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightWarmToTouch" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightWarmToTouch" id="" />
            Yes
          </label>
          <label htmlFor="rightWarmToTouch" className='flex items-center'>
            <input type="radio" value={'no'} name="rightWarmToTouch" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Warm to touch</h1>
          <div className="flex gap-4">
          <label htmlFor="rightWarmToTouch" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightWarmToTouch" id="" />
            Yes
          </label>
          <label htmlFor="leftWarmToTouch" className='flex items-center'>
            <input type="radio" value={'no'} name="leftWarmToTouch" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightPtosis" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightPtosis" id="" />
            Yes
          </label>
          <label htmlFor="rightPtosis" className='flex items-center'>
            <input type="radio" value={'no'} name="rightPtosis" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Ptosis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftPtosis" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftPtosis" id="" />
            Yes
          </label>
          <label htmlFor="leftPtosis" className='flex items-center'>
            <input type="radio" value={'no'} name="leftPtosis" id=""  />
            No
          </label>
          </div>
        </div>

        
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightTrichiasis" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightTrichiasis" id="" />
            Yes
          </label>
          <label htmlFor="rightTrichiasis" className='flex items-center'>
            <input type="radio" value={'no'} name="rightTrichiasis" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Trichiasis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftTrichiasis" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftTrichiasis" id="" />
            Yes
          </label>
          <label htmlFor="leftTrichiasis" className='flex items-center'>
            <input type="radio" value={'no'} name="leftTrichiasis" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightDistichiasis" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightDistichiasis" id="" />
            Yes
          </label>
          <label htmlFor="rightDistichiasis" className='flex items-center'>
            <input type="radio" value={'no'} name="rightDistichiasis" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Distichiasis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftDistichiasis" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftDistichiasis" id="" />
            Yes
          </label>
          <label htmlFor="leftDistichiasis" className='flex items-center'>
            <input type="radio" value={'no'} name="leftDistichiasis" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightPapillae" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightPapillae" id="" />
            Yes
          </label>
          <label htmlFor="rightPapillae" className='flex items-center'>
            <input type="radio" value={'no'} name="rightPapillae" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Papillae</h1>
          <div className="flex gap-4">
          <label htmlFor="leftPapillae" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftPapillae" id="" />
            Yes
          </label>
          <label htmlFor="leftPapillae" className='flex items-center'>
            <input type="radio" value={'no'} name="leftPapillae" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightForeignGrowth" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightForeignGrowth" id="" />
            Yes
          </label>
          <label htmlFor="rightForeignGrowth" className='flex items-center'>
            <input type="radio" value={'no'} name="rightForeignGrowth" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Foreign Growth</h1>
          <div className="flex gap-4">
          <label htmlFor="leftForeignGrowth" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftForeignGrowth" id="" />
            Yes
          </label>
          <label htmlFor="leftForeignGrowth" className='flex items-center'>
            <input type="radio" value={'no'} name="leftForeignGrowth" id=""  />
            No
          </label>
          </div>
        </div>



        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightEctropion" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightEctropion" id="" />
            Yes
          </label>
          <label htmlFor="rightEctropion" className='flex items-center'>
            <input type="radio" value={'no'} name="rightEctropion" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Ectropion</h1>
          <div className="flex gap-4">
          <label htmlFor="leftEctropion" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftEctropion" id="" />
            Yes
          </label>
          <label htmlFor="leftEctropion" className='flex items-center'>
            <input type="radio" value={'no'} name="leftEctropion" id=""  />
            No
          </label>
          </div>
        </div>



        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightEctropion" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightEctropion" id="" />
            Yes
          </label>
          <label htmlFor="rightEctropion" className='flex items-center'>
            <input type="radio" value={'no'} name="rightEctropion" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Entropion</h1>
          <div className="flex gap-4">
          <label htmlFor="leftEctropion" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftEctropion" id="" />
            Yes
          </label>
          <label htmlFor="leftEctropion" className='flex items-center'>
            <input type="radio" value={'no'} name="leftEctropion" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightScarring" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightScarring" id="" />
            Yes
          </label>
          <label htmlFor="rightScarring" className='flex items-center'>
            <input type="radio" value={'no'} name="rightScarring" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Scarring / Lesions</h1>
          <div className="flex gap-4">
          <label htmlFor="leftScarring" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftScarring" id="" />
            Yes
          </label>
          <label htmlFor="leftScarring" className='flex items-center'>
            <input type="radio" value={'no'} name="leftScarring" id=""  />
            No
          </label>
          </div>
        </div>



        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightNormalWellAligned" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightNormalWellAligned" id="" />
            Yes
          </label>
          <label htmlFor="rightNormalWellAligned" className='flex items-center'>
            <input type="radio" value={'no'} name="rightNormalWellAligned" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Normal / Well aligned</h1>
          <div className="flex gap-4">
          <label htmlFor="leftNormalWellAligned" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftNormalWellAligned" id="" />
            Yes
          </label>
          <label htmlFor="leftForeignGrowth" className='flex items-center'>
            <input type="radio" value={'no'} name="leftNormalWellAligned" id=""  />
            No
          </label>
          </div>
        </div>



    <div className="flex justify-between text-base text-[#2f3192]">
      <button className="flex items-center gap-2 ">
        <FaPen className='h-5 w-5'/>
        Add a note
      </button>
      <button className="flex items-center gap-2">
        <GrAdd className='h-5 w-5'/>
        Add option
      </button>
      <button className="flex items-center gap-2">
        <FaChartSimple className='h-5 w-5'/>
        Specify grading of symptoms
      </button>
    </div>


      </aside>
      )}
    </form>

    </div>
  )
}

export default Externals
