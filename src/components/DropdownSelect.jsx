// components/DropdownSelect.jsx
import React from "react";

const DropdownSelect = ({ value, onChange, options, placeholder }) => {
  return (
    <select
      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder || "Select an option"}</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};

export default DropdownSelect;
