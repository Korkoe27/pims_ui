// components/NotesTextArea.jsx
import React from "react";

const NotesTextArea = ({
  value,
  onChange,
  placeholder = "Enter notes",
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Notes</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border p-3 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default NotesTextArea;
