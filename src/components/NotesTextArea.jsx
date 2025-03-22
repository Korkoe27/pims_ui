import React from "react";

const NotesTextArea = ({ value, onChange }) => {
  return (
    <div className="mt-2">
      <label className="block text-sm font-medium">Notes</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded p-2"
        rows={2}
        placeholder="Additional notes..."
      />
    </div>
  );
};

export default NotesTextArea;
