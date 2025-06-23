// components/CheckboxInput.jsx
import React from "react";

const CheckboxInput = ({
  checkedOD = false,
  checkedOS = false,
  onChangeOD = () => {},
  onChangeOS = () => {},
  labelOD = "OD (Right Eye)",
  labelOS = "OS (Left Eye)",
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center space-x-2">
        <input
          id="checkbox-od"
          type="checkbox"
          checked={checkedOD}
          onChange={(e) => onChangeOD(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="checkbox-od" className="text-sm font-medium">
          {labelOD}
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="checkbox-os"
          type="checkbox"
          checked={checkedOS}
          onChange={(e) => onChangeOS(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="checkbox-os" className="text-sm font-medium">
          {labelOS}
        </label>
      </div>
    </div>
  );
};

export default CheckboxInput;
