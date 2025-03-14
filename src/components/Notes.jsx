import React, { useState } from "react";
import PropTypes from "prop-types";

const Notes = ({ label, onSave }) => {
  const [note, setNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Save note and close modal
  const handleSave = () => {
    onSave(note);
    closeModal();
  };

  return (
    <div className="relative">
      {/* Note Button */}
      <div className="relative group">
        <button
          className="text-blue-600 hover:underline flex items-center gap-1"
          onClick={openModal}
        >
          {note ? "✏️ Update note" : "✏️ Add a note"}
        </button>

        {/* Tooltip to show saved note on hover */}
        {note && (
          <div className="absolute left-0 bottom-full mb-1 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            {note}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">{label}</h2>
            <textarea
              className="w-full h-32 border border-gray-300 p-2 rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type here..."
            ></textarea>

            <div className="flex justify-end mt-4">
              <button
                className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleSave}
              >
                {note ? "Update Note" : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Notes.propTypes = {
  label: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Notes;
