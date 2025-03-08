import React, { useState } from "react";
import PropTypes from "prop-types";

const NotesModal = ({ isOpen, onClose, onSave, fieldLabel }) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-medium mb-4">{fieldLabel} - Add Note</h2>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-md resize-none"
          placeholder="Type your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end mt-4">
          <button
            className="mr-3 px-4 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => {
              onSave(note);
              setNote(""); // Reset after saving
              onClose();
            }}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

NotesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  fieldLabel: PropTypes.string.isRequired,
};

export default NotesModal;
