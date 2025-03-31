import React from "react";

const AffectedEyeSelect = ({ value, onChange }) => {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium">Affected Eye</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="">Select...</option>
        <option value="OD">Right Eye</option>
        <option value="OS">Left Eye</option>
        <option value="OU">Both Eyes</option>
      </select>
    </div>
  );
};

export default AffectedEyeSelect;
