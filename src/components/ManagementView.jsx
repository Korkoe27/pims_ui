import React from "react";
import useManagementData from "../hooks/useManagementData";

const ManagementView = ({ appointmentId }) => {
  const {
    managementPlan,
    isManagementPlanLoading,
    isManagementPlanError,
  } = useManagementData(appointmentId);

  if (isManagementPlanLoading)
    return <p className="text-gray-500">Loading management plan...</p>;

  if (isManagementPlanError || !managementPlan)
    return <p className="text-red-500">No management plan found.</p>;

  const renderCheckbox = (label, checked) => (
    <div key={label} className="flex items-center gap-2">
      <input type="checkbox" checked={checked} readOnly className="h-4 w-4" />
      <span className="capitalize">{label.replace(/([A-Z])/g, " $1")}</span>
    </div>
  );

  const renderPrescriptionField = (label, value) =>
    value ? (
      <div className="flex justify-between">
        <span className="font-medium">{label}:</span>
        <span className="text-gray-700">{value}</span>
      </div>
    ) : null;

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-6 max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#2f3192]">Management Plan</h2>

      {/* Checkboxes */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">Treatment Options:</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {renderCheckbox("refractiveCorrection", managementPlan.refractive_correction)}
          {renderCheckbox("medications", managementPlan.medications)}
          {renderCheckbox("counselling", managementPlan.counselling)}
          {renderCheckbox("lowVisionAid", managementPlan.low_vision_aid)}
          {renderCheckbox("therapy", managementPlan.therapy)}
          {renderCheckbox("surgery", managementPlan.surgery)}
          {renderCheckbox("referral", managementPlan.referral)}
        </div>
      </div>

      {/* Prescription */}
      {managementPlan.refractive_correction && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Spectacle Prescription:</h4>

          {renderPrescriptionField(
            "Type of Refractive Correction",
            managementPlan.type_of_refractive_correction
          )}
          {renderPrescriptionField("OD SPH", managementPlan.od_sph)}
          {renderPrescriptionField("OD CYL", managementPlan.od_cyl)}
          {renderPrescriptionField("OD AXIS", managementPlan.od_axis)}
          {renderPrescriptionField("OD ADD", managementPlan.od_add)}
          {renderPrescriptionField("OS SPH", managementPlan.os_sph)}
          {renderPrescriptionField("OS CYL", managementPlan.os_cyl)}
          {renderPrescriptionField("OS AXIS", managementPlan.os_axis)}
          {renderPrescriptionField("OS ADD", managementPlan.os_add)}
          {renderPrescriptionField("Type of Lens", managementPlan.type_of_lens)}
          {renderPrescriptionField("PD", managementPlan.pd)}
          {renderPrescriptionField("Segment Height", managementPlan.segment_height)}
          {renderPrescriptionField("Fitting Cross Height", managementPlan.fitting_cross_height)}
        </div>
      )}

      {/* Medication Summary */}
      {managementPlan.medications && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-1">Medications:</h4>
          <p className="text-gray-500 text-sm">
            (Displayed in separate medication logs — not part of this summary view)
          </p>
        </div>
      )}
    </div>
  );
};

export default ManagementView;
