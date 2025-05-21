import { useEffect, useState } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
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
  { value: "Cannot remember", label: "Cannot remember" },
];

const PersonalHistory = ({
  patientId,
  appointmentId,
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
    if (personalHistory) {
      setLastEyeExam(personalHistory.last_eye_examination || "");
      setDrugHistory(personalHistory.drug_history || "");
      setDrugNotes(personalHistory.drug_notes || "");
      setAllergyHistory(personalHistory.allergies || "");
      setAllergyNotes(personalHistory.allergy_notes || "");
      setSocialHistory(personalHistory.social_history || "");
      setSocialNotes(personalHistory.social_notes || "");

      const hydrate = (entries = [], allConditions = []) => {
        const grouped = {};

        entries.forEach((entry) => {
          const conditionId = entry.condition;
          const fieldType = entry.field_type;
          const value = entry.value;
          const meta = allConditions.find((c) => c.id === conditionId) || {};

          if (!grouped[conditionId]) {
            grouped[conditionId] = {
              id: conditionId,
              name: entry.condition_name || meta.name || "Unknown",
              has_text: meta.has_text || false,
              has_dropdown: meta.has_dropdown || false,
              has_grading: meta.has_grading || false,
              has_notes: meta.has_notes || false,
              dropdown_options: meta.dropdown_options || [],
              OD: {},
              OS: {},
              notes: "",
            };
          }

          if (fieldType === "notes") {
            grouped[conditionId].notes = value; // ✅ set unified notes
          } else if (
            entry.affected_eye === "OD" ||
            entry.affected_eye === "OS"
          ) {
            grouped[conditionId][entry.affected_eye] = {
              ...(grouped[conditionId][entry.affected_eye] || {}),
              [fieldType]: value,
            };
          }
        });

        return Object.values(grouped);
      };

      const medicalHistory = hydrate(
        personalHistory.medical_history,
        medicalConditions
      );
      const ocularHistory = hydrate(
        personalHistory.ocular_history,
        ocularConditions
      );
      const famMedHistory = hydrate(
        personalHistory.family_medical_history,
        medicalConditions
      );
      const famOcularHistory = hydrate(
        personalHistory.family_ocular_history,
        ocularConditions
      );

      setSelectedMedical(medicalHistory);
      setSelectedOcular(ocularHistory);
      setFamilyMedicalHistory(famMedHistory);
      setFamilyOcularHistory(famOcularHistory);

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
        medical_history: medicalHistory.flatMap((item) => {
          const entries = [];
          if (item.notes) {
            entries.push({
              condition: item.id,
              field_type: "notes",
              value: item.notes,
              affected_eye: null,
            });
          }
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            Object.entries(data).forEach(([field_type, value]) => {
              entries.push({
                condition: item.id,
                affected_eye: eye,
                field_type,
                value,
              });
            });
          });
          return entries;
        }),
        ocular_history: ocularHistory.flatMap((item) => {
          const entries = [];
          if (item.notes) {
            entries.push({
              condition: item.id,
              field_type: "notes",
              value: item.notes,
              affected_eye: null,
            });
          }
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            Object.entries(data).forEach(([field_type, value]) => {
              entries.push({
                condition: item.id,
                affected_eye: eye,
                field_type,
                value,
              });
            });
          });
          return entries;
        }),
        family_medical_history: famMedHistory.flatMap((item) => {
          const entries = [];
          if (item.notes) {
            entries.push({
              condition: item.id,
              field_type: "notes",
              value: item.notes,
              affected_eye: null,
            });
          }
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            Object.entries(data).forEach(([field_type, value]) => {
              entries.push({
                condition: item.id,
                affected_eye: eye,
                field_type,
                value,
              });
            });
          });
          return entries;
        }),
        family_ocular_history: famOcularHistory.flatMap((item) => {
          const entries = [];
          if (item.notes) {
            entries.push({
              condition: item.id,
              field_type: "notes",
              value: item.notes,
              affected_eye: null,
            });
          }
          ["OD", "OS"].forEach((eye) => {
            const data = item[eye] || {};
            Object.entries(data).forEach(([field_type, value]) => {
              entries.push({
                condition: item.id,
                affected_eye: eye,
                field_type,
                value,
              });
            });
          });
          return entries;
        }),
      });
    }
  }, [
    personalHistory,
    patientId,
    appointmentId,
    medicalConditions,
    ocularConditions,
  ]);

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

  const handleDeleteCondition = (id, setter) => {
    setter((prev) => prev.filter((item) => item.id !== id));
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

  const buildConditionDetails = (list) => {
    const observations = [];

    list.forEach((item) => {
      // ✅ Include unified notes
      if (item.notes?.toString().trim()) {
        observations.push({
          condition: item.id,
          field_type: "notes",
          value: item.notes,
          affected_eye: null,
        });
      }

      ["OD", "OS"].forEach((eye) => {
        const data = item[eye] || {};
        Object.entries(data).forEach(([field_type, value]) => {
          if (value?.toString().trim()) {
            observations.push({
              condition: item.id,
              field_type,
              affected_eye: eye,
              value,
            });
          }
        });
      });
    });

    return observations;
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
      medical_history: buildConditionDetails(selectedMedical),
      ocular_history: buildConditionDetails(selectedOcular),
      family_medical_history: buildConditionDetails(familyMedicalHistory),
      family_ocular_history: buildConditionDetails(familyOcularHistory),
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Oculo-Medical History</h1>

      <div className="flex flex-col md:flex-row md:items-start gap-10">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Last Eye Exam */}
          <div>
            <label className="block font-medium mb-1">
              Last Eye Examination{" "}
              {isFirstVisit && <span className="text-red-500">*</span>}
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
            <label className="block font-medium mb-1">
              Drug History{" "}
              {isFirstVisit && <span className="text-red-500">*</span>}
            </label>
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
            <label className="block font-medium mb-1">
              Allergies{" "}
              {isFirstVisit && <span className="text-red-500">*</span>}
            </label>
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

          {/* Medical History */}
          <div>
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
                            handleDeleteCondition(item.id, setSelectedMedical)
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
                          value={item.notes || ""}
                          onChange={(val) =>
                            setSelectedMedical((prev) =>
                              prev.map((c) =>
                                c.id === item.id ? { ...c, notes: val } : c
                              )
                            )
                          }
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
            <ConditionPicker
              label={
                <span>
                  Ocular History{" "}
                  {isFirstVisit && <span className="text-red-500">*</span>}
                </span>
              }
              options={formatOptions(ocularConditions)}
              selectedValues={selectedOcular.map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              onSelect={handleSelect(setSelectedOcular, selectedOcular)}
              conditionKey="id"
              conditionNameKey="name"
            />

            {selectedOcular.length > 0 && (
              <div className="mt-4 space-y-4">
                {selectedOcular.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 border rounded space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteCondition(item.id, setSelectedOcular)
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
                            selectedOcular,
                            setSelectedOcular
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "text",
                            val,
                            selectedOcular,
                            setSelectedOcular
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
                            selectedOcular,
                            setSelectedOcular
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "dropdown",
                            val,
                            selectedOcular,
                            setSelectedOcular
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
                            selectedOcular,
                            setSelectedOcular
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "grading",
                            val,
                            selectedOcular,
                            setSelectedOcular
                          )
                        }
                      />
                    )}

                    {item.has_notes && (
                      <NotesTextArea
                        value={item.notes || ""}
                        onChange={(val) =>
                          setSelectedOcular((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, notes: val } : c
                            )
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Family Medical History */}
          <div>
            <ConditionPicker
              label={
                <span>
                  Family Medical History{" "}
                  {isFirstVisit && <span className="text-red-500">*</span>}
                </span>
              }
              options={formatOptions(medicalConditions)}
              selectedValues={familyMedicalHistory.map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              onSelect={handleSelect(
                setFamilyMedicalHistory,
                familyMedicalHistory
              )}
              conditionKey="id"
              conditionNameKey="name"
            />

            {familyMedicalHistory.length > 0 && (
              <div className="mt-4 space-y-4">
                {familyMedicalHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 border rounded space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteCondition(
                            item.id,
                            setFamilyMedicalHistory
                          )
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
                            familyMedicalHistory,
                            setFamilyMedicalHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "text",
                            val,
                            familyMedicalHistory,
                            setFamilyMedicalHistory
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
                            familyMedicalHistory,
                            setFamilyMedicalHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "dropdown",
                            val,
                            familyMedicalHistory,
                            setFamilyMedicalHistory
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
                            familyMedicalHistory,
                            setFamilyMedicalHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "grading",
                            val,
                            familyMedicalHistory,
                            setFamilyMedicalHistory
                          )
                        }
                      />
                    )}

                    {item.has_notes && (
                      <NotesTextArea
                        value={item.notes || ""}
                        onChange={(val) =>
                          setFamilyMedicalHistory((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, notes: val } : c
                            )
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Family Ocular History */}
          <div>
            <ConditionPicker
              label={
                <span>
                  Family Ocular History{" "}
                  {isFirstVisit && <span className="text-red-500">*</span>}
                </span>
              }
              options={formatOptions(ocularConditions)}
              selectedValues={familyOcularHistory.map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              onSelect={handleSelect(
                setFamilyOcularHistory,
                familyOcularHistory
              )}
              conditionKey="id"
              conditionNameKey="name"
            />

            {familyOcularHistory.length > 0 && (
              <div className="mt-4 space-y-4">
                {familyOcularHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 border rounded space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteCondition(item.id, setFamilyOcularHistory)
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
                            familyOcularHistory,
                            setFamilyOcularHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "text",
                            val,
                            familyOcularHistory,
                            setFamilyOcularHistory
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
                            familyOcularHistory,
                            setFamilyOcularHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "dropdown",
                            val,
                            familyOcularHistory,
                            setFamilyOcularHistory
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
                            familyOcularHistory,
                            setFamilyOcularHistory
                          )
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(
                            item.id,
                            "OS",
                            "grading",
                            val,
                            familyOcularHistory,
                            setFamilyOcularHistory
                          )
                        }
                      />
                    )}

                    {item.has_notes && (
                      <NotesTextArea
                        value={item.notes || ""}
                        onChange={(val) =>
                          setFamilyOcularHistory((prev) =>
                            prev.map((c) =>
                              c.id === item.id ? { ...c, notes: val } : c
                            )
                          )
                        }
                      />
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
