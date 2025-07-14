import React from "react";

const ProgressBar = ({ step, role }) => {
  const isStudent = role === "student";
  const isLecturer = role === "lecturer";

  const commonSteps = [
    { label: "Consultation" },
    { label: "Diagnosis & Plan" },
    { label: "Management" },
  ];

  const studentOnlySteps = [
    { label: "Case Mgmt Guide" },
    { label: "Submission" },
  ];

  const lecturerOnlySteps = [
    { label: "Grading" },
    { label: "Complete" },
  ];

  const finalStep = { label: "Logs" };

  // Merge steps based on role
  const steps = [
    ...commonSteps,
    ...(isStudent ? studentOnlySteps : []),
    ...(isLecturer ? lecturerOnlySteps : []),
    finalStep,
  ];

  return (
    <div className="flex bg-[#f9fafb] overflow-x-auto px-4 py-6">
      {steps.map((stepData, index) => {
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex flex-col items-center w-28">
            <div className="flex items-center w-full">
              {/* Line before */}
              {!isFirst && (
                <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] flex-1 mr-2"></span>
              )}

              {/* Circle */}
              <span
                className={`border border-[#2f3192] w-6 h-6 rounded-full ${
                  step === index + 1 ? "bg-[#2F3192]" : "bg-white"
                }`}
              ></span>

              {/* Line after */}
              {!isLast && (
                <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] flex-1 ml-2"></span>
              )}
            </div>

            {/* Label */}
            <h1 className="text-center font-medium mt-2 text-sm break-words">
              {stepData.label}
            </h1>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
