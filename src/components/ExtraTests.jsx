import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { showToast } from "../components/ToasterHelper";
import ExtraTestUploadModal from "./ExtraTestUploadModal";
import {
  useCreateExtraTestMutation,
  useFetchExtraTestsQuery,
} from "../redux/api/features/extraTestsApi";

export const TEST_OPTIONS = [
  "OCT",
  "Perimetry",
  "Color Vision",
  "Visual Field Test",
  "B-Scan",
  "Pachymetry",
];

const ExtraTests = ({
  appointmentId,
  setFlowStep,
  setActiveTab,
  setTabCompletionStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: uploadedTests = [], refetch } =
    useFetchExtraTestsQuery(appointmentId);

  const proceedToDiagnosis = () => {
    if (uploadedTests.length === 0) {
      showToast("Please upload at least one test before proceeding.", "error");
      return;
    }

    setTabCompletionStatus?.((prev) => ({
      ...prev,
      "extra tests": true,
    }));

    showToast("Extra tests submitted!", "success");
    setFlowStep("diagnosis");
  };

  return (
    <div className="py-10 px-6 flex flex-col items-center max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Extra Tests</h2>

      {/* Upload Modal Trigger */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#2f3192] text-white py-2 px-6 rounded hover:bg-[#1e217a]"
        >
          + Upload Extra Test
        </button>
      </div>

      {/* Uploaded Tests Grid */}
      {uploadedTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          {uploadedTests.map((test) => (
            <div
              key={test.id}
              className="border rounded-lg p-4 shadow relative bg-white"
            >
              <p className="font-semibold mb-2">{test.name}</p>
              {test.file?.includes(".pdf") ? (
                <p className="text-sm text-gray-600 truncate">{test.file}</p>
              ) : (
                <img
                  src={test.file}
                  alt={test.name}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              {test.notes && (
                <p className="text-sm mt-2 text-gray-700 italic">
                  {test.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">No extra tests uploaded yet.</p>
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

      {/* Modal */}
      <ExtraTestUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointmentId={appointmentId}
        onUploadSuccess={() => {
          refetch(); // if you're using useFetchExtraTestsQuery
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExtraTests;
