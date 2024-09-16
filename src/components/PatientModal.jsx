import React, {useRef, useEffect} from 'react';


const PatientModal = ({setIsModalOpen}) => {
  const specificElementRef = useRef(null);


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
        className="flex flex-col m-auto w-[1200px] border h-[696px] justify-center items-center modal-overlay "
        ref={specificElementRef}
        
      >
        <h2 className="font-bold text-2xl leading-8 w-1/2 text-center mb-20">
          Choose the clinic in which you are attending to this patient
        </h2>
        <form className="flex flex-col justify-center items-center gap-16">
          <div className='flex justify-center items-center w-full'>
          <button type='button' data-hospital-type="uccHospital" id='hospitalType' className="border group border-[#1b1c1e] text-xl font-bold w-80 h-80   flex flex-col items-end p-6 focus:border-[#2F3192] focus:bg-[#ececf9] hover:bg-[#ececf9]  mx-10 rounded-md cursor-pointer">
          <span className='border h-6 w-6 rounded-full group-focus:border-[#2f3192] group-focus:border-4 mt-0 mr-0 border-[#1b1c1e]'></span>
           <span className='m-auto text-xl group-focus:text-[#2f3192]'>UCC Hospital</span>
          </button>
          <button type='button' data-hospital-type="science" id='hospitalType' className="border group border-[#1b1c1e] text-xl font-bold w-80 h-80   flex flex-col items-end p-6 focus:border-[#2F3192] focus:bg-[#ececf9] hover:bg-[#ececf9]  mx-10 rounded-md cursor-pointer">
          <span className='border h-6 w-6 rounded-full group-focus:border-[#2f3192] group-focus:border-4 mt-0 mr-0 border-[#1b1c1e]'></span>
            <span className='m-auto text-xl group-focus:text-[#2f3192]'>Sciene</span>
            <span></span>
          </button>
          <button type='button' data-hospital-type="cctu" id='hospitalType' className="border group border-[#1b1c1e] text-xl font-bold w-80 h-80   flex flex-col items-end p-6 focus:border-[#2F3192] focus:bg-[#ececf9] hover:bg-[#ececf9]  mx-10 rounded-md cursor-pointer">
          <span className='border h-6 w-6 rounded-full group-focus:border-[#2f3192] group-focus:border-4 mt-0 mr-0 border-[#1b1c1e]'></span>
          <span className='m-auto text-xl group-focus:text-[#2f3192]'>CCTU</span>
          </button>  
          </div>
          
          <button className='h-14 w-72 bg-[#2f3192] text-white p-4 rounded-lg' type='button'>Continue</button>
        </form>
        
      </dialog>
    </div>
  )
}

export default PatientModal
