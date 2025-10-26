import React from "react";
import CanAccess from "../../auth/CanAccess";

const EditClinicScheduleButton = ({ onClick }) => {
  return (
    <CanAccess accessKeys={["canUpdateClinicSchedule"]}>
      <button
        onClick={onClick}
        className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold transition"
      >
        Edit
      </button>
    </CanAccess>
  );
};

export default EditClinicScheduleButton;
