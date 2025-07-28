import React, { useState } from "react";
import { showToast } from "./ToasterHelper";

const SECTION_A = [
  { label: "Case History", max: 5 },
  { label: "Visual Acuity and Prelim test", max: 10 },
  { label: "Externals", max: 10 },
  { label: "Internals", max: 10 },
  { label: "Objective Refraction", max: 10 },
  { label: "Subjective Refraction", max: 10 },
  { label: "Other Investigative Procedures", max: 10 },
];

const SECTION_B = [
  { label: "Diagnosis", max: 5 },
  { label: "Management", max: 5 },
  { label: "Patient Education", max: 5 },
  { label: "Review + Evidence of Resolution", max: 5 },
  { label: "Clinician's Disposition", max: 5 },
  { label: "Time", max: 5 },
  { label: "Logged Case", max: 5 },
];

const Grading = ({ appointmentId, setFlowStep }) => {
  const [grades, setGrades] = useState({});
  const [remarks, setRemarks] = useState("");

  const updateGrade = (label, value) => {
    const num = parseFloat(value);
    if (value === "") {
      setGrades((prev) => ({ ...prev, [label]: "" }));
      return;
    }
    if (isNaN(num) || num < 0) {
      showToast("Invalid number", "error");
      return;
    }
    setGrades((prev) => ({ ...prev, [label]: num }));
  };

  const totalA = SECTION_A.reduce(
    (sum, s) => sum + (parseFloat(grades[s.label]) || 0),
    0
  );
  const totalB = SECTION_B.reduce(
    (sum, s) => sum + (parseFloat(grades[s.label]) || 0),
    0
  );
  const total = totalA + totalB;

  const handleSubmit = () => {
    const allFieldsFilled = [...SECTION_A, ...SECTION_B].every(
      (s) => grades[s.label] !== undefined && grades[s.label] !== ""
    );

    if (!allFieldsFilled) {
      showToast("Please fill all scores before submitting", "error");
      return;
    }

    const payload = {
      appointmentId,
      scores: grades,
      totalA,
      totalB,
      total,
      remarks,
    };

    console.log("📦 Final Supervisor Grading:", payload);
    showToast("Grading submitted successfully ✅", "success");
    setFlowStep("complete");
  };

  return (
    <div className="ml-72 py-8 px-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold">Final Supervisor Grading</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">SECTION A: Procedures</h3>
        <div className="grid grid-cols-2 gap-6">
          {SECTION_A.map((s) => (
            <div key={s.label}>
              <label className="font-medium">{s.label} ({s.max})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={s.max}
                value={grades[s.label] ?? ""}
                onChange={(e) => updateGrade(s.label, e.target.value)}
                className="w-64 px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">SECTION B: Review & Planning</h3>
        <div className="grid grid-cols-2 gap-6">
          {SECTION_B.map((s) => (
            <div key={s.label}>
              <label className="font-medium">{s.label} ({s.max})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={s.max}
                value={grades[s.label] ?? ""}
                onChange={(e) => updateGrade(s.label, e.target.value)}
                className="w-64 px-3 py-2 border rounded"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="font-medium">Supervisor Remarks</label>
        <textarea
          rows={3}
          className="w-full max-w-2xl border rounded px-3 py-2 mt-1"
          placeholder="Any final comments or feedback..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-lg font-semibold">
          <p>Section A Total: <span className="text-blue-700">{totalA} / 65</span></p>
          <p>Section B Total: <span className="text-blue-700">{totalB} / 35</span></p>
          <p className="mt-1">Overall Total: <span className="text-green-700">{total} / 100</span></p>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-indigo-700 hover:bg-indigo-800 text-white px-6 py-3 rounded shadow"
        >
          Submit Final Grade
        </button>
      </div>
    </div>
  );
};

export default Grading;
