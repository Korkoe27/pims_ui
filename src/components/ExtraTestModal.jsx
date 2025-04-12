import React from "react";

const ExtraTestModal = ({ isOpen, onClose, testName, onSave, initialData }) => {
  const [note, setNote] = React.useState(initialData?.note || "");
  const [file, setFile] = React.useState(initialData?.file || null);

  const handleSave = () => {
    onSave({ note, file });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Add Extra Test</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Note:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            placeholder="Write observations or remarks..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />
          {file && (
            <p className="text-xs mt-1 text-green-700">📁 {file.name}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-[#2f3192] text-white hover:bg-[#1e217a]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraTestModal;
