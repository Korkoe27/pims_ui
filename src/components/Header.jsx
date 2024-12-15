import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const Header = ({ patient }) => {
  if (!patient) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Patient ID: {patient.patient_id}</h1>
      <h1 className="text-base font-normal">
        Name: {patient.first_name} {patient.last_name}
      </h1>
    </div>
  );
};

export default Header;
