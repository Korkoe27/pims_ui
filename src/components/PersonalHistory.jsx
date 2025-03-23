import React, { useState } from "react";
import { useSelector } from "react-redux";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import ErrorModal from "../components/ErrorModal";

const lastExamOptions = [
  { value: "never", label: "Never" },
  { value: "less_than_a_year", label: "Less than a year ago" },
  { value: "1_to_2_years", label: "1–2 years ago" },
  { value: "over_2_years", label: "More than 2 years ago" },
];

const PersonalHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const {
    createPatientHistory,
    createPatientHistoryStatus: { isLoading: isSubmitting },
  } = usePersonalHistoryData(patientId, appointmentId);

  const [lastEyeExam, setLastEyeExam] = useState("");
  const [drugHistory, setDrugHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSaveAndProceed = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!patientId) {
      setErrorMessage({
        patient: ["Patient ID is required but was not found."],
      });
      setShowErrorModal(true);
      return;
    }

    const newPersonalHistory = {
      appointment: appointmentId,
      patient: patientId,
      last_eye_examination: lastEyeExam || null,
      drug_history: drugHistory,
      allergies,
      social_history: socialHistory,
    };

    try {
      await createPatientHistory(newPersonalHistory).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      console.error("🚨 Error saving personal history:", error);
      setErrorMessage(
        error?.data || { general: ["An unexpected error occurred."] }
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="font-bold text-2xl mb-6 text-gray-700">
        Personal History
      </h2>

      {/* Last Eye Examination */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">
          Last Eye Examination
        </label>
        <select
          value={lastEyeExam}
          onChange={(e) => setLastEyeExam(e.target.value)}
          className="w-full border p-3 rounded-md"
        >
          <option value="">-- Select --</option>
          {lastExamOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Drug History */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">
          Drug History
        </label>
        <textarea
          value={drugHistory}
          onChange={(e) => setDrugHistory(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter any drug history..."
        />
      </div>

      {/* Allergies */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">
          Allergies
        </label>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter known allergies..."
        />
      </div>

      {/* Social History */}
      <div className="mb-10">
        <label className="block font-medium mb-2 text-gray-700">
          Social History
        </label>
        <textarea
          value={socialHistory}
          onChange={(e) => setSocialHistory(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter social history (e.g., smoking, alcohol)..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => setActiveTab("case history")}
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md w-full hover:bg-gray-300"
        >
          Back
        </button>

        <button
          onClick={handleSaveAndProceed}
          disabled={isSubmitting}
          className={`text-white px-6 py-2 rounded-md w-full ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save & Proceed"}
        </button>
      </div>

      {showErrorModal && errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default PersonalHistory;
