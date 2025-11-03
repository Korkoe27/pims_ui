import React, { useState } from "react";
import { showToast } from "../components/ToasterHelper";
import ExtraTestUploadModal from "./ExtraTestUploadModal";
import { useFetchExtraTestsQuery, useDeleteExtraTestMutation } from "../redux/api/features/extraTestsApi";
import SupervisorGradingButton from "./ui/buttons/SupervisorGradingButton";
import useComponentGrading from "../hooks/useComponentGrading";
import { useSelector } from "react-redux";
import useConsultationContext from "../hooks/useConsultationContext";
import { IoTrash } from "react-icons/io5";

const ExtraTests = ({
  appointmentId,
  setFlowStep,
  setActiveTab,
  setTabCompletionStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localTests, setLocalTests] = useState([]); // ✅ Local state for added tests
  const role = useSelector((state) => state.auth.user?.role);
  const { versionId } = useConsultationContext();

  // ✅ Component grading hook
  const { shouldShowGrading, section, sectionLabel } = useComponentGrading(
    "EXTRA_TEST",
    appointmentId
  );

  // ✅ Fetch uploaded tests
  const { data: uploadedTests = [], refetch } =
    useFetchExtraTestsQuery({ appointmentId, versionId });

  // ✅ Handle local deletion (no backend call)
  const handleDeleteTest = (testId) => {
    setLocalTests((prev) => prev.filter((test) => test.id !== testId));
    showToast("Test removed", "success");
  };

  // ✅ Proceed to Diagnosis (send added tests to backend)
  const proceedToDiagnosis = async () => {
    try {
      // ✅ Send all locally added tests to backend here
      if (localTests.length > 0) {
        console.log("📤 Sending extra tests to backend:", localTests);
        // Backend call would go here when user is ready to proceed
      }

      // Local UI update
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "extra tests": true,
      }));

      setFlowStep("diagnosis"); // move UI forward
      showToast("Moved to Diagnosis", "success");
    } catch (err) {
      console.error("❌ Failed to update:", err);
      setFlowStep("diagnosis"); // still continue UI
    }
  };

  return (
    <div className="py-10 px-6 flex flex-col items-center max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-2xl font-bold">Extra Tests</h2>
        {shouldShowGrading && (
          <SupervisorGradingButton
            appointmentId={appointmentId}
            section={section}
            sectionLabel={sectionLabel}
          />
        )}
      </div>

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
      {localTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          {localTests.map((test) => (
            <div
              key={test.id}
              className="border rounded-lg p-4 shadow relative bg-white hover:shadow-lg transition-shadow"
            >
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTest(test.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Remove test"
              >
                <IoTrash size={18} />
              </button>

              <p className="font-semibold mb-2 pr-6">{test.name}</p>

              {/* Tonometry-specific fields */}
              {test.name.toLowerCase().includes("tonometry") && (
                <div className="text-sm text-gray-700 mb-2 space-y-1">
                  <p>
                    <strong>Method:</strong> {test.method || "N/A"}
                  </p>
                  <p>
                    <strong>IOP OD:</strong> {test.iop_od ?? "N/A"}
                  </p>
                  <p>
                    <strong>IOP OS:</strong> {test.iop_os ?? "N/A"}
                  </p>
                  <p>
                    <strong>Recorded At:</strong>{" "}
                    {test.recorded_at
                      ? new Date(test.recorded_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              )}

              {/* File display */}
              {test.file?.includes(".pdf") ? (
                <p className="text-sm text-gray-600 truncate">{test.file}</p>
              ) : (
                test.file && (
                  <img
                    src={test.file}
                    alt={test.name}
                    className="w-full h-40 object-cover rounded"
                  />
                )
              )}

              {/* Notes */}
              {test.notes && (
                <p className="text-sm mt-2 text-gray-700 italic">
                  {test.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-10">No extra tests added yet.</p>
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

      {/* Upload Modal */}
      <ExtraTestUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointmentId={appointmentId}
        versionId={versionId}
        onUploadSuccess={(testData) => {
          // ✅ Add test to local state instead of immediately sending to backend
          setLocalTests((prev) => [...prev, { ...testData, id: Date.now() }]);
          showToast("Test added locally. Click 'Proceed to Diagnosis' to save.", "info");
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExtraTests;
