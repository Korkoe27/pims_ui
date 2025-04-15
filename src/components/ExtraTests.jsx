import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { showToast } from "../components/ToasterHelper";

const TEST_OPTIONS = [
  "OCT",
  "Perimetry",
  "Color Vision",
  "Visual Field Test",
  "B-Scan",
  "Pachymetry",
];

const ExtraTests = ({ appointmentId, setFlowStep, setActiveTab }) => {
  const [selectedTest, setSelectedTest] = useState("");
  const [uploadedTests, setUploadedTests] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTest) {
      showToast("Please select a test and upload a file", "error");
      return;
    }

    const newTest = {
      id: Date.now(),
      name: selectedTest,
      file,
      url: URL.createObjectURL(file),
    };

    setUploadedTests((prev) => [...prev, newTest]);
    setSelectedTest("");
    e.target.value = null;
  };

  const handleDelete = (id) => {
    setUploadedTests((prev) => prev.filter((test) => test.id !== id));
  };

  const proceedToDiagnosis = () => {
    showToast("Extra tests submitted!", "success");
    setFlowStep("diagnosis");
  };

  return (
    <div className="py-10 px-6 flex flex-col items-center max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Extra Tests</h2>

      {/* Select + Upload */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full mb-10">
        <select
          value={selectedTest}
          onChange={(e) => setSelectedTest(e.target.value)}
          className="border border-gray-300 p-3 rounded w-full md:w-72"
        >
          <option value="">Select a test</option>
          {TEST_OPTIONS.map((test) => (
            <option key={test} value={test}>
              {test}
            </option>
          ))}
        </select>

        <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded cursor-pointer whitespace-nowrap border border-gray-400">
          Upload File
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Tests Grid */}
      {uploadedTests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          {uploadedTests.map((test) => (
            <div
              key={test.id}
              className="border rounded-lg p-4 shadow relative bg-white"
            >
              <button
                onClick={() => handleDelete(test.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <IoClose size={20} />
              </button>
              <p className="font-semibold mb-2">{test.name}</p>
              {test.file.type.startsWith("image/") ? (
                <img
                  src={test.url}
                  alt={test.name}
                  className="w-full h-40 object-cover rounded"
                />
              ) : (
                <p className="text-sm text-gray-600 truncate">
                  {test.file.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => setActiveTab("refraction")}
          className="px-6 py-3 border border-[#2f3192] text-[#2f3192] rounded-lg hover:bg-indigo-50 w-64"
        >
          ← Back to Refraction
        </button>
        <button
          onClick={proceedToDiagnosis}
          className="px-6 py-3 bg-[#2f3192] text-white rounded-lg hover:bg-[#1e217a] w-64"
        >
          Proceed to Diagnosis →
        </button>
      </div>
    </div>
  );
};

export default ExtraTests;
