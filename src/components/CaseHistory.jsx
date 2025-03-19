import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi";
import ErrorModal from "../components/ErrorModal"; // ✅ Import Error Modal

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
  const [showErrorModal, setShowErrorModal] = useState(false); // ✅ State for error modal
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
            affected_eye: cond.affected_eye ?? "",
            grading: cond.grading ?? "",
            notes: cond.notes ?? "",
          }))
        );
      }
    }
  }, [caseHistory]);

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!chiefComplaint.trim()) {
      setErrorMessage({ chief_complaint: ["Chief complaint is required."] });
      setShowErrorModal(true);
      return;
    }

    if (conditionDetails.length === 0) {
      setErrorMessage({
        condition_details: ["At least one ocular condition must be selected."],
      });
      setShowErrorModal(true);
      return;
    }

    if (!patientId) {
      setErrorMessage({
        patient: ["Patient ID is required but was not found."],
      });
      setShowErrorModal(true);
      return;
    }

    const newCaseHistory = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: conditionDetails.map(
        ({ ocular_condition, affected_eye, grading, notes }) => {
          const data = { ocular_condition };

          if (affected_eye) {
            data.affected_eye = affected_eye;
          }

          if (grading !== "" && grading !== undefined) {
            data.grading = grading;
          }

          if (notes !== "" && notes !== undefined) {
            data.notes = notes;
          }

          return data;
        }
      ),
      patient_history: { id: patientId },
    };

    console.log("🚀 Data Being Sent:", newCaseHistory);

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error saving case history:", error);
      if (error?.data) {
        setErrorMessage(error.data); // ✅ Pass the error object directly
      } else {
        setErrorMessage({ general: ["An unexpected error occurred."] });
      }
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-4 text-gray-700">Case History</h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}

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

      {/* ✅ Error Modal */}
      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default CaseHistory;
