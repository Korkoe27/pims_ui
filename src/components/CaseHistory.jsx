// import React, {useState, useEffect} from 'react';
import ProgressBar from './ProgressBar';
import NavMenu from './NavMenu';
import Header from './Header';
import Radios from './Radios';
import CallToActionButtons from './CallToActionButtons';
import Inputs from './Inputs';
import { useNavigate } from 'react-router-dom';




  const CaseHistory = () => {







    // const [formData,  setFormData]  = useState({
    //   selectedOptions:  "",
    //   cheifComplaint:  "",
    //   itching:  "",
    //   tearing:  "",
    //   doubleVision:  "",
    //   discharge:  "",
    //   patientDrugHistory:  "",
    //   selectedOptions:  "",
    // })



    // const handleChange  = (e) =>  {
    //   const {name,  value} =  e.target;
    //   setFormData({
    //     ...formData,
    //     [name]:value
    //   });
 
    //   console.log(formData);
    // }



    const navigate = useNavigate();
    const checkVisualAcuity = () => {
      navigate("/visual-acuity");
    }



  return (
    <div className=' ml-72 my-8 gap-12 flex items flex-col px-8  h-fit w-fit'>
      <Header/>
      <ProgressBar />
      <NavMenu/>

<form action="" className=''>
        <section className='flex gap-28'>
        <aside className='flex flex-col gap-12'>


          <div className='flex flex-col'>
              <h1 className='text-base font-medium text-black'>Cheif Complaint <span className='text-[#ff0000]'>*</span></h1>
              <textarea name="cheifComplaint" placeholder='Type in the patient’s chief complaint' className='p-4 border border-[#d0d5dd] resize-none rounded-md w-96 h-48'  id=""></textarea>
          </div>

          <>
          <h1 className='text-base font-medium text-black'>On Direct Questioning <span className='text-[#ff0000] '>*</span></h1>
            <div className='grid grid-cols-2 gap-8'>
              
              <Radios label={"Burning Sensation"} name={"burningSensation"}/>
              <Radios label={"Itching"} name={"itching"}/>
              <Radios label={"Tearing"} name={"tearing"}/>
              <Radios label={"Double Vision"} name={"doubleVision"}/>
              <Radios label={"Discharge"} name={"discharge"}/>
              <Radios label={"Pain"} name={"pain"}/>
              <Radios label={"FBS"} name={"fbs"}/>
              <Radios label={"Photophobia"} name={"photobia"}/>

            </div>
            <CallToActionButtons displayButton='show'  button1={'Add a note'} button2={'Add option'}/>
            
          </>
          <>
          <h1 className='text-base font-medium text-black'>Patient Medical History<span className='text-[#ff0000] '>*</span></h1>
            <div className='grid grid-cols-2 gap-8'>
              
              <Radios label={"Asthma"} name={"asthma"}/>
              <Radios label={"Ulcer"} name={"ulcer"}/>
              <Radios label={"Diabetes"} name={"diabetes"}/>
              <Radios label={"Hypertension"} name={"hypertension"}/>
              <Radios label={"Sickle Cell"} name={"sickleCell"}/>
              <Radios label={"STD/STI"} name={"stdSti"}/>

            </div>
            <CallToActionButtons displayButton='hidden'  button1={'Add a note'} button2={'Add option'}/>
            
          </>
        </aside>



        <aside className="flex flex-col gap-12">
          <>
          <h1 className='text-base font-medium text-black'>Patient Ocular History<span className='text-[#ff0000] '>*</span></h1>

          <Inputs type={'date'} label={'Last Eye Examination'}/>
          <div className='grid grid-cols-2 gap-8'>
            
            <Radios label={"Spectacles"} name={"spectacles"}/>
            <Radios label={"Eye Surgery"} name={"eyeSurgery"}/>
            <Radios label={"Ocular Trauma"} name={"ocularTrauma"}/>
            <Radios label={"Glaucoma"} name={"glaucoma"}/>
          </div>
          <CallToActionButtons displayButton='hidden'  button1={'Add a note'} button2={'Add option'}/>
          </>


          <>
          <h1 className='text-base font-medium text-black'>Family Medical History<span className='text-[#ff0000] '>*</span></h1>
            <div className='grid grid-cols-2 gap-8'>
              
              <Radios label={"Asthma"} name={"familyAsthma"}/>
              <Radios label={"Ulcer"} name={"familyUlcer"}/>
              <Radios label={"Diabetes"} name={"familyDiabetes"}/>
              <Radios label={"Hypertension"} name={"familyHypertension"}/>
              <Radios label={"Sickle Cell"} name={"familySickleCell"}/>
              <Radios label={"STD/STI"} name={"stdSti"}/>

            </div>
            <CallToActionButtons displayButton='hidden'  button1={'Add a note'} button2={'Add option'}/>
            
          </>

          <>
          <h1 className='text-base font-medium text-black'>Family Ocular History<span className='text-[#ff0000] '>*</span></h1>
            <div className='grid grid-cols-2 gap-8'>
              
              <Radios label={"Spectacles"} name={"familySpectacles"}/>
              <Radios label={"Eye Surgery"} name={"familyEyeSurgery"}/>
              <Radios label={"Ocular Trauma"} name={"familyOcularTrauma"}/>
              <Radios label={"Glaucoma"} name={"familyGlaucoma"}/>

            </div>
            <CallToActionButtons displayButton='hidden' button1={'Add a note'} button2={'Add option'}/>
            
          </>

          <>
          <Inputs type={'text'} label={"Parent's Drug History"} name={"patientDrugHistory"} placeholder={"Add another Drug"}/>
          <CallToActionButtons displayButton='hidden' button1={'Add another drug'} button2={'Add a note'}/>
          </>
          <>
          <Inputs type={'text'} label={"Patient’s Allergies"} placeholder={"Enter the name of patient's allergy"}/>
          <CallToActionButtons displayButton='hidden'  button1={'Add another drug'} button2={'Add a note'}/>
          </>
          <>
          <Inputs type={'text'} label={"Patient’s Hobbies"} placeholder={"Enter patient’s hobby"}/>
          <CallToActionButtons displayButton='hidden'  button1={'Add another hobby'} button2={'Add a note'}/>
          </>
          

        </aside>
      </section>
      <div className='flex gap-8 justify-evenly my-16'>
          <button type="button" className='w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]'>Back</button>
          <button type="submit" onClick={checkVisualAcuity} className='w-56 p-4 rounded-lg text-white bg-[#2f3192]'>Save and proceed</button>
        </div>
</form>

    </div>
  )
}

export default CaseHistory
