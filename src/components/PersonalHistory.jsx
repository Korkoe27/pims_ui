import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import { useCreatePatientHistoryMutation } from "../redux/api/features/patientHistoryApi";
import SearchableSelect from "./SearchableSelect";
import ErrorModal from "./ErrorModal";

const PersonalHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const { personalHistory, isLoading, isError, error } = usePersonalHistoryData(
    patientId,
    appointmentId
  );

  const { medicalConditions } = useFetchConditionsData();
  const [createPatientHistory, { isLoading: isSaving }] =
    useCreatePatientHistoryMutation();

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const formattedMedical = (medicalConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  useEffect(() => {
    if (
      personalHistory &&
      Array.isArray(personalHistory) &&
      personalHistory.length > 0
    ) {
      const latest = personalHistory[0];

      const existingMedicalHistory = (latest.medical_history_entries || []).map(
        (item) => {
          const match = formattedMedical.find(
            (m) => m.value === item.medical_condition
          );
          return (
            match || {
              value: item.medical_condition,
              label: item.medical_condition_name || "Unknown",
            }
          );
        }
      );

      setMedicalHistory(existingMedicalHistory);
    }
  }, [personalHistory, formattedMedical]);

  const handleMedicalHistorySelect = (option) => {
    setMedicalHistory((prev) => {
      if (!prev.some((item) => item.value === option.value)) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    const payload = {
      patient: patientId,
      appointment: appointmentId,
      medical_history: medicalHistory.map((item) => item.value),
    };

    try {
      await createPatientHistory(payload).unwrap();
      setActiveTab("visual acuity");
    } catch (error) {
      setErrorMessage(
        error?.data || { detail: "Failed to save personal history." }
      );
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Personal History – Medical Conditions
      </h2>

      <SearchableSelect
        label="Medical History"
        options={formattedMedical}
        selectedValues={medicalHistory}
        onSelect={handleMedicalHistorySelect}
        conditionKey="value"
        conditionNameKey="label"
      />

      {/* Debug Payload */}
      <pre className="mt-4 p-4 bg-gray-100 text-sm rounded">
        {JSON.stringify(
          {
            patient: patientId,
            appointment: appointmentId,
            medical_history: medicalHistory.map((item) => item.value),
          },
          null,
          2
        )}
      </pre>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save & Proceed"}
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
