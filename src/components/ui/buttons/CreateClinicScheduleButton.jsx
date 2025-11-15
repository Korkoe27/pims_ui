import React from "react";
import { useSelector } from "react-redux";

const CreateClinicScheduleButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  // Only coordinators and supervisors can create clinic schedules
  const canCreate = roleCodes.some((code) => ["coordinator", "supervisor"].includes(code));
  
  if (!canCreate) return null;

  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Create Schedule
    </button>
  );
};

export default CreateClinicScheduleButton;
