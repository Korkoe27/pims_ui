import React, { useEffect, useState } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import GeneralNotesTextArea from "./GeneralNotesTextArea";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import ConditionPicker from "./ConditionPicker";

const lastEyeExamOptions = [
  { value: "Never", label: "Never" },
  { value: "<1 week", label: "Less than 1 week" },
  { value: "<3 months", label: "Less than 3 months" },
  { value: "6 months - 1 year", label: "6 months - 1 year" },
  { value: "1 - 3 years", label: "1 - 3 years" },
  { value: ">3 years", label: "More than 3 years" },
  { value: "I don't Remember", label: "I don't Remember" },
];

const PersonalHistory = ({
  patientId,
  appointmentId,
  nextTab,
  setActiveTab,
  setTabCompletionStatus,
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

  const [initialPayload, setInitialPayload] = useState(null);

  const isSaving = createPatientHistoryStatus.isLoading;

  const isFirstVisit = !personalHistory;

  const formatErrorMessage = (data) => {
    if (!data) return "An unexpected error occurred.";

    if (typeof data.detail === "string") return data.detail;

    if (Array.isArray(data)) {
      return data.join("\n");
    }

    if (typeof data === "object") {
      const messages = [];

      for (const [key, value] of Object.entries(data)) {
        const label = key.replace(/_/g, " ").toUpperCase();

        if (Array.isArray(value)) {
          const formattedArray = value.map((item) => {
            if (typeof item === "string") return item;
            if (typeof item === "object") {
              return Object.entries(item)
                .map(
                  ([subKey, subValue]) => `${subKey}: ${subValue.join(", ")}`
                )
                .join("; ");
            }
            return item;
          });
          messages.push(`${label}: ${formattedArray.join("; ")}`);
        } else {
          messages.push(`${label}: ${value}`);
        }
      }

      return messages.join("\n");
    }

    return "An unexpected error occurred.";
  };

  const validateRequiredFields = () => {
    const errors = [];

    if (!lastEyeExam) errors.push("Last eye examination is required.");
    if (!drugHistory) errors.push("Drug history is required.");
    if (!allergyHistory) errors.push("Allergy history is required.");
    if (!socialHistory) errors.push("Social history is required.");
    if (selectedMedical.length === 0)
      errors.push("At least one medical condition is required.");
    if (selectedOcular.length === 0)
      errors.push("At least one ocular condition is required.");
    if (familyMedicalHistory.length === 0)
      errors.push("Family medical history is required.");
    if (familyOcularHistory.length === 0)
      errors.push("Family ocular history is required.");

    if (errors.length > 0) {
      showToast(errors.join(" "), "error");
      return false;
    }

    return true;
  };

  useEffect(() => {
    console.log("Fetched Medical Conditions:", medicalConditions);
  }, [medicalConditions]);

  useEffect(() => {
    if (personalHistory) {
      setLastEyeExam(personalHistory.last_eye_examination || "");
      setDrugHistory(personalHistory.drug_history || "");
      setDrugNotes(personalHistory.drug_notes || "");
      setAllergyHistory(personalHistory.allergies || "");
      setAllergyNotes(personalHistory.allergy_notes || "");
      setSocialHistory(personalHistory.social_history || "");
      setSocialNotes(personalHistory.social_notes || "");

      const medicalHistory = (personalHistory.medical_history || []).map(
        (item) => ({
          id: item.medical_condition,
          name: item.medical_condition_name,
          notes: item.notes || "",
        })
      );
      setSelectedMedical(medicalHistory);

      const ocularHistory = (personalHistory.ocular_history || []).map(
        (item) => ({
          id: item.ocular_condition,
          name: item.ocular_condition_name,
          affected_eye: item.affected_eye || "",
          grading: item.grading || "",
          notes: item.notes || "",
        })
      );
      setSelectedOcular(ocularHistory);

      const famMedHistory = (personalHistory.family_medical_history || []).map(
        (item) => ({
          id: item.medical_condition,
          name: item.medical_condition_name,
          notes: item.notes || "",
        })
      );
      setFamilyMedicalHistory(famMedHistory);

      const famOcularHistory = (
        personalHistory.family_ocular_history || []
      ).map((item) => ({
        id: item.ocular_condition,
        name: item.ocular_condition_name,
        affected_eye: item.affected_eye || "",
        grading: item.grading || "",
        notes: item.notes || "",
      }));
      setFamilyOcularHistory(famOcularHistory);

      // 👇 Add this to store the full initial payload for comparison
      setInitialPayload({
        patient: patientId,
        appointment: appointmentId,
        last_eye_examination: personalHistory.last_eye_examination || "",
        drug_entries: [
          {
            name: personalHistory.drug_history || "",
            notes: personalHistory.drug_notes || "",
          },
        ],
        allergy_entries: [
          {
            name: personalHistory.allergies || "",
            notes: personalHistory.allergy_notes || "",
          },
        ],
        social_entries: [
          {
            name: personalHistory.social_history || "",
            notes: personalHistory.social_notes || "",
          },
        ],
        medical_history: medicalHistory.map((item) => ({
          medical_condition: item.id,
          notes: item.notes,
        })),
        ocular_history: ocularHistory.map((item) => ({
          ocular_condition: item.id,
          affected_eye: item.affected_eye,
          grading: item.grading,
          notes: item.notes,
        })),
        family_medical_history: famMedHistory.map((item) => ({
          medical_condition: item.id,
          notes: item.notes,
        })),
        family_ocular_history: famOcularHistory.map((item) => ({
          ocular_condition: item.id,
          affected_eye: item.affected_eye,
          grading: item.grading,
          notes: item.notes,
        })),
      });
    }
  }, [personalHistory]);

  const formatOptions = (list) =>
    (list || []).map((item) => ({
      value: item.id,
      label: item.name,
      ...item,
    }));

  const handleSelect = (setter, existingList) => (option) => {
    if (
      existingList.some(
        (item) => item.id === option.value || item.id === option.id
      )
    ) {
      showToast("This condition is already selected.", "error");
      return;
    }

    setter([
      ...existingList,
      {
        id: option.id || option.value,
        name: option.name || option.label,
        has_text: option.has_text || false,
        has_dropdown: option.has_dropdown || false,
        has_grading: option.has_grading || false,
        has_notes: option.has_notes || false,
        dropdown_options: option.dropdown_options || [],
        OD: {},
        OS: {},
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

  const handleFieldChange = (
    conditionId,
    eye,
    fieldType,
    value,
    list,
    setter
  ) => {
    const updated = list.map((item) =>
      item.id === conditionId
        ? {
            ...item,
            [eye]: {
              ...(item[eye] || {}),
              [fieldType]: value,
            },
          }
        : item
    );
    setter(updated);
  };

  const handleSave = async () => {
    if (isFirstVisit && !validateRequiredFields()) {
      return;
    }

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

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "Oculo-Medical History": true,
      }));
      setActiveTab("visual acuity");
      return;
    }

    try {
      showToast("Saving Oculo-Medical history...", "loading");
      await createPatientHistory(payload).unwrap();
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "Oculo-Medical History": true,
      }));
      showToast("Oculo-Medical history saved successfully!", "success");
      setActiveTab("visual acuity");
    } catch (err) {
      console.error("❌ Error saving Oculo-Medical history:", err);
      const detail = formatErrorMessage(err?.data);
      showToast(detail, "error");
    }
  };

  const formattedOptions = formatOptions(medicalConditions);
  console.log("🧪 Condition Options:", formattedOptions);
  console.log("📦 SelectedMedical:", selectedMedical);

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
            <GeneralNotesTextArea
              value={drugNotes}
              onChange={setDrugNotes}
              placeholder="Additional notes about the drug history..."
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
            <GeneralNotesTextArea
              value={allergyNotes}
              onChange={setAllergyNotes}
              placeholder="Enter notes about patient's allergies"
            />
          </div>

          {/* Social History */}
          <div>
            <label className="block font-medium mb-1">
              Social History{" "}
              {isFirstVisit && <span className="text-red-500">*</span>}
            </label>
            <input
              value={socialHistory}
              onChange={(e) => setSocialHistory(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="E.g., Smoker, Driver"
            />
            <GeneralNotesTextArea
              value={socialNotes}
              onChange={setSocialNotes}
              placeholder="Enter notes about patient's social history"
            />
          </div>

          <div>
            {/* Medical History (ODQ-style) */}
            <div className="mb-6">
              <ConditionPicker
                label={
                  <span>
                    Medical History{" "}
                    {isFirstVisit && <span className="text-red-500">*</span>}
                  </span>
                }
                options={formatOptions(medicalConditions)}
                selectedValues={selectedMedical.map((c) => ({
                  id: c.id,
                  name: c.name,
                }))}
                onSelect={handleSelect(setSelectedMedical, selectedMedical)}
                conditionKey="id"
                conditionNameKey="name"
              />
              {selectedMedical.length > 0 && (
                <div className="mt-4 space-y-4">
                  {selectedMedical.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 border rounded space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{item.name}</h4>
                        <DeleteButton
                          onClick={() =>
                            handleDelete(item.id, setSelectedMedical)
                          }
                        />
                      </div>

                      {item.has_text && (
                        <TextInput
                          valueOD={item.OD?.text || ""}
                          valueOS={item.OS?.text || ""}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              item.id,
                              "OD",
                              "text",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              item.id,
                              "OS",
                              "text",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                        />
                      )}

                      {item.has_dropdown && (
                        <ConditionsDropdown
                          valueOD={item.OD?.dropdown || ""}
                          valueOS={item.OS?.dropdown || ""}
                          options={item.dropdown_options}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              item.id,
                              "OD",
                              "dropdown",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              item.id,
                              "OS",
                              "dropdown",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                        />
                      )}

                      {item.has_grading && (
                        <GradingSelect
                          valueOD={item.OD?.grading || ""}
                          valueOS={item.OS?.grading || ""}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              item.id,
                              "OD",
                              "grading",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              item.id,
                              "OS",
                              "grading",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                        />
                      )}

                      {item.has_notes && (
                        <NotesTextArea
                          valueOD={item.OD?.notes || ""}
                          valueOS={item.OS?.notes || ""}
                          onChangeOD={(val) =>
                            handleFieldChange(
                              item.id,
                              "OD",
                              "notes",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                          onChangeOS={(val) =>
                            handleFieldChange(
                              item.id,
                              "OS",
                              "notes",
                              val,
                              selectedMedical,
                              setSelectedMedical
                            )
                          }
                          placeholderOD="Notes for OD"
                          placeholderOS="Notes for OS"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                    {c.name !== "None" && (
                      <>
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
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Family Medical History */}
          <div>
            <SearchableSelect
              label={
                <span>
                  Family Medical History{" "}
                  {isFirstVisit && <span className="text-red-500">*</span>}
                </span>
              }
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
                    {c.name !== "None" && (
                      <>
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
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Family Ocular History */}
          <div>
            <SearchableSelect
              label={
                <span>
                  Family Ocular History{" "}
                  {isFirstVisit && <span className="text-red-500">*</span>}
                </span>
              }
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
                    {c.name !== "None" && (
                      <>
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
                      </>
                    )}
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
