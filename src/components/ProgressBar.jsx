import React from "react";

const ProgressBar = ({ step }) => {
  return (
    <div className="flex bg-[#f9fafb]">
      {/* Step 1: Consultation */}
      <div className="w-64">
        <div className="flex justify-end items-center">
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step === 1 ? "bg-[#2F3192]" : "bg-white"
            }`}
          ></span>
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
        </div>
        <h1 className="text-center font-medium text-base">Consultation</h1>
      </div>

      {/* Step 2: Diagnosis and Plan */}
      <div>
        <div className="flex items-center justify-end">
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step === 2 ? "bg-[#2F3192]" : "bg-white"
            }`}
          ></span>
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
        </div>
        <h1 className="text-center font-medium">Diagnosis and Plan</h1>
      </div>

      {/* Step 3: Management */}
      <div>
        <div className="flex items-center justify-end">
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step === 3 ? "bg-[#2F3192]" : "bg-white"
            }`}
          ></span>
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
        </div>
        <h1 className="text-center font-medium">Management</h1>
      </div>

      {/* ✅ Step 4: Complete */}
      <div className="w-64">
        <div className="flex items-center justify-start">
          <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28"></span>
          <span
            className={`border border-[#2f3192] w-6 h-6 rounded-full ${
              step === 4 ? "bg-[#2F3192]" : "bg-white"
            }`}
          ></span>
        </div>
        <h1 className="text-center font-medium">Complete</h1>
      </div>
    </div>
  );
};

export default ProgressBar;
