import React from "react";
import CanAccess from "../../auth/CanAccess";

const DeleteClinicScheduleButton = ({ onClick }) => {
  return (
    <CanAccess accessKeys={["canDeleteClinicSchedule"]}>
      <button
        onClick={onClick}
        className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold transition"
      >
        Delete
      </button>
    </CanAccess>
  );
};

export default DeleteClinicScheduleButton;
