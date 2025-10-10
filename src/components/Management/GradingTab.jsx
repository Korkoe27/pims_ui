import React from "react";
import SupervisorGradingButton from "../SupervisorGradingButton";
import { showToast } from "../ToasterHelper";

const GradingTab = ({ appointmentId, setActiveTab }) => {
  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-2xl">
      <SupervisorGradingButton
        sectionLabel="Grading: Management"
        appointmentId={appointmentId}
        onSubmit={() => {
          showToast("Grading submitted.", "success");
          setActiveTab("complete");
        }}
      />
    </div>
  );
};

export default GradingTab;
