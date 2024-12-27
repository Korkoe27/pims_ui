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
    <div className="flex flex-col gap-1">
      {/* Patient Name */}
      <h1 className="text-base font-normal">
        {patientData?.first_name || "Unknown"} {patientData?.last_name || ""}
      </h1>

      {/* Patient ID */}
      <h1 className="text-2xl font-semibold">
        Patient ID: {patientData?.patient_id || "Not Available"}
      </h1>

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
