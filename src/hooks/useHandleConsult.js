import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/slices/appointmentsSlice"; // Import the correct action

const useHandleConsult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleConsult = (appointment) => {
    if (!appointment) {
      console.error("Appointment data is required to navigate to consultation.");
      return;
    }

    console.log("Dispatching appointment to Redux:", appointment); // Debug log

    // Dispatch selected appointment to Redux store
    dispatch(setSelectedAppointment(appointment)); // Use the correct action

    // Navigate to the Consultation Page with the appointment ID
    navigate(`/consultation/${appointment.id}`);
  };

  return { handleConsult };
};

export default useHandleConsult;
