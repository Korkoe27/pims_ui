// utils/gradingHelpers.js
export const handleSubmitGrading = (mutationFn, appointmentId) => {
  return ({ marks, remarks }) => {
    if (!appointmentId) {
      console.error("Missing appointment ID");
      return;
    }
    mutationFn({ appointment_id: appointmentId, marks, remarks });
  };
};
