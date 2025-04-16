import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { showToast } from "../components/ToasterHelper";
import { useCreateExtraTestMutation } from "../redux/api/features/extraTestsApi"; // ✅ Correct file name

const TEST_OPTIONS = [
  "OCT",
  "Perimetry",
  "Color Vision",
  "Visual Field Test",
  "B-Scan",
  "Pachymetry",
];

const ExtraTestUploadModal = ({
  isOpen,
  onClose,
  appointmentId,
  onUploadSuccess,
}) => {
  const [testName, setTestName] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);

  const [createExtraTest] = useCreateExtraTestMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testName || !file) {
      showToast("Test name and file are required.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", testName);
    formData.append("notes", notes);
    formData.append("file", file);

    try {
      await createExtraTest({ appointmentId, formData }).unwrap();
      showToast("Extra test uploaded successfully!", "success");
      onUploadSuccess?.();
      onClose();
    } catch (error) {
      showToast("Failed to upload test.", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Extra Test
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Select a test</option>
            {TEST_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes (optional)"
            rows={4}
            className="border rounded p-3"
          />

          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded p-2"
          />

          <button
            type="submit"
            className="bg-[#2f3192] text-white py-2 px-4 rounded hover:bg-[#1e217a]"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExtraTestUploadModal;
