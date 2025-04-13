import React, { useEffect, useState } from "react";
import { showToast } from "../components/ToasterHelper";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import NotesTextArea from "./NotesTextArea";
import useDiagnosisData from "../hooks/useDiagnosisData";
import { useGetAllDiagnosisQuery } from "../redux/api/features/diagnosisApi";

const Diagnosis = ({ appointmentId, setFlowStep, setActiveTab }) => {
  const { appointmentDiagnosis, createDiagnosis, isCreatingDiagnosis } =
    useDiagnosisData(appointmentId);
  const { data: allDiagnosisCodes = [] } = useGetAllDiagnosisQuery();

  const [differentialDiagnosis, setDifferentialDiagnosis] = useState("");
  const [finalDiagnosisEntries, setFinalDiagnosisEntries] = useState([]);
  const [managementPlan, setManagementPlan] = useState("");
  const [queries, setQueries] = useState([{ query: "" }]);

  useEffect(() => {
    if (appointmentDiagnosis) {
      setDifferentialDiagnosis(appointmentDiagnosis.differential_diagnosis || "");
      setManagementPlan(appointmentDiagnosis.management_plan || "");

      if (appointmentDiagnosis.final_diagnoses_info) {
        setFinalDiagnosisEntries(
          appointmentDiagnosis.final_diagnoses_info.map((d) => ({
            id: d.id,
            name: d.name,
            affected_eye: d.affected_eye || "",
            notes: d.notes || "",
          }))
        );
      }

      if (appointmentDiagnosis.queries?.length) {
        setQueries(appointmentDiagnosis.queries);
      }
    }
  }, [appointmentDiagnosis]);

  const formatErrorMessage = (data) => {
    if (!data) return "An unexpected error occurred.";
    if (typeof data.detail === "string") return data.detail;

    const parseField = (value) => {
      if (Array.isArray(value)) {
        return value
          .map((item) =>
            typeof item === "object" ? parseField(item) : item
          )
          .join(", ");
      } else if (typeof value === "object") {
        return Object.entries(value)
          .map(([k, v]) => `${k.toUpperCase()}: ${parseField(v)}`)
          .join(", ");
      }
      return value;
    };

    return Object.entries(data)
      .map(([key, value]) => {
        const label = key.replace(/_/g, " ").toUpperCase();
        return `${label}: ${parseField(value)}`;
      })
      .join("\n");
  };

  const handleSubmit = async () => {
    if (!differentialDiagnosis.trim()) {
      showToast("Differential diagnosis cannot be empty.", "error");
      return;
    }

    if (!managementPlan.trim()) {
      showToast("Management plan cannot be empty.", "error");
      return;
    }

    const payload = {
      differential_diagnosis: differentialDiagnosis,
      final_diagnoses: finalDiagnosisEntries.map((d) => d.id),
      management_plan: managementPlan,
      queries: queries.filter((q) => q.query.trim() !== ""),
    };

    try {
      await createDiagnosis({ appointmentId, data: payload }).unwrap();
      showToast("Diagnosis saved successfully ✅", "success");
      setFlowStep("management");
    } catch (error) {
      console.error(error);
      showToast(formatErrorMessage(error?.data), "error");
    }
  };

  const handleAddFinalDiagnosis = (option) => {
    if (finalDiagnosisEntries.some((d) => d.id === option.value)) {
      showToast("Diagnosis already selected", "error");
      return;
    }

    setFinalDiagnosisEntries((prev) => [
      ...prev,
      {
        id: option.value,
        name: option.label,
        affected_eye: "",
        notes: "",
      },
    ]);
  };

  const updateDiagnosisField = (id, field, value) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleRemoveDiagnosis = (id) => {
    setFinalDiagnosisEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const handleChangeQuery = (index, value) => {
    const updated = [...queries];
    updated[index].query = value;
    setQueries(updated);
  };

  const handleAddQuery = () => {
    setQueries((prev) => [...prev, { query: "" }]);
  };

  const handleRemoveQuery = (index) => {
    setQueries((prev) => prev.filter((_, i) => i !== index));
  };

  const diagnosisOptions = (allDiagnosisCodes || []).map((d) => ({
    value: d.id,
    label: `${d.diagnosis} ${d.icd_code ? `(${d.icd_code})` : ""}`,
  }));

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Diagnosis</h1>

      {/* Differential Diagnosis */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Differential Diagnosis <span className="text-red-500">*</span>
        </label>
        <textarea
          value={differentialDiagnosis}
          onChange={(e) => setDifferentialDiagnosis(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Enter differential diagnosis..."
        />
      </div>

      {/* Final Diagnosis */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Final Diagnosis <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={diagnosisOptions}
          onSelect={handleAddFinalDiagnosis}
          selectedValues={finalDiagnosisEntries.map((d) => ({
            value: d.id,
            label: d.name,
          }))}
        />
        {finalDiagnosisEntries.length > 0 && (
          <div className="mt-4 space-y-4">
            {finalDiagnosisEntries.map((d) => (
              <div key={d.id} className="p-4 bg-gray-50 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{d.name}</h4>
                  <button
                    onClick={() => handleRemoveDiagnosis(d.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <AffectedEyeSelect
                  value={d.affected_eye}
                  onChange={(val) =>
                    updateDiagnosisField(d.id, "affected_eye", val)
                  }
                />
                <NotesTextArea
                  value={d.notes}
                  onChange={(val) => updateDiagnosisField(d.id, "notes", val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Queries */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="font-semibold text-base">Queries</label>
          <button
            type="button"
            onClick={handleAddQuery}
            className="text-sm text-indigo-700 hover:underline"
          >
            + Add Query
          </button>
        </div>
        {queries.map((q, idx) => (
          <div key={idx} className="flex gap-2 items-start mb-3">
            <textarea
              value={q.query}
              onChange={(e) => handleChangeQuery(idx, e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder={`Query ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveQuery(idx)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Management Plan */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">
          Management Plan <span className="text-red-500">*</span>
        </label>
        <textarea
          value={managementPlan}
          onChange={(e) => setManagementPlan(e.target.value)}
          className="w-full border p-3 rounded-md"
          placeholder="Example: Dispense spectacles..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end pt-4 gap-4">
        <button
          onClick={() => setActiveTab("extra tests")}
          className="px-6 py-2 border border-indigo-600 text-indigo-700 bg-white hover:bg-indigo-50 rounded-lg"
        >
          ← Back to Extra Tests
        </button>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
        >
          {isCreatingDiagnosis ? "Saving..." : "Save and Proceed"}
        </button>
      </div>
    </div>
  );
};

export default Diagnosis;
