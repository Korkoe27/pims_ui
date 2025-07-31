import React from "react";

const allSteps = [
  "Consultation",
  "Diagnosis and Plan",
  "Management",
  "Case Management Guide", // Student only
  "Submit",                // Student only
  "Complete",              // Lecturer only
  "Grading",               // Lecturer only
  "Logs",                  // Student only
];

const getStepsForRole = (role) => {
  const normalizedRole = role?.toLowerCase();
  if (normalizedRole === "student") {
    return [
      "Consultation",
      "Diagnosis and Plan",
      "Management",
      "Case Management Guide",
      "Submit",
      "Logs",
    ];
  } else if (normalizedRole === "lecturer") {
    return [
      "Consultation",
      "Diagnosis and Plan",
      "Management",
      "Grading",
      "Complete",
    ];
  }
  return allSteps;
};

const ProgressBar = ({ step, role }) => {
  const stepsToRender = getStepsForRole(role);

  return (
    <div className="flex bg-[#f9fafb] w-full">
      {stepsToRender.map((label, index) => (
        <div key={index} className={`w-full max-w-[${100 / stepsToRender.length}%]`}>
          <div className="flex items-center justify-center">
            {/* Left connector */}
            {index > 0 && <span className="flex-grow h-[2px] bg-[#2f3192]"></span>}

            {/* Step Circle */}
            <span
              className={`border border-[#2f3192] w-6 h-6 rounded-full ${
                step === index + 1 ? "bg-[#2F3192]" : "bg-white"
              }`}
            ></span>

            {/* Right connector */}
            {index < stepsToRender.length - 1 && (
              <span className="flex-grow h-[2px] bg-[#2f3192]"></span>
            )}
          </div>
          <h1 className="text-center font-medium text-sm mt-2">{label}</h1>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
