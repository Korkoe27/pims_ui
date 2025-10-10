import { ROLES } from "../constants/roles";
import { AppointmentStatus } from "../constants/statuses"; // define enums same as backend

export function getAppointmentAction(role, status) {
  if (role === ROLES.LECTURER && status === AppointmentStatus.SUBMITTED_FOR_REVIEW) {
    return { label: "Review Case", action: "review" };
  }

  if ([ROLES.STUDENT, ROLES.LECTURER].includes(role) && status === AppointmentStatus.SCHEDULED) {
    return { label: "Consult", action: "consult" };
  }

  if (role === ROLES.FINANCE && 
      [AppointmentStatus.LOGS_REVIEWED, AppointmentStatus.COMPLETED].includes(status)) {
    return { label: "Add Payment", action: "payment" };
  }

  if (role === ROLES.PHARMACY && status === AppointmentStatus.PAYMENT_COMPLETED) {
    return { label: "Dispense Medication", action: "dispense" };
  }

  return null; // no button for this combo
}
