import React, { useState } from "react";
import { toast } from "react-hot-toast";

const Payment = ({ appointmentId, setFlowStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmPayment = async () => {
    setIsSubmitting(true);
    // UI-only: fake delay
    setTimeout(() => {
      toast.success("Payment confirmed (UI mock).");
      setIsSubmitting(false);
      setFlowStep("dispensing");
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h2 className="text-lg font-semibold mb-2">Payment</h2>
      <p className="text-sm mb-4">
        Appointment: <span className="font-mono">{appointmentId}</span>
      </p>

      {/* Replace with your final UI later */}
      <div className="flex items-center gap-2">
        <button
          onClick={confirmPayment}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-[#2f3192] text-white disabled:opacity-60"
        >
          {isSubmitting ? "Confirming..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
