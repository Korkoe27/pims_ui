// utils/canShowConsultButton.js
export const canShowConsultButton = (appointment, role) => {
  const status = appointment.status?.toLowerCase();

  if (role === "student") {
    if (
      status === "scheduled" ||
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
      ].includes(status) ||
      ["management created", "case management guide created"].includes(status)
    ) {
      return true;
    }
  }

  if (role === "lecturer") {
    if (
      status === "scheduled" ||
      [
        "consultation in progress",
        "examinations recorded",
        "diagnosis added",
      ].includes(status) ||
      status === "submitted for review" ||
      status === "under review" ||
      ["management created", "case management guide created"].includes(status)
    ) {
      return true;
    }
  }

  return false;
};
