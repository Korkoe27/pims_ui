import React, { useState } from "react";
import { useSelector } from "react-redux";
import useCaseHistoryData from "../hooks/useCaseHistoryData";
import SearchableSelect from "../components/SearchableSelect";
import { useCreateCaseHistoryMutation } from "../redux/api/features/caseHistoryApi";
import ErrorModal from "../components/ErrorModal";
import TextAreaField from "../components/TextAreaField";
import AffectedEyeSelect from "../components/AffectedEyeSelect";
import GradingSelect from "../components/GradingSelect";
import NotesTextArea from "../components/NotesTextArea";

const PersonalHistory = ({ patient, appointmentId, setActiveTab }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );
  const patientData = patient || selectedAppointment;
  const patientId = patientData?.patient;

  const { medicalConditions, ocularConditions, isLoading } = useCaseHistoryData(
    patientId,
    appointmentId
  );

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
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState([]);
  const [familyOcularHistory, setFamilyOcularHistory] = useState([]);
  const [drugHistory, setDrugHistory] = useState("");
  const [allergies, setAllergies] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [lastEyeExamination, setLastEyeExamination] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [createCaseHistory, { isLoading: isSubmitting }] =
    useCreateCaseHistoryMutation();

  const lastEyeExamOptions = [
    { value: "Never", label: "Never" },
    { value: "<1 week", label: "<1 week" },
    { value: "<3 months", label: "<3 months" },
    { value: "6 months - 1 year", label: "6 months - 1 year" },
    { value: "1 - 3 years", label: "1 - 3 years" },
    { value: ">3 years", label: ">3 years" },
  ];

  const handleConditionSelect = (option) => {
    if (selectedConditions.some((c) => c.id === option.value)) {
      setErrorMessage({ detail: "This condition is already selected." });
      setShowErrorModal(true);
      return;
    }

    setSelectedConditions((prev) => [
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
    setSelectedConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
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
      medical_history: medicalHistory,
      ocular_history: ocularHistory,
      family_medical_history: familyMedicalHistory,
      family_ocular_history: familyOcularHistory,
      drug_history: drugHistory,
      allergies: allergies,
      social_history: socialHistory,
      last_eye_examination: lastEyeExamination,
      condition_details: selectedConditions.map((c) => ({
        ocular_condition: c.id,
        affected_eye: c.affected_eye,
        grading: c.grading,
        notes: c.notes,
      })),
    };

    try {
      await createCaseHistory(newPersonalHistory).unwrap();
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
        Personal History
      </h2>

      {isLoading && <p className="text-gray-500">Loading Data...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <SearchableSelect
            label="Patient Medical History"
            options={formattedMedicalConditions}
            selectedValues={medicalHistory}
            onSelect={setMedicalHistory}
            conditionKey="value"
            conditionNameKey="label"
          />
          <SearchableSelect
            label="Patient Ocular History"
            options={formattedOcularConditions}
            selectedValues={ocularHistory}
            onSelect={setOcularHistory}
            conditionKey="value"
            conditionNameKey="label"
          />

          {/* Standard Dropdown for Last Eye Examination */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Eye Examination
            </label>
            <select
              value={lastEyeExamination}
              onChange={(e) => setLastEyeExamination(e.target.value)}
              className="w-full border p-2 rounded-md"
            >
              <option value="">Select one...</option>
              {lastEyeExamOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <SearchableSelect
            label="Family Medical History"
            options={formattedMedicalConditions}
            selectedValues={familyMedicalHistory}
            onSelect={setFamilyMedicalHistory}
            conditionKey="value"
            conditionNameKey="label"
          />
          <SearchableSelect
            label="Family Ocular History"
            options={formattedOcularConditions}
            selectedValues={familyOcularHistory}
            onSelect={setFamilyOcularHistory}
            conditionKey="value"
            conditionNameKey="label"
          />

          <TextAreaField
            label="Patient's Drug History"
            value={drugHistory}
            onChange={setDrugHistory}
            required
            placeholder="Enter drug history"
          />

          <TextAreaField
            label="Allergies"
            value={allergies}
            onChange={setAllergies}
            placeholder="Enter allergies"
          />

          <TextAreaField
            label="Social History"
            value={socialHistory}
            onChange={setSocialHistory}
            placeholder="Enter social history"
          />
        </div>
      </div>

      {/* Ocular Condition Details */}
      <div className="mt-6">
        <SearchableSelect
          label="Additional Ocular Conditions"
          options={formattedOcularConditions}
          selectedValues={selectedConditions.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={handleConditionSelect}
          conditionKey="value"
          conditionNameKey="label"
        />

        {selectedConditions.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedConditions.map((c) => (
              <div key={c.id} className="p-4 bg-gray-50 border rounded">
                <h4 className="font-semibold mb-2">{c.name}</h4>

                <AffectedEyeSelect
                  value={c.affected_eye}
                  onChange={(val) => updateCondition(c.id, "affected_eye", val)}
                />

                <GradingSelect
                  value={c.grading}
                  onChange={(val) => updateCondition(c.id, "grading", val)}
                />

                <NotesTextArea
                  value={c.notes}
                  onChange={(val) => updateCondition(c.id, "notes", val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
