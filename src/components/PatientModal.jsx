import React from 'react';
import { Link } from 'react-router-dom';


const PatientModal = ({setIsModalOpen}) => {



    const handleOverlayClick = (event) => {
        if (event.target.classList.contains('modal-overlay')) {
          setIsModalOpen(false);
        }
      };
  return (
    <div>
      <>
       <dialog
        className="flex flex-col m-auto w-[775px] border h-[450px] justify-center items-center modal-overlay"
        onClick={handleOverlayClick}
      >
        <h2 className="font-medium mb-20">
          Choose the clinic in which you are attending to this patient
        </h2>
        <div className="flex justify-between items-center ">
          <Link className="border border-black p-[50px] mx-10 rounded-[5px]">
            Old Site
          </Link>
          <Link className="border border-black p-[50px] mx-10 rounded-[5px]">
            CCTU
          </Link>
          <Link className="border border-black p-[50px] mx-10 rounded-[5px]">
            Science
          </Link>
        </div>
      </dialog>
      </>
    </div>
  )
}

export default PatientModal
