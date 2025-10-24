import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 ScheduleAppointmentButton — schedules an appointment after patient creation.
 * Access logic tied to `canCreateAppointment` or `canAddPatient`.
 */
const ScheduleAppointmentButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!ScheduleAppointmentButton.shouldShow(access)) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192] hover:bg-[#f6f7ff] transition"
    >
      Schedule Appointment
    </button>
  );
};

ScheduleAppointmentButton.shouldShow = (access) =>
  Boolean(access?.canCreateAppointment || access?.canAddPatient);

export default ScheduleAppointmentButton;
