import React, { useState } from "react";

const SupervisorGradingButton = ({ onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [grade, setGrade] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!grade) return alert("Please select a grade.");
    onSubmit?.({ grade, remarks });
    setIsOpen(false);
    setGrade("");
    setRemarks("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow ml-auto"
      >
        Supervisor Grading
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Supervisor Grading</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select a grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter any feedback..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Submit Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorGradingButton;
