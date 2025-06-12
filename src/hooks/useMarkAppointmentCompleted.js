import { useMarkAppointmentCompletedMutation } from "../redux/api/features/appointmentsApi";

/**
 * Custom hook to mark an appointment as completed.
 * @returns {Function} - Function to mark appointment as completed.
 */
const useMarkAppointmentCompleted = () => {
  const [markCompleted, { isLoading, isError, error, isSuccess }] =
    useMarkAppointmentCompletedMutation();

  const markAppointmentCompletedHandler = async (appointmentId) => {
    if (!appointmentId) {
      console.error("❌ No appointment ID provided.");
      return { success: false, error: "Missing appointment ID" };
    }

    try {
      const response = await markCompleted(appointmentId).unwrap();
      return { success: true, data: response };
    } catch (error) {
      console.error("❌ Failed to mark appointment as completed:", error);
      return { success: false, error: error?.data || "API request failed" };
    }
  };

  return {
    markAppointmentCompletedHandler,
    isLoading,
    isError,
    error,
    isSuccess,
  };
};

export default useMarkAppointmentCompleted;
