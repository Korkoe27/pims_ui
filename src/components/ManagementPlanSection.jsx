import React from "react";

const ManagementPlanSection = ({ value, onChange }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium mb-1">
        Management Plan <span className="text-red-500">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded-md"
        placeholder="Example: Dispense spectacles..."
      />
    </div>
  );
};

export default ManagementPlanSection;
