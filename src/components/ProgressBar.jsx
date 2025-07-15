import React from "react";

const steps = [
  "Consultation",
  "Diagnosis and Plan",
  "Management",
  "Case Management Guide",
  "Submit",
  "Complete",
  "Grading",
  "Logs",
];

const ProgressBar = ({ step }) => {
  return (
    <div className="flex bg-[#f9fafb] w-full">
      {steps.map((label, index) => (
        <div key={index} className="w-1/5">
          <div className="flex items-center justify-center">
            {/* Left connector (skip for first item) */}
            {index > 0 && (
              <span className="flex-grow h-[2px] bg-[#2f3192]"></span>
            )}

            {/* Step Circle */}
            <span
              className={`border border-[#2f3192] w-6 h-6 rounded-full ${
                step === index + 1 ? "bg-[#2F3192]" : "bg-white"
              }`}
            ></span>

            {/* Right connector (skip for last item) */}
            {index < steps.length - 1 && (
              <span className="flex-grow h-[2px] bg-[#2f3192]"></span>
            )}
          </div>

          {/* Step Label */}
          <h1 className="text-center font-medium text-sm mt-2">{label}</h1>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
