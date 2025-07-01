import React from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CompleteConsultation = ({ appointmentId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 bg-white rounded-md shadow-md">
      <div className="flex items-center justify-center bg-green-100 rounded-full w-20 h-20 mb-6">
        <IoIosCheckmarkCircle size={40} color="#0f973d" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        Consultation Completed
      </h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        You’ve completed all stages of this consultation. You may now proceed to
        the dashboard or attend to the next patient.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate("/appointments")}
          className="bg-[#0F973D] text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
        >
          Attend to Next Patient
        </button>
        <button
          onClick={() => navigate("/")}
          className="border border-[#2f3192] text-[#2f3192] px-6 py-3 rounded-lg hover:bg-[#2f3192] hover:text-white"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CompleteConsultation;
