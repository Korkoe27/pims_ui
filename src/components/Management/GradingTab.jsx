import React from "react";
import { useSelector } from "react-redux";
import SupervisorGradingButton from "../SupervisorGradingButton";
import { showToast } from "../ToasterHelper";

const GradingTab = ({ appointmentId, setActiveTab }) => {
  const consultationState = useSelector((state) => state.consultation);
  const consultationId = consultationState.consultationId;
  const requiresGrading = consultationState.permissions.requires_grading;

  if (!requiresGrading) {
    return (
      <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
        <p>Grading not required for this consultation.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
      <SupervisorGradingButton
        sectionLabel="Grading: Consultation"
        appointmentId={appointmentId}
        consultationId={consultationId}
        onSubmit={() => {
          showToast("Grading submitted.", "success");
          setActiveTab("complete");
        }}
      />
    </div>
  );
};

export default GradingTab;
