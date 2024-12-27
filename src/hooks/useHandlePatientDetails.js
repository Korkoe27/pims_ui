import { useNavigate } from "react-router-dom";

const useHandlePatientDetails = () => {
  const navigate = useNavigate();

  const handlePatientDetails = () => {
    // Navigate to the Consultation Page
    navigate("/patient-details");
  };

  return { handlePatientDetails };
};

export default useHandlePatientDetails;
