import React from "react";
import CanAccess from "../../auth/CanAccess";

const CreateClinicScheduleButton = ({ onClick }) => {
  return (
    <CanAccess accessKeys={["canCreateClinicSchedule"]}>
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Create Schedule
      </button>
    </CanAccess>
  );
};

export default CreateClinicScheduleButton;
