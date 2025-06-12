import { useCreateAppointmentMutation } from "../redux/api/features/appointmentsApi";

/**
 * Custom hook to create an appointment.
 * @returns {Function} - Function to handle appointment creation.
 */
const useCreateAppointment = () => {
  const [createAppointment, { isLoading, isError, error, isSuccess }] =
    useCreateAppointmentMutation();

  const createAppointmentHandler = async (patient) => {
    if (!patient || !patient.id) {
      console.error("❌ Error: Patient data is missing or invalid!");
      return { success: false, error: "Invalid patient data" };
    }

    const appointmentData = {
      patient: patient.id, // Ensure we're using the correct patient ID
      appointment_date: new Date().toISOString().split("T")[0], // Today's date
      appointment_type: "New",
      status: "Scheduled",
    };

    try {
      const response = await createAppointment(appointmentData).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("❌ Failed to create appointment:", error);
      return { success: false, error: error?.data || "API request failed" };
    }
  };

  return { createAppointmentHandler, isLoading, isError, error, isSuccess };
};

export default useCreateAppointment;
