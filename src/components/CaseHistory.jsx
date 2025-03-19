import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi"; // ✅ Import mutation

const CaseHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const { patientHistory, caseHistory, ocularConditions, isLoading } =
    useCaseHistoryData(patientId, appointmentId);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [conditionDetails, setConditionDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  useEffect(() => {
    if (caseHistory) {
      console.log("📄 Case History Data Fetched:", caseHistory);

      setChiefComplaint(caseHistory.chief_complaint || "");

      if (caseHistory.condition_details) {
        setConditionDetails(
          caseHistory.condition_details.map((cond) => ({
            ocular_condition: cond.ocular_condition,
            ocular_condition_name: cond.ocular_condition_name,
            grading: cond.grading ?? "", // ✅ Ensure grading is properly stored
            notes: cond.notes ?? "", // ✅ Ensure notes are properly stored
          }))
        );
      }
    }
  }, [caseHistory]);

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
      condition_details: conditionDetails.map(({ ocular_condition, grading, notes }) => {
        const data = { ocular_condition };

        if (grading !== "" && grading !== undefined) {
          data.grading = grading; // ✅ Only include grading if provided
        }

        if (notes !== "" && notes !== undefined) {
          data.notes = notes; // ✅ Only include notes if provided
        }

        return data;
      }),
      patient_history: { id: patientId },
    };

    console.log("🚀 Data Being Sent:", newCaseHistory); // ✅ Debugging: Log request payload

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error saving case history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">Case History</h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}
      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage.general}</div>
      )}

      <textarea
        value={chiefComplaint}
        onChange={(e) => setChiefComplaint(e.target.value)}
        className="w-full p-3 border rounded-md"
        placeholder="Describe the patient's main issue"
      />

      <SearchableSelect
        label="Select Ocular Conditions"
        name="condition_details"
        options={ocularConditions || []}
        value={conditionDetails}
        onChange={setConditionDetails}
      />

      <button
        onClick={handleSaveAndProceed}
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-md"
      >
        {isSubmitting ? "Saving..." : "Save & Proceed"}
      </button>
    </div>
  );
};

export default CaseHistory;
