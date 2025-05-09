// components/NotesTextArea.jsx
import React from "react";

const NotesTextArea = ({
  valueOD,
  valueOS,
  onChangeOD,
  onChangeOS,
  placeholderOD = "Enter notes for OD",
  placeholderOS = "Enter notes for OS",
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">OD</label>
        <textarea
          value={valueOD}
          onChange={(e) => onChangeOD(e.target.value)}
          placeholder={placeholderOD}
          className="w-full border p-3 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">OS</label>
        <textarea
          value={valueOS}
          onChange={(e) => onChangeOS(e.target.value)}
          placeholder={placeholderOS}
          className="w-full border p-3 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default NotesTextArea;
