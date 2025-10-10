import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/slices/appointmentsSlice";

const useHandleConsult = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleConsult = (appointment) => {
    if (!appointment?.id) {
      console.error("❌ Appointment data is required to navigate to consultation:", appointment);
      return;
    }

    // Save appointment in Redux so it's globally accessible
    dispatch(setSelectedAppointment(appointment));

    // Navigate to the Consultation Page
    navigate(`/consultation/${appointment.id}`, {
      state: { appointment }, // 👈 optional: keep it in route state too
    });
  };

  return { handleConsult };
};

export default useHandleConsult;
