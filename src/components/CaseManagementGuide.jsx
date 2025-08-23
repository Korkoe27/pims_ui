import React, { useEffect, useMemo, useRef, useState } from "react";

const storageKeyFor = (id) => `cmg-reviewed-${id}`;

const CaseManagementGuide = ({
  appointmentId,
  setActiveTab,
  setTabCompletionStatus,
  role = "student",
}) => {
  const [reviewed, setReviewed] = useState(false);
  const [saving, setSaving] = useState(false);
  const nextBtnRef = useRef(null);

  const KEY = useMemo(() => storageKeyFor(appointmentId), [appointmentId]);

  // Load saved state for this appointment
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(KEY);
        setReviewed(saved === "1");
      }
    } catch { /* noop */ }
  }, [KEY]);

  // Whenever reviewed changes, persist + notify parent (mark tab complete)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(KEY, reviewed ? "1" : "0");
      }
    } catch { /* noop */ }
    if (reviewed) setTabCompletionStatus?.("case_guide", true);
  }, [KEY, reviewed, setTabCompletionStatus]);

  const handleToggle = (e) => setReviewed(e.target.checked);

  const handleNext = async () => {
    if (!reviewed || saving) return;
    setSaving(true);
    try {
      // Already set as complete in the effect above; this is just navigation.
      setActiveTab?.("logs");
    } finally {
      setSaving(false);
    }
  };

  // Keyboard: Enter advances when checkbox focused & checked
  const onKeyDown = (e) => {
    if (e.key === "Enter" && reviewed) {
      e.preventDefault();
      nextBtnRef.current?.click();
    }
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
            <li>Cross-check documentation for accuracy and completeness.</li>
          </ul>
        </div>

        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            id="cmg-reviewed"
            type="checkbox"
            className="mt-1 h-5 w-5"
            checked={reviewed}
            onChange={handleToggle}
            onKeyDown={onKeyDown}
            aria-describedby="cmg-reviewed-help"
          />
          <span className="text-sm text-gray-800" id="cmg-reviewed-help">
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
          ref={nextBtnRef}
          onClick={handleNext}
          disabled={!reviewed || saving}
          className={[
            "px-4 py-2 rounded-md text-white",
            reviewed && !saving ? "bg-[#2f3192] hover:opacity-90" : "bg-[#2f3192]/60 cursor-not-allowed",
          ].join(" ")}
          aria-disabled={!reviewed || saving}
        >
          Next: Logs →
        </button>
      </footer>
    </div>
  );
};

export default CaseManagementGuide;
