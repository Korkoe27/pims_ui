import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const Header = ({ patient, appointmentId }) => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  // Fallback to Redux state if no patient is passed as a prop
  const patientData = patient || selectedAppointment?.patient;

  if (!patientData) {
    return (
      <div className="flex flex-col gap-1 text-center text-gray-500">
        <p>No patient details available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 bg-white p-4 shadow-md rounded-md">
      {/* Patient Name */}
      <h1 className="text-lg font-bold text-black">
        {patientData?.first_name || "Unknown"} {patientData?.last_name || ""}
      </h1>

      {/* Patient ID */}
      <p className="text-sm font-medium text-gray-600">
        Patient ID: {patientData?.patient_id || "Not Available"}
      </p>

      {/* Appointment ID */}
      {/* {appointmentId && (
        <p className="text-sm text-gray-500">
          Appointment ID: <span className="text-black">{appointmentId}</span>
        </p>
      )} */}
    </div>
  );
};

// PropTypes for validation
Header.propTypes = {
  patient: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    patient_id: PropTypes.string,
  }),
  appointmentId: PropTypes.string,
};

// Default props
Header.defaultProps = {
  patient: null,
  appointmentId: null,
};

export default Header;
