import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedClinic } from "../redux/slices/clinicSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const SelectClinicModal = ({ setIsModalOpen }) => {
  const selectedClinic = useSelector((state) => state.clinic.selectedClinic);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const specificElementRef = useRef(null);

  const handleClinicSelection = (clinic) => {
    dispatch(setSelectedClinic(clinic));
  };

  const registerPatient = () => {
    if (selectedClinic) {
      setIsModalOpen(false);
      navigate("/register-patient");
    } else {
      toast.error("Please select a clinic");
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        specificElementRef.current &&
        !specificElementRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsModalOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]">
      <Toaster />
      <dialog
        className="flex flex-col z-50 my-10 m-auto w-[1200px] border h-[696px] justify-center items-center modal-overlay "
        ref={specificElementRef}
      >
        <h2 className="font-bold text-2xl leading-8 w-1/2 text-center mb-20">
          Choose the clinic in which you are attending to this patient
        </h2>
        <form className="flex flex-col justify-center items-center gap-16">
          <div className="flex justify-center items-center w-full">
            <button
              type="button"
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === "Old Site"
                  ? "bg-[#ececf9] border-[#2F3192]"
                  : ""
              }`}
              onClick={() => handleClinicSelection("Old Site")}
            >
              <span
                className={`border h-6 w-6 rounded-full ${
                  selectedClinic === "Old Site"
                    ? "border-[#2f3192] border-4"
                    : "border-[#1b1c1e]"
                }`}
              ></span>
              <span className="m-auto text-xl">Old Site</span>
            </button>
            <button
              type="button"
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === "New Site"
                  ? "bg-[#ececf9] border-[#2F3192]"
                  : ""
              }`}
              onClick={() => handleClinicSelection("New Site")}
            >
              <span
                className={`border h-6 w-6 rounded-full ${
                  selectedClinic === "New Site"
                    ? "border-[#2f3192] border-4"
                    : "border-[#1b1c1e]"
                }`}
              ></span>
              <span className="m-auto text-xl">Science</span>
            </button>
            <button
              type="button"
              className={`border group border-[#1b1c1e] text-xl font-bold w-80 h-80 flex flex-col items-end p-6 mx-10 rounded-md cursor-pointer ${
                selectedClinic === "CCTU" ? "bg-[#ececf9] border-[#2F3192]" : ""
              }`}
              onClick={() => handleClinicSelection("CCTU")}
            >
              <span
                className={`border h-6 w-6 rounded-full ${
                  selectedClinic === "CCTU"
                    ? "border-[#2f3192] border-4"
                    : "border-[#1b1c1e]"
                }`}
              ></span>
              <span className="m-auto text-xl">CCTU</span>
            </button>
          </div>

          <button
            onClick={registerPatient}
            className="h-14 w-72 bg-[#2f3192] text-white p-4 rounded-lg"
            type="button"
          >
            Continue
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default SelectClinicModal;
