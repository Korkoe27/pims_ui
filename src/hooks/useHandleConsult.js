import { useNavigate } from "react-router-dom";

const useHandleConsult = () => {
  const navigate = useNavigate();

  const handleConsult = () => {
    // Navigate to the Consultation Page
    navigate("/consultation");
  };

  return { handleConsult };
};

export default useHandleConsult;
