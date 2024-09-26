import React from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'


const Management = () => {
    return(
        <div className='ml-72 my-8 px-8 w-fit flex flex-col gap-12'>
        <Header/>
        <ProgressBar />
        <form action="" className=' flex flex-col w-[440px] gap-12'>
           <label htmlFor="treatment" className='text-left text-base font-medium'>Treatment / Management Option(s)</label>
        <div className="grid grid-cols-3 gap-5">
            <label htmlFor="eyeDrops" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="eyeDrops" id="" />
                Eye Drops
            </label>
            <label htmlFor="topicalOintment" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="topicalOintment" id="" />
                Topical ointment
            </label>
            <label htmlFor="systemicMeds" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="systemicMeds" id="" />
                Systemic medication
            </label>
            <label htmlFor="spectacles" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="spectacles" id="" />
                Spectacles
            </label>
            <label htmlFor="contactLens" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="contactLens" id="" />
                Contact Lenses
            </label>
            <label htmlFor="lowVisionAid" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="lowVisionAid" id="" />
                Low Vision aid
            </label>
            <label htmlFor="therapy" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="therapy" id="" />
                Therapy
            </label>
            <label htmlFor="surgery" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="surgery" id="" />
                Surgery
            </label>
            <label htmlFor="referral" className='text-base flex items-center gap-1'>
                <input type="checkbox" name="referral" id="" />
                Referral
            </label>
            
        </div> 
        <div className="flex flex-col gap-1">
            <label htmlFor="mgtPlanProtocol" className="">Management Plan / Protocol</label>
            <textarea name="mgtPlanProtocol" className='border border-[#d0d5dd] h-48 w-[375px]' placeholder='Type in management plan / protocol' id=""></textarea>
        </div>
        <button className='bg-[#2f3192] text-white m-auto  items-right justify-right text-center rounded-lg h-14 w-24'>Finish</button>
        </form>
        
    </div>
  )
}

export default Management
