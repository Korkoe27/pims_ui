import React, { useEffect, useState } from "react";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import {
  useCreateCaseHistoryMutation,
  useFetchCaseHistoryQuery,
} from "../redux/api/features/caseHistoryApi";
import ConditionPicker from "./ConditionPicker";
import { showToast } from "../components/ToasterHelper";
import DeleteButton from "./DeleteButton";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import { hasFormChanged } from "../utils/deepCompare";

const CaseHistory = ({
  patientId,
  appointmentId,
  nextTab,
  setActiveTab,
  setTabCompletionStatus,
}) => {
  const { data: caseHistory, isLoading: loadingCaseHistory } =
    useFetchCaseHistoryQuery(appointmentId, {
      skip: !appointmentId,
    });

  const { directQuestioningConditions, isLoading: loadingConditions } =
    useFetchConditionsData();

  const [createCaseHistory, { isLoading: isSaving }] =
    useCreateCaseHistoryMutation();

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [initialPayload, setInitialPayload] = useState(null);

  // const [notes, setNotes] = useState(""); // ✅ Add this

  const isLoading = loadingCaseHistory || loadingConditions;

  // Pre-fill data if editing existing case history
  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory?.chief_complaint || "");

      const grouped = {};

      (caseHistory?.condition_details || []).forEach((item) => {
        const matchedCondition = directQuestioningConditions?.find(
          (c) => c.id === item.condition
        );

        if (!grouped[item.condition]) {
          grouped[item.condition] = {
            id: item.condition,
            name: item.condition_name || "",
            has_text: matchedCondition?.has_text || false,
            has_dropdown: matchedCondition?.has_dropdown || false,
            has_grading: matchedCondition?.has_grading || false,
            has_notes: matchedCondition?.has_notes || false,
            dropdown_options: matchedCondition?.dropdown_options || [],
            OD: {},
            OS: {},
          };
        }

        if (item.affected_eye === "OD" || item.affected_eye === "OS") {
          grouped[item.condition][item.affected_eye] = {
            ...(grouped[item.condition][item.affected_eye] || {}),
            [item.field_type]: item.value,
          };
        } else {
          // ✅ Handle shared fields like notes
          grouped[item.condition][item.field_type] = item.value;
        }
      });

      const mapped = Object.values(grouped);

      setSelectedConditions(mapped);

      setInitialPayload({
        appointment: appointmentId,
        chief_complaint: caseHistory?.chief_complaint || "",
        condition_details: mapped,
      });
    }
  }, [caseHistory, appointmentId, directQuestioningConditions]);

  const formattedODQOptions = (directQuestioningConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
    ...c,
  }));

  const handleSelect = (option) => {
    if (selectedConditions.some((c) => c.id === option.id)) {
      showToast("This condition is already selected.", "error");
      return;
    }

    setSelectedConditions((prev) => [
      ...prev,
      {
        id: option.id,
        name: option.name,
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

  const handleFieldChange = (conditionId, eye, fieldType, value) => {
    setSelectedConditions((prev) =>
      prev.map((c) =>
        c.id === conditionId
          ? {
              ...c,
              [eye]: {
                ...c[eye],
                [fieldType]: value,
              },
            }
          : c
      )
    );
  };

  const handleDeleteCondition = (id) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveAndProceed = async () => {
    if (!chiefComplaint.trim()) {
      showToast("Chief complaint cannot be empty. 👍", "error");
      return;
    }

    const observations = [];

    selectedConditions.forEach((entry) => {
      // Collect OD/OS specific fields
      ["OD", "OS"].forEach((eye) => {
        const data = entry[eye] || {};
        ["text", "dropdown", "grading"].forEach((fieldType) => {
          if (data[fieldType]) {
            observations.push({
              condition: entry.id,
              affected_eye: eye,
              field_type: fieldType,
              value: data[fieldType],
            });
          }
        });
      });

      // ✅ Add unified notes field (not per eye)
      if (entry.notes?.trim()) {
        observations.push({
          condition: entry.id,
          affected_eye: null, // ✅ properly unassign eye for unified notes
          field_type: "notes",
          value: entry.notes.trim(),
        });
      }
    });

    if (observations.length === 0) {
      showToast("Please fill at least one condition field. 👍", "error");
      return;
    }

    const payload = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: observations,
    };

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "case history": true,
      }));
      setActiveTab("personal history");
      return;
    }

    try {
      showToast("Saving case history...", "loading");
      await createCaseHistory(payload).unwrap();
      showToast("Case history saved successfully!", "success");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "case history": true,
      }));
      setActiveTab("personal history");
    } catch (error) {
      console.error("❌ Error saving:", error);
      showToast("Failed to save case history.", "error");
    }
  };

  return (
    <div className="p-6 pb-12 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Case History</h1>

      {isLoading ? (
        <p>Loading patient case history...</p>
      ) : (
        <>
          {/* Chief Complaint Input */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Chief Complaint <span className="text-red-500">*</span>
            </label>
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full border p-3 rounded-md"
              placeholder="Enter chief complaint..."
            />
          </div>

          {/* On-Direct Questioning Condition Selection */}
          <div className="mb-6">
            <ConditionPicker
              label={
                <span>
                  On-Direct Questioning <span className="text-red-500">*</span>
                </span>
              }
              options={formattedODQOptions}
              selectedValues={selectedConditions.map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              onSelect={handleSelect}
              conditionKey="id"
              conditionNameKey="name"
            />

            {selectedConditions.length > 0 && (
              <div className="mt-4 space-y-4">
                {selectedConditions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-gray-50 border rounded space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{item.name}</h4>
                      <DeleteButton
                        onClick={() => handleDeleteCondition(item.id)}
                      />
                    </div>

                    {/* Grading */}
                    {item.has_grading && (
                      <GradingSelect
                        valueOD={item.OD?.grading || ""}
                        valueOS={item.OS?.grading || ""}
                        onChangeOD={(val) =>
                          handleFieldChange(item.id, "OD", "grading", val)
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(item.id, "OS", "grading", val)
                        }
                      />
                    )}

                    {/* Dropdown */}
                    {item.has_dropdown && (
                      <ConditionsDropdown
                        valueOD={item.OD?.dropdown || ""}
                        valueOS={item.OS?.dropdown || ""}
                        options={item.dropdown_options}
                        onChangeOD={(val) =>
                          handleFieldChange(item.id, "OD", "dropdown", val)
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(item.id, "OS", "dropdown", val)
                        }
                      />
                    )}

                    {/* Text Input */}
                    {item.has_text && (
                      <TextInput
                        valueOD={item.OD?.text || ""}
                        valueOS={item.OS?.text || ""}
                        onChangeOD={(val) =>
                          handleFieldChange(item.id, "OD", "text", val)
                        }
                        onChangeOS={(val) =>
                          handleFieldChange(item.id, "OS", "text", val)
                        }
                        placeholderOD="Enter text for OD"
                        placeholderOS="Enter text for OS"
                      />
                    )}

                    {/* Notes */}
                    {item.has_notes && (
                      <NotesTextArea
                        value={item.notes || ""}
                        onChange={(val) =>
                          setSelectedConditions((prev) =>
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

          {/* Save Button */}
          {selectedConditions.length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveAndProceed}
                disabled={isSaving}
                className={`px-6 py-2 font-semibold text-white rounded-full shadow-md transition-colors duration-200 ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-800 hover:bg-indigo-900"
                }`}
              >
                {isSaving ? "Saving..." : "Save and proceed"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CaseHistory;
