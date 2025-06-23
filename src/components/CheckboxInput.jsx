import React from "react";

const CheckboxInput = ({
  checkedOD = null,
  checkedOS = null,
  onChangeOD = () => {},
  onChangeOS = () => {},
  labelOD = "OD (Right Eye)",
  labelOS = "OS (Left Eye)",
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* OD */}
      <div>
        <p className="text-sm font-medium mb-1">{labelOD}</p>
        <div className="flex space-x-4">
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              name={`checkbox-od`}
              checked={checkedOD === true}
              onChange={() => onChangeOD(true)}
              className="text-indigo-600"
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              name={`checkbox-od`}
              checked={checkedOD === false}
              onChange={() => onChangeOD(false)}
              className="text-indigo-600"
            />
            <span>No</span>
          </label>
        </div>
      </div>

      {/* OS */}
      <div>
        <p className="text-sm font-medium mb-1">{labelOS}</p>
        <div className="flex space-x-4">
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              name={`checkbox-os`}
              checked={checkedOS === true}
              onChange={() => onChangeOS(true)}
              className="text-indigo-600"
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center space-x-1">
            <input
              type="radio"
              name={`checkbox-os`}
              checked={checkedOS === false}
              onChange={() => onChangeOS(false)}
              className="text-indigo-600"
            />
            <span>No</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CheckboxInput;
