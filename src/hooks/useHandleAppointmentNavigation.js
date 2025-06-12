import { useNavigate } from "react-router-dom";

const useHandleAppointmentNavigation = () => {
  const navigate = useNavigate();

  const goToCreateAppointment = (patient) => {
    if (!patient) {
      console.error("Error: No patient data provided.");
      return;
    }

    navigate("/createAppointment", { state: { patient } });
  };

  return { goToCreateAppointment };
};

export default useHandleAppointmentNavigation;

