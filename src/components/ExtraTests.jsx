import React, { useState } from "react";
import { showToast } from "../components/ToasterHelper";
import ExtraTestUploadModal from "./ExtraTestUploadModal";
import { useFetchExtraTestsQuery } from "../redux/api/features/extraTestsApi";
import {
  useTransitionAppointmentMutation,
  useGetAppointmentFlowContextQuery,
} from "../redux/api/features/appointmentsApi";
import SupervisorGradingButton from "./SupervisorGradingButton";

const ExtraTests = ({
  appointmentId,
  setFlowStep,
  setActiveTab,
  setTabCompletionStatus,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch uploaded tests
  const { data: uploadedTests = [], refetch } =
    useFetchExtraTestsQuery(appointmentId);

  // Fetch flow context so we know allowed transitions
  const { data: flowContext } = useGetAppointmentFlowContextQuery(
    appointmentId,
    {
      skip: !appointmentId,
    }
  );

  // Mutation for FSM transition
  const [transitionAppointment, { isLoading: transitioning }] =
    useTransitionAppointmentMutation();

  const proceedToDiagnosis = async () => {
    try {
      // local UI update
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "extra tests": true,
      }));

      setFlowStep("diagnosis"); // just move UI forward

      // optional: one backend update
      await transitionAppointment({
        appointmentId,
        body: { to_status: "Diagnosis Added", reason: "Extra tests completed" },
      }).unwrap();

      showToast("Moved to Diagnosis", "success");
    } catch (err) {
      console.error("❌ Failed to update backend:", err);
      // fallback: still show UI
      setFlowStep("diagnosis");
    }
  };

  return (
    <div className="py-10 px-6 flex flex-col items-center max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold">Extra Tests</h2>
      <SupervisorGradingButton
        sectionLabel="Grading: Extra Tests"
        onSubmit={(grading) => {
          console.log("Grading submitted for Extra Tests:", grading);
        }}
      />

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
          disabled={transitioning}
          className="px-6 py-3 bg-[#2f3192] text-white rounded-lg hover:bg-[#1e217a] w-64"
        >
          {transitioning ? "Processing..." : "Proceed to Diagnosis →"}
        </button>
      </div>

      {/* Upload Modal */}
      <ExtraTestUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointmentId={appointmentId}
        onUploadSuccess={() => {
          refetch();
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default ExtraTests;
