import React from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'
import Inputs from './Inputs'

const Diagnosis = () => {
  return (
    <main className='ml-72 my-8 px-8 w-fit flex flex-col gap-12'>
                    <Header/>
                    <ProgressBar />
            <form action='' className=' flex flex-col w-fit gap-8'>
        <div className="flex flex-col gap-2">
            <label htmlFor="differentialDiagnosis" className='font-medium text-base'>Differential Diagnosis</label>
            <textarea name="differentialDiagnosis" placeholder='Type in your differential diagnosis' className='border w-[375px] border-[#d0d5dd] h-48  rounded-md p-4' id=""></textarea>
        </div>

        <div className="flex flex-col gap-1">
        <Inputs type={'text'} placeholder={'Enter diagnosis'} label={'Final Diagnosis'} name={'finalDiagnosis'} /> 
        <button className="bg-white w-fit gap-1 flex font-semibold text-base text-[#2f3192]"><span className='w-5 h-5 font-bold'>+</span>Add a query
            </button>   
        </div>
        
        <div className="flex flex-col gap-2">
            <label htmlFor="mgtPlan" className="font-medium text-base">Your Management Plan</label>
            <textarea name="mgtPlan" placeholder='Example: 
                            Dispense spectacles
                            OD: +2.00/-1.00x180
                            OS: +1.00/-1.25x180' 
                    className='w-[375px] h-48 border rounded-lg border-[#d0d5dd] p-4' id=""></textarea>
        </div>
        <button type='button' className="bg-[#2f3192] mx-auto mr-0 text-white p-4 w-fit rounded-lg h-14">Proceed to Management</button>
    </form>
    </main>

  )
}

export default Diagnosis
