import React from "react";
import { FaUserMd, FaFileMedical, FaPills } from "react-icons/fa";

// Authoritative steps list — consultation ends at Management
const steps = [
  { label: "Consultation", icon: <FaUserMd /> },
  { label: "Diagnosis", icon: <FaFileMedical /> },
  { label: "Management", icon: <FaPills /> }, // FINAL
];

/**
 * Props:
 *  - step: number | string (1-based index or step label)
 *      e.g., step={2} or step="Diagnosis"
 */
const ProgressBar = ({ step = 1 }) => {
  // Allow passing a label instead of an index
  const stepIndexFromLabel =
    typeof step === "string"
      ? Math.max(
          1,
          steps.findIndex((s) => s.label.toLowerCase() === step.toLowerCase()) + 1
        )
      : step;

  const current = Math.min(Math.max(stepIndexFromLabel, 1), steps.length);

  return (
    <div className="w-full bg-[#f9fafb] py-4">
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}
        aria-label="Consultation progress"
      >
        {steps.map((s, i) => {
          const isReached = i + 1 <= current; // this node reached/active
          const leftActive = i > 0 && i + 1 <= current; // connector to previous
          const rightActive = i + 1 < current; // connector to next

          return (
            <div key={s.label} className="relative flex flex-col items-center">
              {/* Left half-connector (skip for first) */}
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute left-0 right-1/2 top-4 h-[2px] rounded ${
                    leftActive ? "bg-[#2f3192]" : "bg-gray-300"
                  }`}
                />
              )}
              {/* Right half-connector (skip for last) */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute left-1/2 right-0 top-4 h-[2px] rounded ${
                    rightActive ? "bg-[#2f3192]" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Circle with icon */}
              <span
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border text-lg transition-colors ${
                  isReached
                    ? "bg-[#2f3192] text-white border-[#2f3192]"
                    : "bg-white text-[#2f3192] border-[#2f3192]"
                }`}
                aria-current={isReached && i + 1 === current ? "step" : undefined}
                title={s.label}
              >
                {s.icon}
              </span>

              {/* Label */}
              <span className="mt-2 text-center font-medium text-sm leading-tight max-w-[140px] whitespace-normal">
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
