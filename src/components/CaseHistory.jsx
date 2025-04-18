import React, { useEffect, useState } from "react";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import {
  useCreateCaseHistoryMutation,
  useFetchCaseHistoryQuery,
} from "../redux/api/features/caseHistoryApi";
import SearchableSelect from "./SearchableSelect";
import { showToast } from "../components/ToasterHelper";
import AffectedEyeSelect from "./AffectedEyeSelect";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea";
import DeleteButton from "./DeleteButton";
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isLoading = loadingCaseHistory || loadingConditions;

  useEffect(() => {
    if (caseHistory) {
      setChiefComplaint(caseHistory?.chief_complaint || "");

      const mapped = (caseHistory?.condition_details || []).map((item) => ({
        id: item.condition,
        name: item.condition_name || "",
        affected_eye: item.affected_eye || "",
        grading: item.grading || "",
        notes: item.notes || "",
      }));

      setSelectedConditions(mapped);

      // Save the initial payload for comparison
      setInitialPayload({
        appointment: appointmentId,
        chief_complaint: caseHistory?.chief_complaint || "",
        condition_details: (caseHistory?.condition_details || []).map(
          (item) => ({
            condition: item.condition,
            affected_eye: item.affected_eye || "",
            grading: item.grading || "",
            notes: item.notes || "",
          })
        ),
      });
    }
  }, [caseHistory]);

  useEffect(() => {
    if (showErrorModal && errorMessage) {
      showToast(errorMessage.detail, "error");
      setShowErrorModal(false);
    }
  }, [showErrorModal, errorMessage]);

  const formatErrorMessage = (data) => {
    if (!data) return { detail: "An unexpected error occurred." };
    if (typeof data.detail === "string") return { detail: data.detail };

    if (typeof data === "object") {
      const messages = Object.entries(data)
        .map(([key, value]) => {
          const label = key.replace(/_/g, " ").toUpperCase();
          let msg;
          if (typeof value === "object") {
            msg = JSON.stringify(value);
          } else {
            msg = Array.isArray(value) ? value.join(", ") : value;
          }
          return `${label}: ${msg}`;
        })
        .join("\n");

      return { detail: messages };
    }

    return { detail: "An unexpected error occurred." };
  };

  const handleSelect = (option) => {
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

  const handleDeleteCondition = (id) => {
    setSelectedConditions((prev) => prev.filter((c) => c.id !== id));
  };

  const formattedODQOptions = (directQuestioningConditions || []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSaveAndProceed = async () => {
    if (!chiefComplaint.trim()) {
      showToast("Chief complaint cannot be empty. 👍", "error");
      return;
    }

    if (selectedConditions.length === 0) {
      showToast(
        "Select at least one on_direct question to continue. 👍",
        "error"
      );
      return;
    }

    const hasInvalidEye = selectedConditions.some(
      (c) => !["OD", "OS", "OU"].includes(c.affected_eye)
    );

    if (hasInvalidEye) {
      showToast(
        "Each condition must have a valid affected eye (OD, OS, or OU). 👍",
        "error"
      );
      return;
    }

    const payload = {
      appointment: appointmentId,
      chief_complaint: chiefComplaint,
      condition_details: selectedConditions.map((c) => ({
        condition: c.id,
        affected_eye: c.affected_eye,
        grading: c.grading,
        notes: c.notes,
      })),
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
      const formatted = formatErrorMessage(error?.data);
      showToast(formatted?.detail || "Failed to save case history.", "error");
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Case History</h1>

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
        <SearchableSelect
          label={
            <span>
              On-Direct Questioning <span className="text-red-500">*</span>
            </span>
          }
          options={formattedODQOptions}
          selectedValues={selectedConditions.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          onSelect={handleSelect}
          conditionKey="value"
          conditionNameKey="label"
        />

        {selectedConditions.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedConditions.map((c) => (
              <div key={c.id} className="p-4 bg-gray-50 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{c.name}</h4>
                  <DeleteButton onClick={() => handleDeleteCondition(c.id)} />
                </div>

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

      {/* Save Button */}
      <div className="flex justify-end pt-2">
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
    </div>
  );
};

export default CaseHistory;
