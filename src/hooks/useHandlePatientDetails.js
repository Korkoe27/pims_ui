import { useNavigate } from "react-router-dom";


const useHandlePatientDetails = () => {
  const navigate = useNavigate();

  const handlePatientDetails = (patient) => {
    if (!patient) {
      console.error("No patient selected.");
      return;
    }
    // Navigate to PatientDetails with state
    navigate(`/patients-details/`, { state: { patient } });
  };

  return { handlePatientDetails };
};

export default useHandlePatientDetails;