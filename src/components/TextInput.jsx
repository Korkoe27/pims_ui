// components/TextInput.jsx
import React from "react";

const TextInput = ({
  valueOD,
  valueOS,
  onChangeOD,
  onChangeOS,
  placeholderOD = "Enter value for OD",
  placeholderOS = "Enter value for OS",
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">OD</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={valueOD}
          placeholder={placeholderOD}
          onChange={(e) => onChangeOD(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">OS</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={valueOS}
          placeholder={placeholderOS}
          onChange={(e) => onChangeOS(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TextInput;
