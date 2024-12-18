import React from 'react';

const ProgressBar = ({ step }) => {
  return (
    <div className="flex bg-[#f9fafb]">
      {/* Step 1: Consultation */}
      <div className="w-64">
        <div className="flex justify-end items-center">
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step >= 1 ? 'bg-[#d1d5db]' : 'bg-white'
            }`}
          ></span>
          <span
            className={`border h-[2px] w-28 ${
              step > 1 ? 'bg-[#2f3192]' : 'bg-gray-300'
            }`}
          ></span>
        </div>
        <h1 className="text-center font-medium text-base">Consultation</h1>
      </div>

      {/* Step 2: Diagnosis and Plan */}
      <div className="">
        <div className="flex items-center justify-end">
          <span
            className={`border h-[2px] w-28 ${
              step > 1 ? 'bg-[#2f3192]' : 'bg-gray-300'
            }`}
          ></span>
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step >= 2 ? 'bg-[#d1d5db]' : 'bg-white'
            }`}
          ></span>
          <span
            className={`border h-[2px] w-28 ${
              step > 2 ? 'bg-[#2f3192]' : 'bg-gray-300'
            }`}
          ></span>
        </div>
        <h1 className="text-center font-medium">Diagnosis</h1>
      </div>

      {/* Step 3: Management */}
      <div className="w-64">
        <div className="flex items-center justify-start">
          <span
            className={`border h-[2px] w-28 ${
              step > 2 ? 'bg-[#2f3192]' : 'bg-gray-300'
            }`}
          ></span>
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step >= 3 ? 'bg-[#d1d5db]' : 'bg-white'
            }`}
          ></span>
        </div>
        <h1 className="text-center font-medium">Management</h1>
      </div>
    </div>
  );
};

export default ProgressBar;
