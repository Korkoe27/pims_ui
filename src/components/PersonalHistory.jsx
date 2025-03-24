import React, { useEffect, useState } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import ErrorModal from "./ErrorModal";

const lastEyeExamOptions = [
  { value: "Never", label: "Never" },
  { value: "<1 week", label: "Less than 1 week" },
  { value: "<3 months", label: "Less than 3 months" },
  { value: "6 months - 1 year", label: "6 months - 1 year" },
  { value: "1 - 3 years", label: "1 - 3 years" },
  { value: ">3 years", label: "More than 3 years" },
];

const PersonalHistory = ({
  patientId,
  appointmentId,
  nextTab,
  setActiveTab,
}) => {
  const {
    personalHistory,
    isLoading,
    isError,
    error,
    createPatientHistory,
    createPatientHistoryStatus,
  } = usePersonalHistoryData(patientId, appointmentId);
  const { medicalConditions, ocularConditions } = useFetchConditionsData();

  const [lastEyeExam, setLastEyeExam] = useState("");
  const [selectedMedical, setSelectedMedical] = useState([]);
  const [selectedOcular, setSelectedOcular] = useState([]);
  const [selectedFamilyMedical, setSelectedFamilyMedical] = useState([]);
  const [selectedFamilyOcular, setSelectedFamilyOcular] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isSaving = createPatientHistoryStatus.isLoading;

  useEffect(() => {
    if (personalHistory) {
      setLastEyeExam(personalHistory.last_eye_examination || "");

      const mapHistory = (items, type) =>
        (items || []).map((item) => ({
          id: item[type],
          name: item[`${type}_name`],
          affected_eye: item.affected_eye || "",
          grading: item.grading || "",
          notes: item.notes || "",
        }));

      setSelectedMedical(
        mapHistory(personalHistory.medical_history, "medical_condition")
      );
      setSelectedOcular(
        mapHistory(personalHistory.ocular_history, "ocular_condition")
      );
      setSelectedFamilyMedical(
        mapHistory(personalHistory.family_medical_history, "medical_condition")
      );
      setSelectedFamilyOcular(
        mapHistory(personalHistory.family_ocular_history, "ocular_condition")
      );
    }
  }, [personalHistory]);

  const handleSelect = (setter, list, type) => (option) => {
    if (list.some((item) => item.id === option.value)) return;
    setter([
      ...list,
      {
        id: option.value,
        name: option.label,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  const updateEntry = (list, setter, id, field, value) => {
    setter(
      list.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (setter, list, id) => {
    setter(list.filter((item) => item.id !== id));
  };

  const formatOptions = (items) =>
    (items || []).map((c) => ({ value: c.id, label: c.name }));

  const handleSave = async () => {
    const payload = {
      appointment: appointmentId,
      last_eye_examination: lastEyeExam,
      medical_history: selectedMedical.map((item) => item.id),
      ocular_history: selectedOcular.map((item) => ({
        ocular_condition: item.id,
        affected_eye: item.affected_eye,
        grading: item.grading,
        notes: item.notes,
      })),
      family_medical_history: selectedFamilyMedical.map((item) => item.id),
      family_ocular_history: selectedFamilyOcular.map((item) => ({
        ocular_condition: item.id,
        affected_eye: item.affected_eye,
        grading: item.grading,
        notes: item.notes,
      })),
    };

    try {
      await createPatientHistory(payload).unwrap();
      setActiveTab(nextTab);
    } catch (err) {
      setErrorMessage(
        err?.data || { detail: "Failed to save personal history." }
      );
      setShowErrorModal(true);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return (
      <p className="text-red-500">
        Error: {error?.data?.detail || "Something went wrong."}
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Personal History</h1>

      {/* Last Eye Exam Dropdown */}
      <div>
        <label className="block font-medium">Last Eye Examination</label>
        <select
          value={lastEyeExam}
          onChange={(e) => setLastEyeExam(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Select --</option>
          {lastEyeExamOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Medical History */}
      <div>
        <SearchableSelect
          label="Medical History"
          options={formatOptions(medicalConditions)}
          selectedValues={selectedMedical.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={handleSelect(
            setSelectedMedical,
            selectedMedical,
            "medical_condition"
          )}
        />
        {selectedMedical.map((item) => (
          <div key={item.id} className="border rounded p-3 mt-2">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <DeleteButton
                onClick={() =>
                  handleDelete(setSelectedMedical, selectedMedical, item.id)
                }
              />
            </div>
            <NotesTextArea
              value={item.notes}
              onChange={(val) =>
                updateEntry(
                  selectedMedical,
                  setSelectedMedical,
                  item.id,
                  "notes",
                  val
                )
              }
            />
          </div>
        ))}
      </div>

      {/* Repeat the same UI structure for other history types: selectedOcular, selectedFamilyMedical, selectedFamilyOcular */}
      {/* ... (same pattern, let me know if you'd like to expand those here too) */}

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ${
            isSaving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save and Proceed"}
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
