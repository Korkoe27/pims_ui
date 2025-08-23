import React, { useEffect, useState } from "react";

const STORAGE_KEY = (id) => `cmg-reviewed-${id}`;

const CaseManagementGuide = ({ appointmentId, setActiveTab, setTabCompletionStatus, role = "student" }) => {
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(appointmentId));
    if (saved === "1") setReviewed(true);
  }, [appointmentId]);

  const handleToggle = (e) => {
    const v = e.target.checked;
    setReviewed(v);
    localStorage.setItem(STORAGE_KEY(appointmentId), v ? "1" : "0");
  };

  const handleNext = () => {
    setTabCompletionStatus?.("case_guide", true);

    // NEW: students now go to "logs" (since Submit comes after Logs)
    const nextTab = role === "student" ? "logs" : "logs";
    setActiveTab?.(nextTab);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#101928]">Case Management Guide</h1>
        <p className="text-gray-600 mt-1">
          Appointment: <span className="font-mono">{appointmentId}</span>
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Use this guide to review protocols and decision points before finalizing your Management plan.
        </p>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="font-semibold mb-2">Quick checklist</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-800">
            <li>Confirm selected management options are clinically justified.</li>
            <li>Verify refractive prescription values (SPH/CYL/AXIS/ADD) and lens details.</li>
            <li>Ensure medication dosage/frequency/duration are complete.</li>
            <li>Add necessary counselling/referral/surgery/therapy notes.</li>
            <li>Cross‑check documentation for accuracy and completeness.</li>
          </ul>
        </div>

        <label className="flex items-start gap-3 mt-4">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={reviewed}
            onChange={handleToggle}
          />
          <span className="text-sm text-gray-800">
            I have reviewed the Case Management Guide and completed the checklist above.
          </span>
        </label>
      </section>

      <footer className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab?.("management")}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ← Back to Management
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!reviewed}
          className={[
            "px-4 py-2 rounded-md text-white",
            reviewed ? "bg-[#2f3192] hover:opacity-90" : "bg-[#2f3192]/60 cursor-not-allowed",
          ].join(" ")}
        >
          {/* NEW: label goes to Logs */}
          Next: Logs →
        </button>
      </footer>
    </div>
  );
};

export default CaseManagementGuide;
