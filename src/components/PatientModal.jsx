import React, {useRef, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";


const PatientModal = ({setIsModalOpen}) => {
  const specificElementRef = useRef(null);

  const navigate = useNavigate();

  const [selectedClinic, setSelectedClinic] = useState(false);

  const handleClinicSelection = (clinic) => {
    setSelectedClinic(clinic);
  };


  const registerPatient = () => {
    if (selectedClinic) {
      setIsModalOpen(false); 
      // console.log('Selected clinic:', selectedClinic);
      navigate("/register-patient");
    } else {
      alert('Please select a clinic!');
    }
  };

      useEffect(() => {
        const handleEscape = (event) => {
          if (event.key === 'Escape') {
            setIsModalOpen(false);
          }
        };
    
        const handleClickOutside = (event) => {
          if (
            specificElementRef.current && // Ensure the specific element is referenced
            !specificElementRef.current.contains(event.target)
          ) {
            setIsModalOpen(false);
          }
        };
    
        window.addEventListener('keydown', handleEscape);
        window.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          window.removeEventListener('keydown', handleEscape);
          window.removeEventListener('mousedown', handleClickOutside);
        };
      }, [setIsModalOpen]);
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]'>
       <dialog
        className="flex flex-col my-10 m-auto w-[1200px] border h-[696px] justify-center items-center modal-overlay "
        ref={specificElementRef}
        
      >
        <h2 className="font-bold text-2xl leading-8 w-1/2 text-center mb-20">
          Choose the clinic in which you are attending to this patient
        </h2>
        <form className="flex flex-col justify-center items-center gap-16">
          <div className='flex justify-center items-center w-full'>
          <button
              type='button'
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === 'oldsite' ? 'bg-[#ececf9] border-[#2F3192]' : ''
              }`}
              onClick={() => handleClinicSelection('oldsite')}
            >
              <span className={`border h-6 w-6 rounded-full ${selectedClinic === 'oldsite' ? 'border-[#2f3192] border-4' : 'border-[#1b1c1e]'}`}></span>
              <span className='m-auto text-xl'>Old Site</span>
            </button>
            <button
              type='button'
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === 'ucc' ? 'bg-[#ececf9] border-[#2F3192]' : ''
              }`}
              onClick={() => handleClinicSelection('ucc')}
            >
              <span className={`border h-6 w-6 rounded-full ${selectedClinic === 'ucc' ? 'border-[#2f3192] border-4' : 'border-[#1b1c1e]'}`}></span>
              <span className='m-auto text-xl'>UCC</span>
            </button>
            <button
              type='button'
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === 'cctu' ? 'bg-[#ececf9] border-[#2F3192]' : ''
              }`}
              onClick={() => handleClinicSelection('cctu')}
            >
              <span className={`border h-6 w-6 rounded-full ${selectedClinic === 'cctu' ? 'border-[#2f3192] border-4' : 'border-[#1b1c1e]'}`}></span>
              <span className='m-auto text-xl'>CCTU</span>
            </button>  
          </div>
          
          <button onClick={registerPatient} className='h-14 w-72 bg-[#2f3192] text-white p-4 rounded-lg' type='button'>Continue</button>
        </form>
        
      </dialog>


    </div>
  )
}

export default PatientModal
