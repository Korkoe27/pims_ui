import React from "react";
import useVisualAcuityData from "../hooks/useVisualAcuityData";

const VisualAcuityView = ({ appointmentId }) => {
  const { visualAcuity, isLoading, error } = useVisualAcuityData(appointmentId);

  if (isLoading)
    return <p className="text-gray-500">Loading visual acuity...</p>;
  if (error || !visualAcuity)
    return <p className="text-red-500">No visual acuity data found.</p>;

  const renderEyeData = (eyeLabel, data) => (
    <div className="border rounded p-4 bg-gray-50 space-y-2">
      <h4 className="font-semibold text-gray-700">{eyeLabel}</h4>
      <p>Unaided: {data.unaided || "N/A"}</p>
      <p>PH: {data.ph || "N/A"}</p>
      <p>+1.00: {data.plusOne || "N/A"}</p>
      <p>Near VA: {data.near || "N/A"}</p>
    </div>
  );

  const renderRxData = (eyeLabel, data) => (
    <div className="border rounded p-4 bg-gray-50 space-y-2">
      <h4 className="font-semibold text-gray-700">{eyeLabel}</h4>
      <p>SPH: {data.sph || "N/A"}</p>
      <p>CYL: {data.cyl || "N/A"}</p>
      <p>AXIS: {data.axis || "N/A"}</p>
      <p>VA (Distance): {data.va || "N/A"}</p>
      <p>ADD: {data.add || "N/A"}</p>
      <p>VA (Near): {data.nearVa || "N/A"}</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-y-auto space-y-8">
      <h2 className="text-xl font-bold text-[#2f3192]">Visual Acuity</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700">VA Chart Used:</h4>
          <p className="text-gray-600">{visualAcuity.va_chart_used || "N/A"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">
            Came with Prescription:
          </h4>
          <p className="text-gray-600">
            {visualAcuity.came_with_prescription ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Prescription Type:</h4>
          <p className="text-gray-600">
            {visualAcuity.prescription_type === "GLASSES"
              ? "Spectacles"
              : visualAcuity.prescription_type === "CONTACTS"
              ? "Contact Lenses"
              : "N/A"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#2f3192] mt-4 mb-2">
          Distance VA
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {renderEyeData("OD", {
            unaided: visualAcuity.distance_unaided_od,
            ph: visualAcuity.distance_ph_od,
            plusOne: visualAcuity.distance_plus1_od,
            near: visualAcuity.near_va_od,
          })}
          {renderEyeData("OS", {
            unaided: visualAcuity.distance_unaided_os,
            ph: visualAcuity.distance_ph_os,
            plusOne: visualAcuity.distance_plus1_os,
            near: visualAcuity.near_va_os,
          })}
        </div>
      </div>

      {visualAcuity.came_with_prescription && (
        <div>
          <h3 className="text-lg font-bold text-[#2f3192] mt-4 mb-2">
            Prescription
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {renderRxData("OD", {
              sph: visualAcuity.rx_sph_od,
              cyl: visualAcuity.rx_cyl_od,
              axis: visualAcuity.rx_axis_od,
              va: visualAcuity.rx_va1_od,
              add: visualAcuity.rx_add_od,
              nearVa: visualAcuity.rx_va2_od,
            })}
            {renderRxData("OS", {
              sph: visualAcuity.rx_sph_os,
              cyl: visualAcuity.rx_cyl_os,
              axis: visualAcuity.rx_axis_os,
              va: visualAcuity.rx_va1_os,
              add: visualAcuity.rx_add_os,
              nearVa: visualAcuity.rx_va2_os,
            })}
          </div>
        </div>
      )}
    </div>
  );
};


export default VisualAcuityView;