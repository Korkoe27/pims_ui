import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  return (
    <div className="flex flex-col gap-1">
      {/* Patient Name */}
      <h1 className="text-base font-normal">
        {selectedAppointment?.patient?.first_name || "Patient"}{" "}
        {selectedAppointment?.patient?.last_name || ""}
      </h1>

      {/* Patient ID */}
      <h1 className="text-2xl font-semibold">
        {selectedAppointment?.patient?.patient_id || "PH/XXX/YY/ZZZ"}
      </h1>
    </div>
  );
};

export default Header;
