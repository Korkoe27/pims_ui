import React from "react";
import { FaUserMd, FaFileMedical, FaPills, FaMoneyBillWave, FaCapsules } from "react-icons/fa";

const steps = [
  { label: "Consultation", icon: <FaUserMd /> },
  { label: "Diagnosis", icon: <FaFileMedical /> },
  { label: "Management", icon: <FaPills /> },
  { label: "Payment", icon: <FaMoneyBillWave /> },
  { label: "Medication Dispensing", icon: <FaCapsules /> },
];

const ProgressBar = ({ step = 1 }) => {
  const current = Math.min(Math.max(step, 1), steps.length);

  return (
    <div className="w-full bg-[#f9fafb] py-4">
      {/* Equal columns for each step */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}
      >
        {steps.map((s, i) => {
          const reached = i + 1 <= current;
          return (
            <div key={s.label} className="relative flex flex-col items-center">
              {/* Left half-connector (skip for first) */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="absolute left-0 right-1/2 top-4 h-[2px] bg-[#2f3192]"
                />
              )}
              {/* Right half-connector (skip for last) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 right-0 top-4 h-[2px] bg-[#2f3192]"
                />
              )}

              {/* Circle with icon */}
              <span
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border border-[#2f3192] text-lg ${
                  reached ? "bg-[#2f3192] text-white" : "bg-white text-[#2f3192]"
                }`}
              >
                {s.icon}
              </span>

              {/* Label */}
              <span
                className="mt-2 text-center font-medium text-sm leading-tight max-w-[140px] whitespace-normal"
                style={{ textWrap: "balance" }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
