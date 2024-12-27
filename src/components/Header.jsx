import React from "react";
import { useSelector } from "react-redux";

const Header = ({ patient, appointmentId }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  // Fallback to Redux state if no patient is passed as a prop
  const patientData = patient || selectedAppointment?.patient;

  return (
    <div className="flex flex-col gap-1">
      {/* Patient Name */}
      <h1 className="text-base font-normal">
        {patientData?.first_name || "Patient"} {patientData?.last_name || ""}
      </h1>

      {/* Patient ID */}
      <h1 className="text-2xl font-semibold">
        {patientData?.patient_id || "PH/XXX/YY/ZZZ"}
      </h1>

      {/* Appointment ID */}
      {appointmentId && (
        <p className="text-sm text-gray-500">Appointment ID: {appointmentId}</p>
      )}
    </div>
  );
};

export default Header;
