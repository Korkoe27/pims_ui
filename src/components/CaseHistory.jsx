import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi"; // ✅ Import mutation

/** === CaseHistory Component === */
const CaseHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  /** === Fetch Data Using Custom Hook === */
  const {
    patientHistory,
    caseHistory,
    ocularConditions,
    isLoading,
  } = useCaseHistoryData(patientId, appointmentId);

  /** === State Management === */
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [conditionDetails, setConditionDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation(); // ✅ API Mutation Hook

  /** === Pre-fill Data When Case History is Available === */
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");

      // ✅ Pre-fill Selected Conditions from Case History
      if (caseHistory.condition_details) {
        setConditionDetails(
          caseHistory.condition_details.map((cond) => ({
            ocular_condition: cond.ocular_condition.id,
            grading: cond.grading || "1",
            notes: cond.notes || "",
          }))
        );
      }
    }
  }, [caseHistory]);

  /** === Handle Save & Proceed === */
  const handleSaveAndProceed = async () => {
    setErrorMessage(null);

    if (!chiefComplaint.trim()) {
      setErrorMessage({ chief_complaint: ["Chief complaint is required."] });
      return;
    }

    if (conditionDetails.length === 0) {
      setErrorMessage({
        condition_details: ["At least one ocular condition must be selected."],
      });
      return;
    }

    if (!patientId) {
      setErrorMessage({
        patient: ["Patient ID is required but was not found."],
      });
      return;
    }

    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: conditionDetails.map(({ ocular_condition, grading, notes }) => ({
        ocular_condition,
        grading,
        notes,
      })),
      patient_history: {
        id: patientId,
      },
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("visual acuity"); // ✅ Move to the next step
    } catch (error) {
      console.error("🚨 Error saving case history:", error);
      setErrorMessage(error?.data || { general: ["An unexpected error occurred."] });
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">
        Case History
      </h2>

      {/* Loading Indicator */}
      {isLoading && <p className="text-gray-500">Loading Data...</p>}

      {/* Errors */}
      {errorMessage && (
        <div className="text-red-500 mb-4">
          {Object.entries(errorMessage).map(([field, messages]) => (
            <p key={field}>{`${field}: ${messages}`}</p>
          ))}
        </div>
      )}

      {/* Chief Complaint */}
      <div className="mb-4">
        <label className="font-medium text-gray-600">
          Chief Complaint <span className="text-red-500">*</span>
        </label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          className="w-full p-3 border rounded-md"
          placeholder="Describe the patient's main issue"
        />
      </div>

      {/* On Direct Questioning (Ocular Conditions) */}
      <div className="mb-4">
        <label className="font-medium text-gray-600">
          On Direct Questioning <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          label="Select Ocular Conditions"
          name="condition_details"
          options={ocularConditions || []}
          value={conditionDetails}
          onChange={(selected) =>
            setConditionDetails(
              selected.map((condition) => ({
                ocular_condition: condition.ocular_condition || condition.id,
                grading: condition.grading || "1",
                notes: condition.notes || "",
              }))
            )
          }
        />
      </div>

      {/* Display Data */}
      <div className="space-y-4">
        {/* Patient History */}
        {patientHistory && (
          <div>
            <h3 className="font-bold text-lg">Patient History</h3>
            <pre className="p-3 bg-gray-100 rounded">
              {JSON.stringify(patientHistory, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ✅ Save & Proceed Button */}
      <button
        onClick={handleSaveAndProceed}
        disabled={isSubmitting}
        className="bg-[#2F3192] text-white px-6 py-2 rounded-md hover:bg-[#252774] disabled:bg-gray-400 mt-4"
      >
        {isSubmitting ? "Saving..." : "Save & Proceed"}
      </button>
    </div>
  );
};

export default CaseHistory;
