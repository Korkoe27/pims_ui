import { useEffect, useState } from "react";
import { showToast } from "../components/ToasterHelper";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import NotesTextArea from "./NotesTextArea";
import DiagnosisQuerySection from "./DiagnosisQuerySection";
import ManagementPlanSection from "./ManagementPlanSection";
import useDiagnosisData from "../hooks/useDiagnosisData";
import SupervisorGradingButton from "./SupervisorGradingButton";

const Diagnosis = ({ appointmentId, setFlowStep, setActiveTab }) => {
  const {
    appointmentDiagnosis,
    createDiagnosis,
    isCreatingDiagnosis,
    isAppointmentDiagnosisLoading,
  } = useDiagnosisData(appointmentId);

  const [differentialDiagnosis, setDifferentialDiagnosis] = useState("");
  const [finalDiagnosisEntries, setFinalDiagnosisEntries] = useState([]);

  useEffect(() => {
    if (!appointmentDiagnosis) return;

    setDifferentialDiagnosis(appointmentDiagnosis.differential_diagnosis || "");

    if (Array.isArray(appointmentDiagnosis.final_diagnoses_info)) {
      setFinalDiagnosisEntries(
        appointmentDiagnosis.final_diagnoses_info.map((d) => ({
          id: d.code?.id,
          name: d.code?.diagnosis || "Unnamed diagnosis",
          affected_eye: d.affected_eye || "",
          notes: d.notes || "",
          queries: d.queries?.map((q) => ({ query: q })) || [{ query: "" }],
          management_plan: d.management_plan || "",
        }))
      );
    }
  }, [appointmentDiagnosis]);

  const handleSubmit = async () => {
    if (!differentialDiagnosis.trim()) {
      showToast("Differential diagnosis cannot be empty.", "error");
      return;
    }

    const payload = {
      appointment: appointmentId,
      differential_diagnosis: differentialDiagnosis,
      final_diagnoses: finalDiagnosisEntries.map((d) => ({
        code: d.id,
        management_plan: d.management_plan,
        affected_eye: d.affected_eye,
        notes: d.notes,
        queries: (d.queries || []).map((q) => ({ query: q.query })),
      })),
    };

    try {
      await createDiagnosis({ appointmentId, data: payload }).unwrap();
      showToast("Diagnosis saved successfully ✅", "success");
      setFlowStep("management");
    } catch (error) {
      console.error("❌ Raw error:", error);
      const fallbackMessage =
        error?.data || error?.error || "Server error occurred.";
      showToast(fallbackMessage, "error");
    }
  };

  const handleAddFinalDiagnosis = (option) => {
    if (finalDiagnosisEntries.some((d) => d.id === option.value)) {
      showToast("Diagnosis already selected", "error");
      return;
    }

    const name = option.label || "Unnamed diagnosis";

    setFinalDiagnosisEntries((prev) => [
      ...prev,
      {
        id: option.value,
        name,
        affected_eye: "",
        notes: "",
        queries: [{ query: "" }],
        management_plan: "",
      },
    ]);
  };

  const updateDiagnosisField = (id, field, value) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const updateDiagnosisQuery = (diagnosisId, index, value) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((d) =>
        d.id === diagnosisId
          ? {
              ...d,
              queries: d.queries.map((q, i) =>
                i === index ? { ...q, query: value } : q
              ),
            }
          : d
      )
    );
  };

  const addDiagnosisQuery = (diagnosisId) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((d) =>
        d.id === diagnosisId
          ? { ...d, queries: [...(d.queries || []), { query: "" }] }
          : d
      )
    );
  };

  const removeDiagnosisQuery = (diagnosisId, index) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((d) =>
        d.id === diagnosisId
          ? {
              ...d,
              queries: d.queries.filter((_, i) => i !== index),
            }
          : d
      )
    );
  };

  const handleRemoveDiagnosis = (id) => {
    setFinalDiagnosisEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const diagnosisOptions = (
    appointmentDiagnosis?.all_diagnosis_codes || []
  ).map((d) => ({
    value: d.id,
    label: `${d.diagnosis} ${d.icd_code ? `(${d.icd_code})` : ""}`,
  }));

  return (
    <div className="p-6 bg-white rounded-md shadow-md max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-[#101928]">Diagnosis</h1>
      <SupervisorGradingButton
        sectionLabel="Grading: Diagnosis"
        // averageMarks={appointmentDiagnosis?.average_marks}
        onSubmit={(grading) => {
          console.log("Diagnosis grading submitted:", grading);
        }}
      />
      {isAppointmentDiagnosisLoading ? (
        <p className="text-gray-500">Loading diagnosis data...</p>
      ) : (
        <>
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

          <div className="mb-6">
            <label className="block font-semibold mb-1">
              Final Diagnosis <span className="text-red-500">*</span>
            </label>

            <SearchableSelect
              options={diagnosisOptions}
              selectedValues={finalDiagnosisEntries.map((d) => ({
                value: d.id,
                label: d.name || "Unnamed diagnosis",
              }))}
              onSelect={handleAddFinalDiagnosis}
              conditionKey="value"
              conditionNameKey="label"
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

                    <DiagnosisQuerySection
                      queries={d.queries || []}
                      onAdd={() => addDiagnosisQuery(d.id)}
                      onRemove={(index) => removeDiagnosisQuery(d.id, index)}
                      onChange={(index, value) =>
                        updateDiagnosisQuery(d.id, index, value)
                      }
                    />

                    <ManagementPlanSection
                      value={d.management_plan}
                      onChange={(val) =>
                        updateDiagnosisField(d.id, "management_plan", val)
                      }
                    />

                    <AffectedEyeSelect
                      value={d.affected_eye}
                      onChange={(val) =>
                        updateDiagnosisField(d.id, "affected_eye", val)
                      }
                    />

                    <NotesTextArea
                      value={d.notes}
                      onChange={(val) =>
                        updateDiagnosisField(d.id, "notes", val)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <pre className="bg-gray-100 text-sm p-2 rounded text-gray-600 mb-4 overflow-x-auto">
            {JSON.stringify(appointmentDiagnosis, null, 2)}
          </pre> */}

          <div className="flex justify-end pt-4 gap-4">
            <button
              onClick={() =>
                setFlowStep("consultation") || setActiveTab("extra tests")
              }
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
        </>
      )}
    </div>
  );
};

export default Diagnosis;
