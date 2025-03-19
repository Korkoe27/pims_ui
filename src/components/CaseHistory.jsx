import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";

/** === CaseHistory Component === */
const CaseHistory = ({ patient, appointmentId }) => {
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

  /** === Pre-fill Data When Case History is Available === */
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory.chief_complaint || "");

      // ✅ Pre-fill Selected Conditions from Case History
      if (caseHistory.condition_details) {
        setConditionDetails(
          caseHistory.condition_details.map((cond) => ({
            ocular_condition: cond.ocular_condition.id, // ✅ Ensure correct ID storage
            grading: cond.grading || "1",
            notes: cond.notes || "",
          }))
        );
      }
    }
  }, [caseHistory]);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">
        Fetched Case History Data
      </h2>

      {/* Loading Indicator */}
      {isLoading && <p className="text-gray-500">Loading Data...</p>}

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
          value={conditionDetails} // ✅ Pass the selected conditions
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
    </div>
  );
};

export default CaseHistory;
