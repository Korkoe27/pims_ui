import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react"; // Close icon

const AddNoteModal = ({ isOpen, onClose, onSave }) => {
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Note</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <textarea
          className="w-full p-3 border rounded-md h-28"
          placeholder="Type here"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          onClick={() => {
            onSave(note);
            setNote("");
            onClose();
          }}
          className="w-full mt-4 py-2 px-4 bg-[#2F3192] text-white rounded-md hover:bg-[#252774] transition-all"
        >
          Add Note
        </button>
      </div>
    </div>
  );
};

AddNoteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddNoteModal;
