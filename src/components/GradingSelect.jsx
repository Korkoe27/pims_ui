import React from "react";

const gradingOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "NA", label: "Not Applicable" },
];

const GradingSelect = ({
  valueOD,
  valueOS,
  onChangeOD,
  onChangeOS,
  placeholder,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* OD */}
      <div>
        <label className="block text-sm font-medium mb-1">
          OD (Right Eye) - Grading
        </label>
        <select
          value={valueOD}
          onChange={(e) => onChangeOD(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">{placeholder || "Select grading"}</option>
          {gradingOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {/* OS */}
      <div>
        <label className="block text-sm font-medium mb-1">
          OS (Left Eye) - Grading
        </label>
        <select
          value={valueOS}
          onChange={(e) => onChangeOS(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">{placeholder || "Select grading"}</option>
          {gradingOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GradingSelect;
