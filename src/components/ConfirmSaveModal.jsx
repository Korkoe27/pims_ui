import React from "react";

const ConfirmSaveModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Confirm Save</h2>
        <p className="text-gray-700">
          A patient with this phone number already exists. Click 'Proceed' to
          continue or check the number and try again.
        </p>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onConfirm}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSaveModal;
