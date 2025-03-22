import React, { useState } from "react";
import { useSelector } from "react-redux";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import ErrorModal from "../components/ErrorModal";
import GradingSelect from "../components/GradingSelect";
import NotesTextArea from "../components/NotesTextArea";
import AffectedEyeSelect from "../components/AffectedEyeSelect";

const PersonalHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const {
    medicalConditions,
    ocularConditions,
    createPatientHistory,
    createPatientHistoryStatus: { isLoading: isSubmitting },
    isLoading,
  } = usePersonalHistoryData(patientId, appointmentId);

  const formattedMedicalConditions = (medicalConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const formattedOcularConditions = (ocularConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [ocularHistory, setOcularHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSelect = (option) => {
    if (medicalHistory.some((m) => m.id === option.value)) {
      setErrorMessage({ detail: "This condition is already selected." });
      setShowErrorModal(true);
      return;
    }

    setMedicalHistory((prev) => [
      ...prev,
      {
        id: option.value,
        name: option.label,
        grading: "",
        notes: "",
      },
    ]);
  };

  const handleOcularSelect = (option) => {
    if (ocularHistory.some((o) => o.id === option.value)) {
      setErrorMessage({ detail: "This condition is already selected." });
      setShowErrorModal(true);
      return;
    }

    setOcularHistory((prev) => [
      ...prev,
      {
        id: option.value,
        name: option.label,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  const updateCondition = (id, field, value) => {
    setMedicalHistory((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const updateOcularCondition = (id, field, value) => {
    setOcularHistory((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

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
      medical_history: medicalHistory.map((m) => m.id),
      ocular_history: ocularHistory.map((o) => o.id),
      condition_details: ocularHistory.map((o) => ({
        ocular_condition: o.id,
        affected_eye: o.affected_eye,
        grading: o.grading,
        notes: o.notes,
      })),
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
      <h2 className="font-bold text-2xl mb-4 text-gray-700">
        Personal Medical & Ocular History
      </h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}

      {/* Medical History Section */}
      <div className="mb-10">
        <SearchableSelect
          label="Patient Medical History"
          options={formattedMedicalConditions}
          selectedValues={medicalHistory.map((m) => ({
            value: m.id,
            label: m.name,
          }))}
          onSelect={handleSelect}
          conditionKey="value"
          conditionNameKey="label"
        />

        {medicalHistory.length > 0 && (
          <div className="mt-4 space-y-4">
            {medicalHistory.map((m) => (
              <div key={m.id} className="p-4 bg-gray-50 border rounded">
                <h4 className="font-semibold mb-2">{m.name}</h4>

                <GradingSelect
                  value={m.grading}
                  onChange={(val) => updateCondition(m.id, "grading", val)}
                />

                <NotesTextArea
                  value={m.notes}
                  onChange={(val) => updateCondition(m.id, "notes", val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ocular History Section */}
      <div className="mb-10">
        <SearchableSelect
          label="Patient Ocular History"
          options={formattedOcularConditions}
          selectedValues={ocularHistory.map((o) => ({
            value: o.id,
            label: o.name,
          }))}
          onSelect={handleOcularSelect}
          conditionKey="value"
          conditionNameKey="label"
        />

        {ocularHistory.length > 0 && (
          <div className="mt-4 space-y-4">
            {ocularHistory.map((o) => (
              <div key={o.id} className="p-4 bg-gray-50 border rounded">
                <h4 className="font-semibold mb-2">{o.name}</h4>

                <AffectedEyeSelect
                  value={o.affected_eye || ""}
                  onChange={(val) =>
                    updateOcularCondition(o.id, "affected_eye", val)
                  }
                />

                <GradingSelect
                  value={o.grading}
                  onChange={(val) =>
                    updateOcularCondition(o.id, "grading", val)
                  }
                />

                <NotesTextArea
                  value={o.notes}
                  onChange={(val) =>
                    updateOcularCondition(o.id, "notes", val)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSaveAndProceed}
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md w-full"
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
