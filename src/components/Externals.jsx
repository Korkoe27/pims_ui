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
    <div className='ml-72 py-8 w-full px-8 min-h-screen flex flex-col bg-[#f9fafb] gap-12'>
        <Header/>
      <ProgressBar />
      <NavMenu/>
    <form action="" className='flex gap-8 flex-col w-fit h-full py-4'>

      <button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Eyelids & Eyelashes</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>

      {isSectionVisible && (
      <aside className="flex flex-col w-4/5 mx-auto gap-12">
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

<button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      // onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Conjuctiva</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>
      <aside className="hidden flex-col w-4/5 mx-auto gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightHyperemia" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightHyperemia" id="" />
            Yes
          </label>
          <label htmlFor="rightHyperemia" className='flex items-center'>
            <input type="radio" value={'no'} name="rightHyperemia" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Hyperemia</h1>
          <div className="flex gap-4">
          <label htmlFor="leftHypermia" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftHypermia" id="" />
            Yes
          </label>
          <label htmlFor="leftHypermia" className='flex items-center'>
            <input type="radio" value={'no'} name="leftHypermia" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightDischarge" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightDischarge" id="" />
            Yes
          </label>
          <label htmlFor="rightDischarge" className='flex items-center'>
            <input type="radio" value={'no'} name="rightDischarge" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Discharge</h1>
          <div className="flex gap-4">
          <label htmlFor="leftDischarge" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftDischarge" id="" />
            Yes
          </label>
          <label htmlFor="leftDischarge" className='flex items-center'>
            <input type="radio" value={'no'} name="leftDischarge" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightEpiphora" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightEpiphora" id="" />
            Yes
          </label>
          <label htmlFor="rightEpiphora" className='flex items-center'>
            <input type="radio" value={'no'} name="rightEpiphora" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Epiphora</h1>
          <div className="flex gap-4">
          <label htmlFor="leftEpiphora" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftEpiphora" id="" />
            Yes
          </label>
          <label htmlFor="leftEpiphora" className='flex items-center'>
            <input type="radio" value={'no'} name="leftEpiphora" id=""  />
            No
          </label>
          </div>
        </div>

        
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightGrowth" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightGrowth" id="" />
            Yes
          </label>
          <label htmlFor="rightGrowth" className='flex items-center'>
            <input type="radio" value={'no'} name="rightGrowth" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Growth</h1>
          <div className="flex gap-4">
          <label htmlFor="leftGrowth" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftGrowth" id="" />
            Yes
          </label>
          <label htmlFor="leftGrowth" className='flex items-center'>
            <input type="radio" value={'no'} name="leftGrowth" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightSwellingChemosis" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightSwellingChemosis" id="" />
            Yes
          </label>
          <label htmlFor="rightSwellingChemosis" className='flex items-center'>
            <input type="radio" value={'no'} name="rightSwellingChemosis" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Swelling/Chemosis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftSwellingChemosis" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftSwellingChemosis" id="" />
            Yes
          </label>
          <label htmlFor="leftSwellingChemosis" className='flex items-center'>
            <input type="radio" value={'no'} name="leftSwellingChemosis" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightConjunctivaScarringLesion" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightConjunctivaScarringLesion" id="" />
            Yes
          </label>
          <label htmlFor="rightConjunctivaScarringLesion" className='flex items-center'>
            <input type="radio" value={'no'} name="rightConjunctivaScarringLesion" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Scarring/Lesion</h1>
          <div className="flex gap-4">
          <label htmlFor="leftConjunctivaScarringLesion" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftConjunctivaScarringLesion" id="" />
            Yes
          </label>
          <label htmlFor="leftScarringLesion" className='flex items-center'>
            <input type="radio" value={'no'} name="leftConjunctivaScarringLesion" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightConjunctivaClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightConjunctivaClear" id="" />
            Yes
          </label>
          <label htmlFor="rightConjunctivaClear" className='flex items-center'>
            <input type="radio" value={'no'} name="rightConjunctivaClear" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Clear</h1>
          <div className="flex gap-4">
          <label htmlFor="leftConjunctivaClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftConjunctivaClear" id="" />
            Yes
          </label>
          <label htmlFor="leftConjunctivaClear" className='flex items-center'>
            <input type="radio" value={'no'} name="leftConjunctivaClear" id=""  />
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
      


      <button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      // onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Cornea</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>
      

      <aside className="hidden flex-col w-4/5 mx-auto gap-12">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightAbrasions" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightAbrasions" id="" />
            Yes
          </label>
          <label htmlFor="rightAbrasions" className='flex items-center'>
            <input type="radio" value={'no'} name="rightAbrasions" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Abrasions</h1>
          <div className="flex gap-4">
          <label htmlFor="leftAbrasions" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftAbrasions" id="" />
            Yes
          </label>
          <label htmlFor="leftAbrasions" className='flex items-center'>
            <input type="radio" value={'no'} name="leftAbrasions" id=""  />
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
          <h1 className="text-xl font-semibold">Scarring</h1>
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
          <label htmlFor="rightArcusSenilisJuvenilis" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightArcusSenilisJuvenilis" id="" />
            Yes
          </label>
          <label htmlFor="rightArcusSenilisJuvenilis" className='flex items-center'>
            <input type="radio" value={'no'} name="rightArcusSenilisJuvenilis" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Arcus Senilis/Juvenilis</h1>
          <div className="flex gap-4">
          <label htmlFor="leftArcusSenilisJuvenilis" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftArcusSenilisJuvenilis" id="" />
            Yes
          </label>
          <label htmlFor="leftArcusSenilisJuvenilis" className='flex items-center'>
            <input type="radio" value={'no'} name="leftArcusSenilisJuvenilis" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightUlcer" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightUlcer" id="" />
            Yes
          </label>
          <label htmlFor="rightUlcer" className='flex items-center'>
            <input type="radio" value={'no'} name="rightUlcer" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Ulcer</h1>
          <div className="flex gap-4">
          <label htmlFor="leftUlcer" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftUlcer" id="" />
            Yes
          </label>
          <label htmlFor="leftUlcer" className='flex items-center'>
            <input type="radio" value={'no'} name="leftUlcer" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightForeignBody" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightForeignBody" id="" />
            Yes
          </label>
          <label htmlFor="rightForeignBody" className='flex items-center'>
            <input type="radio" value={'no'} name="rightForeignBody" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Foreign Body</h1>
          <div className="flex gap-4">
          <label htmlFor="leftForeignBody" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftForeignBody" id="" />
            Yes
          </label>
          <label htmlFor="leftForeignBody" className='flex items-center'>
            <input type="radio" value={'no'} name="leftForeignBody" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightNeovascularization" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightNeovascularization" id="" />
            Yes
          </label>
          <label htmlFor="rightNeovascularization" className='flex items-center'>
            <input type="radio" value={'no'} name="rightNeovascularization" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Neovascularization</h1>
          <div className="flex gap-4">
          <label htmlFor="leftNeovascularization" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftNeovascularization" id="" />
            Yes
          </label>
          <label htmlFor="leftNeovascularization" className='flex items-center'>
            <input type="radio" value={'no'} name="leftNeovascularization" id=""  />
            No
          </label>
          </div>
        </div>


        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightCorneaClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightCorneaClear" id="" />
            Yes
          </label>
          <label htmlFor="rightCorneaClear" className='flex items-center'>
            <input type="radio" value={'no'} name="rightCorneaClear" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Clear</h1>
          <div className="flex gap-4">
          <label htmlFor="leftCorneaClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftCorneaClear" id="" />
            Yes
          </label>
          <label htmlFor="leftCorneaClear" className='flex items-center'>
            <input type="radio" value={'no'} name="leftCorneaClear" id=""  />
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


      
      <button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      // onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Pupil</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>



      <aside className="hidden flex-col gap-12 w-4/5 m-auto">
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightRound" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightRound" id="" />
            Yes
          </label>
          <label htmlFor="rightRound" className='flex items-center'>
            <input type="radio" value={'no'} name="rightRound" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Round</h1>
          <div className="flex gap-4">
          <label htmlFor="leftRound" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftRound" id="" />
            Yes
          </label>
          <label htmlFor="leftRound" className='flex items-center'>
            <input type="radio" value={'no'} name="leftRound" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightReactiveToLight" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightReactiveToLight" id="" />
            Yes
          </label>
          <label htmlFor="rightReactiveToLight" className='flex items-center'>
            <input type="radio" value={'no'} name="rightReactiveToLight" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Reactive to light</h1>
          <div className="flex gap-4">
          <label htmlFor="leftReactiveToLight" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftReactiveToLight" id="" />
            Yes
          </label>
          <label htmlFor="leftReactiveToLight" className='flex items-center'>
            <input type="radio" value={'no'} name="leftReactiveToLight" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightReactiveToAccommodation" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightReactiveToAccommodation" id="" />
            Yes
          </label>
          <label htmlFor="rightReactiveToAccommodation" className='flex items-center'>
            <input type="radio" value={'no'} name="rightReactiveToAccommodation" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Reactive to Accommodation</h1>
          <div className="flex gap-4">
          <label htmlFor="leftReactiveToAccommodation" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftReactiveToAccommodation" id="" />
            Yes
          </label>
          <label htmlFor="leftReactiveToAccommodation" className='flex items-center'>
            <input type="radio" value={'no'} name="leftReactiveToAccommodation" id=""  />
            No
          </label>
          </div>
        </div>



        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightEqualSize" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightEqualSize" id="" />
            Yes
          </label>
          <label htmlFor="rightEqualSize" className='flex items-center'>
            <input type="radio" value={'no'} name="rightEqualSize" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Equal Size</h1>
          <div className="flex gap-4">
          <label htmlFor="leftEqualSize" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftEqualSize" id="" />
            Yes
          </label>
          <label htmlFor="leftEqualSize" className='flex items-center'>
            <input type="radio" value={'no'} name="leftEqualSize" id=""  />
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




      <button id='dropDown' className="flex p-4 justify-between w-[800px] 
      cursor-pointer h-14 rounded-lg items-center bg-white"
      // onClick={toggleSection}
      type='button'
      >
        <h2 className='text-base font-semibold'>Anterior Chamber</h2>
        {isSectionVisible ? <FaChevronUp className='h-4 w-4' /> : <FaChevronDown className='w-4 h-4' />}
      </button>



      <aside className="hidden flex-col py-4 gap-12 w-4/5 m-auto">

      <div className="flex justify-between gap-12">
        <div className="flex flex-col w-full">
          <label htmlFor="anteriorChamberTest" className=''>Anterior Chamber Test</label>
          <select name="anteriorChamberTest" className='border border-[#d0d5dd] rounded-md h-14' id=""></select>
        </div>
        <div className="flex flex-col w-full ">
          <label htmlFor="anteriorChambergrade" className=''>Anterior Chamber Grading</label>
          <select name="anteriorChambergrade" className='border border-[#d0d5dd] rounded-md h-14' id=""></select>
        </div>
      </div>
        <div className="flex justify-between  px-10">
          <h1 className="font-bold text-2xl">OD</h1>
          <h1 className="font-bold text-2xl">OS</h1>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightCellsFlares" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightCellsFlares" id="" />
            Yes
          </label>
          <label htmlFor="rightCellsFlares" className='flex items-center'>
            <input type="radio" value={'no'} name="rightCellsFlares" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Cells/Flares</h1>
          <div className="flex gap-4">
          <label htmlFor="leftCellsFlares" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftCellsFlares" id="" />
            Yes
          </label>
          <label htmlFor="leftCellsFlares" className='flex items-center'>
            <input type="radio" value={'no'} name="leftCellsFlares" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightHyphaema" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightHyphaema" id="" />
            Yes
          </label>
          <label htmlFor="rightHyphaema" className='flex items-center'>
            <input type="radio" value={'no'} name="rightHyphaema" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Hyphaema</h1>
          <div className="flex gap-4">
          <label htmlFor="leftHyphaema" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftHyphaema" id="" />
            Yes
          </label>
          <label htmlFor="leftHyphaema" className='flex items-center'>
            <input type="radio" value={'no'} name="leftHyphaema" id=""  />
            No
          </label>
          </div>
        </div>
        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightHypopyon" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightHypopyon" id="" />
            Yes
          </label>
          <label htmlFor="rightHypopyon" className='flex items-center'>
            <input type="radio" value={'no'} name="rightHypopyon" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Hypopyon</h1>
          <div className="flex gap-4">
          <label htmlFor="leftHypopyon" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftHypopyon" id="" />
            Yes
          </label>
          <label htmlFor="leftHypopyon" className='flex items-center'>
            <input type="radio" value={'no'} name="leftHypopyon" id=""  />
            No
          </label>
          </div>
        </div>



        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightKeraticPrecipitates" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightKeraticPrecipitates" id="" />
            Yes
          </label>
          <label htmlFor="rightKeraticPrecipitates" className='flex items-center'>
            <input type="radio" value={'no'} name="rightKeraticPrecipitates" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Keratic Precipitates</h1>
          <div className="flex gap-4">
          <label htmlFor="leftKeraticPrecipitates" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftKeraticPrecipitates" id="" />
            Yes
          </label>
          <label htmlFor="leftKeraticPrecipitates" className='flex items-center'>
            <input type="radio" value={'no'} name="leftKeraticPrecipitates" id=""  />
            No
          </label>
          </div>
        </div>




        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightSynechiae" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightSynechiae" id="" />
            Yes
          </label>
          <label htmlFor="rightSynechiae" className='flex items-center'>
            <input type="radio" value={'no'} name="rightSynechiae" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Synechiae</h1>
          <div className="flex gap-4">
          <label htmlFor="leftSynechiae" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftSynechiae" id="" />
            Yes
          </label>
          <label htmlFor="leftSynechiae" className='flex items-center'>
            <input type="radio" value={'no'} name="leftSynechiae" id=""  />
            No
          </label>
          </div>
        </div>





        <div className="flex gap-52 justify-between">
          <div className="flex gap-4">
          <label htmlFor="rightAnteriorChamberClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="rightAnteriorChamberClear" id="" />
            Yes
          </label>
          <label htmlFor="rightAnteriorChamberClear" className='flex items-center'>
            <input type="radio" value={'no'} name="rightAnteriorChamberClear" id=""  />
            No
          </label>
          </div>
          <h1 className="text-xl font-semibold">Clear</h1>
          <div className="flex gap-4">
          <label htmlFor="leftAnteriorChamberClear" className='flex items-center'>
            <input type="radio" value={'yes'} name="leftAnteriorChamberClear" id="" />
            Yes
          </label>
          <label htmlFor="leftAnteriorChamberClear" className='flex items-center'>
            <input type="radio" value={'no'} name="leftAnteriorChamberClear" id=""  />
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

      <button type="button" className='mx-auto mr-0 p-4 my-8 rounded-lg bg-[#2f3192] text-white'>Save and Proceed</button>
    </form>

    </div>
  )

  
}

export default Externals
