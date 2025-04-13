import React, { useEffect, useState } from "react";
import { showToast } from "../components/ToasterHelper";
import useDiagnosisData from "../hooks/useDiagnosisData";
import SearchableSelect from "./SearchableSelect";
import AffectedEyeSelect from "./AffectedEyeSelect";
import NotesTextArea from "./NotesTextArea";
import { useGetAllDiagnosisQuery } from "../redux/api/features/diagnosisApi";

const Diagnosis = ({ appointmentId, setFlowStep, setActiveTab }) => {
  const { appointmentDiagnosis, createDiagnosis, isCreatingDiagnosis } =
    useDiagnosisData(appointmentId);
  const { data: allDiagnosisCodes = [], isLoading: loadingDiagnosis } =
    useGetAllDiagnosisQuery();

  const [differentialDiagnosis, setDifferentialDiagnosis] = useState("");
  const [finalDiagnosisEntries, setFinalDiagnosisEntries] = useState([]);

  useEffect(() => {
    if (appointmentDiagnosis) {
      setDifferentialDiagnosis(
        appointmentDiagnosis.differential_diagnosis || ""
      );
      // TODO: Load final diagnoses if you want to prefill them from API
    }
  }, [appointmentDiagnosis]);

  const handleAddFinalDiagnosis = (diagnosis) => {
    if (finalDiagnosisEntries.some((entry) => entry.id === diagnosis.value)) {
      showToast("Diagnosis already selected.", "error");
      return;
    }

    setFinalDiagnosisEntries((prev) => [
      ...prev,
      {
        id: diagnosis.value,
        name: diagnosis.label,
        eye: "",
        notes: "",
      },
    ]);
  };

  const handleUpdateFinalDiagnosis = (id, field, value) => {
    setFinalDiagnosisEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleRemoveDiagnosis = (id) => {
    setFinalDiagnosisEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const formattedDiagnosisOptions = allDiagnosisCodes.map((d) => ({
    value: d.id,
    label: `${d.diagnosis} ${d.icd_code ? `(${d.icd_code})` : ""}`,
  }));

  return (
    <main className="ml-72 my-8 px-8 w-fit flex flex-col gap-12">
      <form className="flex flex-col w-fit gap-8">
        {/* === Differential Diagnosis === */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="differentialDiagnosis"
            className="font-medium text-base"
          >
            Differential Diagnosis
          </label>
          <textarea
            name="differentialDiagnosis"
            placeholder="Enter differential diagnosis"
            className="border w-[375px] border-[#d0d5dd] h-48 rounded-md p-4"
            value={differentialDiagnosis}
            onChange={(e) => setDifferentialDiagnosis(e.target.value)}
          />
        </div>

        {/* Final Diagnosis Section */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-base">
            Final Diagnosis <span className="text-red-500">*</span>
          </label>
          <SearchableSelect
            options={formattedDiagnosisOptions}
            onSelect={(option) => {
              if (finalDiagnosisEntries.some((d) => d.id === option.value)) {
                showToast("Diagnosis already selected.", "error");
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
            }}
            selectedValues={finalDiagnosisEntries.map((d) => ({
              value: d.id,
              label: d.name,
            }))}
            conditionKey="value"
            conditionNameKey="label"
          />

          {finalDiagnosisEntries.length > 0 && (
            <div className="mt-4 space-y-4">
              {finalDiagnosisEntries.map((d) => (
                <div key={d.id} className="p-4 bg-gray-50 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{d.name}</h4>
                    <button
                      onClick={() =>
                        setFinalDiagnosisEntries((prev) =>
                          prev.filter((entry) => entry.id !== d.id)
                        )
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <AffectedEyeSelect
                    value={d.affected_eye}
                    onChange={(val) =>
                      setFinalDiagnosisEntries((prev) =>
                        prev.map((entry) =>
                          entry.id === d.id
                            ? { ...entry, affected_eye: val }
                            : entry
                        )
                      )
                    }
                  />

                  <NotesTextArea
                    label="Query Note"
                    value={d.notes}
                    onChange={(val) =>
                      setFinalDiagnosisEntries((prev) =>
                        prev.map((entry) =>
                          entry.id === d.id ? { ...entry, notes: val } : entry
                        )
                      )
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </main>
  );
};

export default Diagnosis;
