import React from "react";

const gradingOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "NA", label: "Not Applicable" },
];

const GradingSelect = ({ value, onChange }) => {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium">Grading</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="">Select grading</option>
        {gradingOptions.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GradingSelect;
