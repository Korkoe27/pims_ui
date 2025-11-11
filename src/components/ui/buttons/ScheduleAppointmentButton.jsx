import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 ScheduleAppointmentButton — schedules an appointment after patient creation.
 * Access logic tied to `canCreateAppointment` or `canAddPatient`.
 */
const ScheduleAppointmentButton = ({ onClick, isLoading = false }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!ScheduleAppointmentButton.shouldShow(access)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192] hover:bg-[#f6f7ff] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-[#2f3192]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Creating Patient...</span>
        </>
      ) : (
        "Schedule Appointment"
      )}
    </button>
  );
};

ScheduleAppointmentButton.shouldShow = (access) =>
  Boolean(access?.canCreateAppointment || access?.canAddPatient);

export default ScheduleAppointmentButton;
