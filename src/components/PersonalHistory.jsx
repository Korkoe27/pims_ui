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
    createPatientHistory,
    createPatientHistoryStatus,
  } = usePersonalHistoryData(patientId, appointmentId);

  const { medicalConditions, ocularConditions } = useFetchConditionsData();

  const [lastEyeExam, setLastEyeExam] = useState("");
  const [drugHistory, setDrugHistory] = useState("");
  const [drugNotes, setDrugNotes] = useState("");
  const [allergyHistory, setAllergyHistory] = useState("");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [socialNotes, setSocialNotes] = useState("");
  const [selectedMedical, setSelectedMedical] = useState([]);
  const [selectedOcular, setSelectedOcular] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isSaving = createPatientHistoryStatus.isLoading;

  useEffect(() => {
    if (personalHistory) {
      setLastEyeExam(personalHistory.last_eye_examination || "");
      setDrugHistory(personalHistory.drug_history || "");
      setDrugNotes(personalHistory.drug_notes || "");
      setAllergyHistory(personalHistory.allergies || "");
      setAllergyNotes(personalHistory.allergy_notes || "");
      setSocialHistory(personalHistory.social_history || "");
      setSocialNotes(personalHistory.social_notes || "");

      setSelectedMedical(
        (personalHistory.medical_history || []).map((item) => ({
          id: item.medical_condition,
          name: item.medical_condition_name,
          notes: item.notes || "",
        }))
      );

      setSelectedOcular(
        (personalHistory.ocular_history || []).map((item) => ({
          id: item.ocular_condition,
          name: item.ocular_condition_name,
          affected_eye: item.affected_eye || "",
          grading: item.grading || "",
          notes: item.notes || "",
        }))
      );
    }
  }, [personalHistory]);

  const formatOptions = (list) =>
    list?.map((item) => ({ value: item.id, label: item.name })) || [];

  const handleSelect = (setter, existingList) => (option) => {
    if (existingList.some((item) => item.id === option.value)) return;
    setter([
      ...existingList,
      {
        id: option.value,
        name: option.label,
        affected_eye: "",
        grading: "",
        notes: "",
      },
    ]);
  };

  const updateEntry = (id, field, value, list, setter) => {
    setter(
      list.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDelete = (id, list, setter) => {
    setter(list.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setShowErrorModal(false);

    if (!lastEyeExam) {
      setErrorMessage({
        detail: "Please select the last eye examination date.",
      });
      setShowErrorModal(true);
      return;
    }

    const payload = {
      patient: patientId,
      appointment: appointmentId,
      last_eye_examination: lastEyeExam,
      drug_entries: [{ name: drugHistory, notes: drugNotes }],
      allergy_entries: [{ name: allergyHistory, notes: allergyNotes }],
      social_entries: [{ name: socialHistory, notes: socialNotes }],
      medical_history: selectedMedical.map((item) => item.id),
      ocular_history: selectedOcular.map((item) => ({
        ocular_condition: item.id,
        affected_eye: item.affected_eye,
        grading: item.grading,
        notes: item.notes,
      })),
    };

    try {
      await createPatientHistory(payload).unwrap();
      console.log("✅ Personal history saved");
      setActiveTab("visual acuity");
    } catch (err) {
      console.error("❌ Error saving personal history:", err);
      setErrorMessage(err?.data || { detail: "An unexpected error occurred." });
      setShowErrorModal(true);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Personal History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Last Eye Exam */}
        <div>
          <label className="block font-medium mb-1">Last Eye Examination</label>
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

        {/* Drug History */}
        <div>
          <label className="block font-medium mb-1">Drug History</label>
          <input
            value={drugHistory}
            onChange={(e) => setDrugHistory(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="E.g., Paracetamol"
          />
          <NotesTextArea
            value={drugNotes}
            onChange={setDrugNotes}
            label="Notes"
          />
        </div>

        {/* Allergy History */}
        <div>
          <label className="block font-medium mb-1">Allergies</label>
          <input
            value={allergyHistory}
            onChange={(e) => setAllergyHistory(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="E.g., Penicillin"
          />
          <NotesTextArea
            value={allergyNotes}
            onChange={setAllergyNotes}
            label="Notes"
          />
        </div>

        {/* Social History */}
        <div>
          <label className="block font-medium mb-1">Social History</label>
          <input
            value={socialHistory}
            onChange={(e) => setSocialHistory(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="E.g., Smoker, Driver"
          />
          <NotesTextArea
            value={socialNotes}
            onChange={setSocialNotes}
            label="Notes"
          />
        </div>
      </div>

      {/* Ocular History */}
      <div className="mt-10 mb-6">
        <SearchableSelect
          label={
            <span>
              Ocular History <span className="text-red-500">*</span>
            </span>
          }
          options={formatOptions(ocularConditions)}
          selectedValues={selectedOcular.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={handleSelect(setSelectedOcular, selectedOcular)}
          conditionKey="value"
          conditionNameKey="label"
        />

        {selectedOcular.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedOcular.map((c) => (
              <div key={c.id} className="p-4 bg-gray-50 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{c.name}</h4>
                  <DeleteButton
                    onClick={() =>
                      handleDelete(c.id, selectedOcular, setSelectedOcular)
                    }
                  />
                </div>

                <AffectedEyeSelect
                  value={c.affected_eye}
                  onChange={(val) =>
                    updateEntry(
                      c.id,
                      "affected_eye",
                      val,
                      selectedOcular,
                      setSelectedOcular
                    )
                  }
                />

                <GradingSelect
                  value={c.grading}
                  onChange={(val) =>
                    updateEntry(
                      c.id,
                      "grading",
                      val,
                      selectedOcular,
                      setSelectedOcular
                    )
                  }
                />

                <NotesTextArea
                  value={c.notes}
                  onChange={(val) =>
                    updateEntry(
                      c.id,
                      "notes",
                      val,
                      selectedOcular,
                      setSelectedOcular
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

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
