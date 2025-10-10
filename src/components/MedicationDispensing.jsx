import React, { useState } from "react";
import { toast } from "react-hot-toast";

const MedicationDispensing = ({ appointmentId /*, setFlowStep*/ }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordDispense = async () => {
    setIsSubmitting(true);
    // UI-only: fake delay
    setTimeout(() => {
      toast.success("Medication dispensed (UI mock). Flow ends here.");
      setIsSubmitting(false);
      // No further step – flow ends at Dispensing.
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Medication Dispensing</h2>
      <p className="text-sm mb-4">
        Appointment: <span className="font-mono">{appointmentId}</span>
      </p>

      {/* Replace with your final dispensing list later */}
      <div className="flex items-center gap-2">
        <button
          onClick={recordDispense}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-[#2f3192] text-white disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Record Dispensing"}
        </button>
      </div>
    </div>
  );
};

export default MedicationDispensing;
