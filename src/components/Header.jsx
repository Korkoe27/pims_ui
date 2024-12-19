import React from "react";

const Header = ({ patient }) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Patient Name */}
      <h1 className="text-base font-normal">
        {patient?.first_name || "Patient"} {patient?.last_name || ""}
      </h1>

      {/* Patient ID */}
      <h1 className="text-2xl font-semibold">
        {patient?.patient_id || "PH/XXX/YY/ZZZ"}
      </h1>
    </div>
  );
};

export default Header;
