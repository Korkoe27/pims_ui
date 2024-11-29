

import React, {useState} from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'
import NavMenu from './NavMenu'

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaChartSimple, FaPen } from 'react-icons/fa6';
import { GrAdd } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

const Internals = () => {


  const sectionNames = {
    lens: false,
    vitreous: false,
    ophthalmoscopy: false,
    macula: false,
    intraOcularPressure: false
  }

  const navigate  = useNavigate();

  const proceedToRefraction = ()  =>{
    navigate('/refraction');
  }

  const [dropdowns, setDropdowns] = useState(sectionNames);

  const toggleSection = (e) =>{
    // console.log('call me')
    setDropdowns({...dropdowns, [`${e.currentTarget.id}`]: !dropdowns[e.currentTarget.id]});
    // console.log({...dropdowns, [`${e.currentTarget.id}`]: !dropdowns[e.currentTarget.id]})
  }

  return (
    <main className='ml-72 py-8 px-8 w-full min-h-screen flex flex-col gap-12'>
    <Header/>
    <ProgressBar />
    <NavMenu/>
      
      <form action="" className="flex flex-col w-fit gap-8 py-4">
      <button id='lens' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Lens</h2>
        {dropdowns.lens ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>



      
      {dropdowns.lens && (
      <aside className="flex flex-col w-4/5 mx-auto gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightLens" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightLens" id="" />
            Yes
          </label>
          <label htmlFor="rightLens" className='flex items-center'>
            <input type="radio" value={'no'} name="rightLens" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Lens</h1>
          <div className="flex gap-4">
          <label htmlFor="leftLens" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftLens" id="" />
            Yes
          </label>
          <label htmlFor="leftLens" className='flex items-center'>
            <input type="radio" value={'no'} name="leftLens" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightDeposits" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightDeposits" id="" />
            Yes
          </label>
          <label htmlFor="rightDeposits" className='flex items-center'>
            <input type="radio" value={'no'} name="rightDeposits" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Deposits</h1>
          <div className="flex gap-4">
          <label htmlFor="leftDeposits" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftDeposits" id="" />
            Yes
          </label>
          <label htmlFor="leftDeposits" className='flex items-center'>
            <input type="radio" value={'no'} name="leftDeposits" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightCloudy" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightCloudy" id="" />
            Yes
          </label>
          <label htmlFor="rightCloudy" className='flex items-center'>
            <input type="radio" value={'no'} name="rightCloudy" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Ptosis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftCloudy" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftCloudy" id="" />
            Yes
          </label>
          <label htmlFor="leftCloudy" className='flex items-center'>
            <input type="radio" value={'no'} name="leftCloudy" id=""  />
            No
          </label>
          </div>
        </div>

        
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightAphakia" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightAphakia" id="" />
            Yes
          </label>
          <label htmlFor="rightAphakia" className='flex items-center'>
            <input type="radio" value={'no'} name="rightAphakia" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Aphakia</h1>
          <div className="flex gap-4">
          <label htmlFor="leftAphakia" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftAphakia" id="" />
            Yes
          </label>
          <label htmlFor="leftAphakia" className='flex items-center'>
            <input type="radio" value={'no'} name="leftAphakia" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightPseudophakia" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightPseudophakia" id="" />
            Yes
          </label>
          <label htmlFor="rightPseudophakia" className='flex items-center'>
            <input type="radio" value={'no'} name="rightPseudophakia" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Pseudophakia</h1>
          <div className="flex gap-4">
          <label htmlFor="leftPseudophakia" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftPseudophakia" id="" />
            Yes
          </label>
          <label htmlFor="leftPseudophakia" className='flex items-center'>
            <input type="radio" value={'no'} name="leftPseudophakia" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="lensRightClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="lensRightClear" id="" />
            Yes
          </label>
          <label htmlFor="lensRightClear" className='flex items-center'>
            <input type="radio" value={'no'} name="lensRightClear" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Clear</h1>
          <div className="flex gap-4">
          <label htmlFor="lensLeftClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="lensLeftClear" id="" />
            Yes
          </label>
          <label htmlFor="lensLeftClear" className='flex items-center'>
            <input type="radio" value={'no'} name="lensLeftClear" id=""  />
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

      <button id='vitreous' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Vitreous</h2>
        {dropdowns.vitreous ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>

{dropdowns.vitreous && (
      <aside className="flex flex-col w-4/5 mx-auto gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightFloaters" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightFloaters" id="" />
            Yes
          </label>
          <label htmlFor="rightFloaters" className='flex items-center'>
            <input type="radio" value={'no'} name="rightFloaters" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Floaters</h1>
          <div className="flex gap-4">
          <label htmlFor="leftFloaters" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftFloaters" id="" />
            Yes
          </label>
          <label htmlFor="leftFloaters" className='flex items-center'>
            <input type="radio" value={'no'} name="leftFloaters" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightHaemorrhages" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightHaemorrhages" id="" />
            Yes
          </label>
          <label htmlFor="rightHaemorrhages" className='flex items-center'>
            <input type="radio" value={'no'} name="rightHaemorrhages" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Haemorrhages</h1>
          <div className="flex gap-4">
          <label htmlFor="leftHaemorrhages" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftHaemorrhages" id="" />
            Yes
          </label>
          <label htmlFor="leftHaemorrhages" className='flex items-center'>
            <input type="radio" value={'no'} name="leftHaemorrhages" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightDetachment" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightDetachment" id="" />
            Yes
          </label>
          <label htmlFor="rightDetachment" className='flex items-center'>
            <input type="radio" value={'no'} name="rightDetachment" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Detachment</h1>
          <div className="flex gap-4">
          <label htmlFor="leftDetachment" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftDetachment" id="" />
            Yes
          </label>
          <label htmlFor="leftDetachment" className='flex items-center'>
            <input type="radio" value={'no'} name="leftDetachment" id=""  />
            No
          </label>
          </div>
        </div>

        
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightHazy" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightHazy" id="" />
            Yes
          </label>
          <label htmlFor="rightHazy" className='flex items-center'>
            <input type="radio" value={'no'} name="rightHazy" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Hazy</h1>
          <div className="flex gap-4">
          <label htmlFor="leftHazy" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftHazy" id="" />
            Yes
          </label>
          <label htmlFor="leftHazy" className='flex items-center'>
            <input type="radio" value={'no'} name="leftHazy" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightViterousClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightViterousClear" id="" />
            Yes
          </label>
          <label htmlFor="rightViterousClear" className='flex items-center'>
            <input type="radio" value={'no'} name="rightViterousClear" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Clear</h1>
          <div className="flex gap-4">
          <label htmlFor="leftViterousClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftViterousClear" id="" />
            Yes
          </label>
          <label htmlFor="leftViterousClear" className='flex items-center'>
            <input type="radio" value={'no'} name="leftViterousClear" id=""  />
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
      <button id='ophthalmoscopy' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Ophthalmoscopy</h2>
        {dropdowns.ophthalmoscopy ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>
{dropdowns.ophthalmoscopy && (
      <aside className="flex flex-col py-4 gap-12 w-4/5 m-auto">
      <div className="flex justify-between gap-12">
      <div className="flex justify-between w-full px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>


      </div>
        <div className="justify-between flex items-center">
          <select name="rightElschnigType" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>

          <label htmlFor="elschnigType" className='text-xl font-semibold'>Elschnig Type</label>

          <select name="leftElschnigType" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>
        </div>
      
      
        <div className="justify-between flex items-center">
          <select name="rightDiscColor" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>

          <label htmlFor="discColor" className='text-xl font-semibold'>Disc Color</label>

          <select name="leftDiscColor" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>
        </div>
      
      
        <div className="justify-between flex items-center">
          <select name="rightDiscMargin" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>

          <label htmlFor="discMargin" className='text-xl font-semibold'>Disc Margin</label>

          <select name="leftDiscMargin" className='border border-[#d0d5dd] rounded-md h-14 w-1/3' id=""></select>
        </div>
      
      
        <div className="justify-between flex items-center">
          <input name="rightCupToDiscRatio" placeholder='Enter CD Ratio'  className='border border-[#d0d5dd] rounded-md h-14 p-4 w-1/3' id=""/>

          <label htmlFor="cupToDiscRatio" className='text-xl font-semibold'>Cup-to-Disc Ratio</label>

          <input name="leftCupToDiscRatio" placeholder='Enter CD Ratio' className='border border-[#d0d5dd] rounded-md p-4 h-14 w-1/3' id=""/>
        </div>
      
      
        <div className="justify-between flex items-center">
          <input name="righttArteryToVeinRation" placeholder='Enter ratio' className='border border-[#d0d5dd] rounded-md p-4 h-14 w-1/3' id=""/>

          <label htmlFor="arteryToVeinRation"  className='text-xl font-semibold'>Artery-to-vein Ratio</label>

          <input name="leftArteryToVeinRation" placeholder='Enter ratio'  className='border border-[#d0d5dd] rounded-md p-4 h-14 w-1/3' id=""/>
        </div>
      
      <span className='w-full my-4 border border-[#d0d5dd]'></span>


      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightLaminaCaribrosa" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightLaminaCaribrosa" id="" />
            Yes
          </label>
          <label htmlFor="rightLaminaCaribrosa" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightLaminaCaribrosa" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Lamina Caribrosa</h1>
          <div className="flex gap-6">
          <label htmlFor="leftLaminaCaribrosa" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftLaminaCaribrosa" id="" />
            Yes
          </label>
          <label htmlFor="leftLaminaCaribrosa" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftLaminaCaribrosa" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightOphtalmoscopyHaemorrhages" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightOphtalmoscopyHaemorrhages" id="" />
            Yes
          </label>
          <label htmlFor="rightOphtalmoscopyHaemorrhages" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightOphtalmoscopyHaemorrhages" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Haemorrhages</h1>
          <div className="flex gap-6">
          <label htmlFor="leftOphtalmoscopyHaemorrhages" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftOphtalmoscopyHaemorrhages" id="" />
            Yes
          </label>
          <label htmlFor="leftOphtalmoscopyHaemorrhages" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftOphtalmoscopyHaemorrhages" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="righttExudates" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="righttExudates" id="" />
            Yes
          </label>
          <label htmlFor="righttExudates" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="righttExudates" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Exudates</h1>
          <div className="flex gap-6">
          <label htmlFor="leftExudates" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftExudates" id="" />
            Yes
          </label>
          <label htmlFor="leftExudates" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftExudates" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightDrusens" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightDrusens" id="" />
            Yes
          </label>
          <label htmlFor="rightDrusens" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightDrusens" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Drusens</h1>
          <div className="flex gap-6">
          <label htmlFor="leftDrusens" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftDrusens" id="" />
            Yes
          </label>
          <label htmlFor="leftDrusens" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftDrusens" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightOphtalmoscopyScar" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightOphtalmoscopyScar" id="" />
            Yes
          </label>
          <label htmlFor="rightOphtalmoscopyScar" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightOphtalmoscopyScar" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Scar</h1>
          <div className="flex gap-6">
          <label htmlFor="leftOphtalmoscopyScar" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftOphtalmoscopyScar" id="" />
            Yes
          </label>
          <label htmlFor="leftOphtalmoscopyScar" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftOphtalmoscopyScar" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightNeovascularization" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightNeovascularization" id="" />
            Yes
          </label>
          <label htmlFor="rightNeovascularization" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightNeovascularization" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Neovascularization</h1>
          <div className="flex gap-6">
          <label htmlFor="leftNeovascularization" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftNeovascularization" id="" />
            Yes
          </label>
          <label htmlFor="leftNeovascularization" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftNeovascularization" id=""  />
            No
          </label>
          </div>
        </div>
      

      <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightCottonWoolSpots" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="rightCottonWoolSpots" id="" />
            Yes
          </label>
          <label htmlFor="rightCottonWoolSpots" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="rightCottonWoolSpots" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Cotton Wool Spots</h1>
          <div className="flex gap-6">
          <label htmlFor="leftCottonWoolSpots" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftCottonWoolSpots" id="" />
            Yes
          </label>
          <label htmlFor="leftCottonWoolSpots" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftCottonWoolSpots" id=""  />
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
      <button id='macula' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Macula</h2>
        {dropdowns.macula ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>
{dropdowns.macula &&(
      <aside className="flex flex-col w-4/5 mx-auto gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightFovealReflex" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="rightFovealReflex" id="" />
            Yes
          </label>
          <label htmlFor="rightFovealReflex" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="rightFovealReflex" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Foveal Reflex</h1>
          <div className="flex gap-6">
          <label htmlFor="leftFovealReflex" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="leftFovealReflex" id="" />
            Yes
          </label>
          <label htmlFor="leftFovealReflex" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="leftFovealReflex" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightMaculaScar" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="rightMaculaScar" id="" />
            Yes
          </label>
          <label htmlFor="rightMaculaScar" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="rightMaculaScar" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Scar</h1>
          <div className="flex gap-6">
          <label htmlFor="leftMaculaScar" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="leftMaculaScar" id="" />
            Yes
          </label>
          <label htmlFor="leftMaculaScar" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="leftMaculaScar" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-6">
          <label htmlFor="rightMaculaHole" className='flex items-center gap-1 '>
            <input type="radio" value={'yes'} name="rightMaculaHole" id="" />
            Yes
          </label>
          <label htmlFor="rightMaculaHole" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="rightMaculaHole" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Hole</h1>
          <div className="flex gap-4">
          <label htmlFor="leftMaculaHole" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="leftMaculaHole" id="" />
            Yes
          </label>
          <label htmlFor="leftMaculaHole" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="leftMaculaHole" id=""  />
            No
          </label>
          </div>
        </div>

        
        <div className="flex gap-52 justify-between">
          <div className="flex justify-between gap-6">
          <label htmlFor="rightMaculaAtrophy" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="rightMaculaAtrophy" id="" />
            Yes
          </label>
          <label htmlFor="rightMaculaAtrophy" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="rightMaculaAtrophy" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Atrophy</h1>
          <div className="flex gap-6">
          <label htmlFor="leftMaculaAtrophy" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="leftMaculaAtrophy" id="" />
            Yes
          </label>
          <label htmlFor="leftMaculaAtrophy" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="leftMaculaAtrophy" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex justify-between gap-6">
          <label htmlFor="rightMaculaHealthy" className='flex items-center gap-1'>
            <input type="radio" value={'yes'} name="rightMaculaHealthy" id="" />
            Yes
          </label>
          <label htmlFor="rightMaculaHealthy" className='flex items-center gap-1'>
            <input type="radio" value={'no'} name="rightMaculaHealthy" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Healthy</h1>
          <div className="flex gap-4">
          <label htmlFor="leftMaculaHealthy" className='flex items-center gap-2'>
            <input type="radio" value={'yes'} name="leftMaculaHealthy" id="" />
            Yes
          </label>
          <label htmlFor="leftMaculaHealthy" className='flex items-center gap-2'>
            <input type="radio" value={'no'} name="leftMaculaHealthy" id=""  />
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

      <button id='intraOcularPressure' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Intra-Ocular Pressure</h2>
        {dropdowns.intraOcularPressure ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>

{dropdowns.intraOcularPressure && (

      <aside className="flex flex-col py-4 gap-12 w-full ">
        <div className="flex justify-between w-full">
          <div className="flex gap-1 flex-col">
            <label htmlFor="iopMeasuringMethod" className="">IOP Measuring Method</label>
            <select name="iopMeasuringMethod" className='border border-[#d0d5dd] rounded-md h-14 p-4 w-[375px]' id=""></select>
          </div>
          <div className="flex gap-1 flex-col">
            <label htmlFor="iopMeasuringMethod" className="">Date and Time Taken</label>
            <input name="iopMeasuringMethod" type='datetime-local' className='border p-4 w-[375px] border-[#d0d5dd] rounded-md h-14 ' id="" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-evenly gap-72">
            <h1 className="font-bold text-2xl">OD</h1>
            <h1 className="font-bold text-2xl">OS</h1>
          </div>
          <div className="flex justify-evenly items-center">
            <input type="text" name='rightIopValue' className="w-52 rounded-md border border-[#d0d5dd] p-4 h-14" placeholder='Enter IOP' />
            <label htmlFor="IopValue" className='text-2xl font-semibold'>IOP Value</label>
            <input type="text" name='leftIopValue' className="w-52 rounded-md border border-[#d0d5dd] p-4 h-14" placeholder='Enter IOP' />
          </div>
        </div>


      </aside>
)}
      <button type="button" onClick={proceedToRefraction} className='mx-auto mr-0 p-4 my-8 rounded-lg bg-[#2f3192] text-white'>Save and Proceed</button>
      </form>
    </main>
  )
}

export default Internals

