import React, { useState } from "react";

const SupervisorGradingButton = ({
  onSubmit,
  sectionLabel = "Supervisor Grading",
  averageMarks = null, // optional
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [marks, setMarks] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    const parsedMarks = parseFloat(marks);
    if (isNaN(parsedMarks)) return alert("Please enter a valid mark.");
    onSubmit?.({ marks: parsedMarks, remarks });
    setIsOpen(false);
    setMarks("");
    setRemarks("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow ml-auto"
      >
        {sectionLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{sectionLabel}</h2>

            {averageMarks !== null && (
              <div className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  Average Marks (Read-only)
                </label>
                <input
                  type="text"
                  value={averageMarks}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-1 font-medium">Marks (0 - 100)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter marks as decimal (e.g. 85.5)"
              />
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
                Submit Marks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorGradingButton;
