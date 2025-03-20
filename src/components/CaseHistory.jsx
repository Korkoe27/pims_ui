import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi";
import ErrorModal from "../components/ErrorModal";

const CaseHistory = ({ appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientId = selectedAppointment?.patient;

  const { caseHistory, ocularConditions, isLoading } =
    useCaseHistoryData(patientId, appointmentId);

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [conditionDetails, setConditionDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  useEffect(() => {
    if (caseHistory) {
      console.log("📄 Case History Data Fetched:", caseHistory);
      setChiefComplaint(caseHistory.chief_complaint || "");
      setConditionDetails(caseHistory.condition_details || []);
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
        ({ ocular_condition, affected_eye, grading, notes }) => ({
          ocular_condition,
          affected_eye: affected_eye || null,
          grading: grading || null,
          notes: notes || null,
        })
      ),
      patient_history: { id: patientId },
    };

    try {
      await createCaseHistory(newCaseHistory).unwrap();
      setActiveTab("personal history");
    } catch (error) {
      console.error("🚨 Error saving case history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        📝 Case History
      </h2>

      {isLoading && (
        <p className="text-gray-500 animate-pulse">Fetching Data...</p>
      )}

      {/* 🚀 Form Fields */}
      <div className="space-y-6">
        {/* ✅ Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chief Complaint <span className="text-red-500">*</span>
          </label>
          <textarea
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"
            placeholder="Describe the patient's main issue"
          />
        </div>

        {/* ✅ On-Direct Questioning */}
        <div>
          <SearchableSelect
            label="On-Direct Questioning"
            options={ocularConditions || []}
            value={conditionDetails.map((cond) => ({
              value: cond.ocular_condition,
              label: cond.ocular_condition_name,
            }))}
            onChange={setConditionDetails}
          />
        </div>
      </div>

      {/* 🚀 Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-md transition duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Proceed"}
        </button>
      </div>

      {/* 🚀 Error Modal */}
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
