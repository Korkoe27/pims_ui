import React from "react";

const ConditionsDropdown = ({ valueOD, valueOS, onChangeOD, onChangeOS, options = [], placeholder }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* OD */}
      <div>
        <h5 className="font-medium text-sm mb-2">OD (Right Eye)</h5>
        <select
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={valueOD}
          onChange={(e) => onChangeOD(e.target.value)}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((opt, idx) => {
            if (typeof opt === "object" && opt !== null) {
              return (
                <option key={opt.value || idx} value={opt.value}>
                  {opt.label}
                </option>
              );
            }
            return (
              <option key={idx} value={opt}>
                {opt}
              </option>
            );
          })}
        </select>
      </div>

      {/* OS */}
      <div>
        <h5 className="font-medium text-sm mb-2">OS (Left Eye)</h5>
        <select
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={valueOS}
          onChange={(e) => onChangeOS(e.target.value)}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((opt, idx) => {
            if (typeof opt === "object" && opt !== null) {
              return (
                <option key={opt.value || idx} value={opt.value}>
                  {opt.label}
                </option>
              );
            }
            return (
              <option key={idx} value={opt}>
                {opt}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default ConditionsDropdown;
