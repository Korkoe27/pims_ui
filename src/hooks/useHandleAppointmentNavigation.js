import { useNavigate } from "react-router-dom";

const useHandleAppointmentNavigation = () => {
  const navigate = useNavigate();

  const goToCreateAppointment = () => {
    navigate("/createAppointment");
  };

  return { goToCreateAppointment };
};

export default useHandleAppointmentNavigation;
