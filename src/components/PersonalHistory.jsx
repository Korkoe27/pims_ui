import React, { useEffect, useState } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import { showToast } from "../components/ToasterHelper";

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
  const { personalHistory, createPatientHistory, createPatientHistoryStatus } =
    usePersonalHistoryData(patientId, appointmentId);

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

  const [familyMedicalHistory, setFamilyMedicalHistory] = useState([]);
  const [familyOcularHistory, setFamilyOcularHistory] = useState([]);

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

      setFamilyMedicalHistory(
        (personalHistory.family_medical_history || []).map((item) => ({
          id: item.medical_condition,
          name: item.medical_condition_name,
          notes: item.notes || "",
        }))
      );

      setFamilyOcularHistory(
        (personalHistory.family_ocular_history || []).map((item) => ({
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
    if (!lastEyeExam) {
      showToast("Please select the last eye examination date.", "error");
      return;
    }

    const payload = {
      patient: patientId,
      appointment: appointmentId,
      last_eye_examination: lastEyeExam,
      drug_entries: [{ name: drugHistory, notes: drugNotes }],
      allergy_entries: [{ name: allergyHistory, notes: allergyNotes }],
      social_entries: [{ name: socialHistory, notes: socialNotes }],
      medical_history: selectedMedical.map((item) => ({
        medical_condition: item.id,
        notes: item.notes || "",
      })),
      ocular_history: selectedOcular.map((item) => ({
        ocular_condition: item.id,
        affected_eye: item.affected_eye,
        grading: item.grading,
        notes: item.notes,
      })),
      family_medical_history: familyMedicalHistory.map((item) => ({
        medical_condition: item.id,
        notes: item.notes,
      })),
      family_ocular_history: familyOcularHistory.map((item) => ({
        ocular_condition: item.id,
        affected_eye: item.affected_eye,
        grading: item.grading,
        notes: item.notes,
      })),
    };

    try {
      showToast("Saving personal history...", "loading");
      await createPatientHistory(payload).unwrap();
      showToast("Personal history saved successfully!", "success");
      setActiveTab("visual acuity");
    } catch (err) {
      console.error("❌ Error saving personal history:", err);

      const detail =
        err?.data?.detail ||
        (typeof err?.data === "string"
          ? err.data
          : "An unexpected error occurred.");
      showToast(detail, "error");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Oculo-Medical History</h1>

      <div className="flex flex-col md:flex-row md:items-start gap-10">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Last Eye Exam */}
          <div>
            <label className="block font-medium mb-1">
              Last Eye Examination
            </label>
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
          <div className="space-y-2">
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

          <div>
            <SearchableSelect
              label="Medical History"
              options={formatOptions(medicalConditions)}
              selectedValues={selectedMedical.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onSelect={handleSelect(setSelectedMedical, selectedMedical)}
              conditionKey="value"
              conditionNameKey="label"
            />

            {selectedMedical.length > 0 && (
              <div className="mt-4 space-y-4">
                {selectedMedical.map((c) => (
                  <div key={c.id} className="p-4 bg-gray-50 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{c.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDelete(
                            c.id,
                            selectedMedical,
                            setSelectedMedical
                          )
                        }
                      />
                    </div>
                    <NotesTextArea
                      value={c.notes}
                      onChange={(val) =>
                        updateEntry(
                          c.id,
                          "notes",
                          val,
                          selectedMedical,
                          setSelectedMedical
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 space-y-6">
          {/* Ocular History */}
          <div>
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
          {/* Family Medical History */}
          <div>
            <SearchableSelect
              label="Family Medical History"
              options={formatOptions(medicalConditions)}
              selectedValues={familyMedicalHistory.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onSelect={handleSelect(
                setFamilyMedicalHistory,
                familyMedicalHistory
              )}
              conditionKey="value"
              conditionNameKey="label"
            />

            {familyMedicalHistory.length > 0 && (
              <div className="mt-4 space-y-4">
                {familyMedicalHistory.map((c) => (
                  <div key={c.id} className="p-4 bg-gray-50 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{c.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDelete(
                            c.id,
                            familyMedicalHistory,
                            setFamilyMedicalHistory
                          )
                        }
                      />
                    </div>
                    <NotesTextArea
                      value={c.notes}
                      onChange={(val) =>
                        updateEntry(
                          c.id,
                          "notes",
                          val,
                          familyMedicalHistory,
                          setFamilyMedicalHistory
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Family Ocular History */}
          <div>
            <SearchableSelect
              label="Family Ocular History"
              options={formatOptions(ocularConditions)}
              selectedValues={familyOcularHistory.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onSelect={handleSelect(
                setFamilyOcularHistory,
                familyOcularHistory
              )}
              conditionKey="value"
              conditionNameKey="label"
            />

            {familyOcularHistory.length > 0 && (
              <div className="mt-4 space-y-4">
                {familyOcularHistory.map((c) => (
                  <div key={c.id} className="p-4 bg-gray-50 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{c.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDelete(
                            c.id,
                            familyOcularHistory,
                            setFamilyOcularHistory
                          )
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
                          familyOcularHistory,
                          setFamilyOcularHistory
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
                          familyOcularHistory,
                          setFamilyOcularHistory
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
                          familyOcularHistory,
                          setFamilyOcularHistory
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setActiveTab("case history")}
          className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full shadow-sm hover:bg-indigo-50 transition-colors duration-200"
        >
          ← Back to Case History
        </button>

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
    </div>
  );
};

export default PersonalHistory;
