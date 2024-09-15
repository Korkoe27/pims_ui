import React, {useRef, useEffect} from 'react';
import { Link } from 'react-router-dom';


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
          <Link className="border border-black text-xl font-bold w-80 h-80  items-center flex justify-center mx-10 rounded-md">
            UCC
          </Link>
          <Link className="border border-black text-xl font-bold w-80 h-80  items-center flex justify-center mx-10 rounded-md">
            CCTU
          </Link>
          <Link className="border border-black text-xl font-bold w-80 h-80  items-center flex justify-center mx-10 rounded-md">
            Science
          </Link>  
          </div>
          
          <button className='h-14 w-72 bg-[#2f3192] text-white p-4 rounded-lg'>Continue</button>
        </form>
        
      </dialog>
    </div>
  )
}

export default PatientModal
