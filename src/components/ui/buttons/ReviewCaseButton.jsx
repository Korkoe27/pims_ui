import React from "react";
import { useSelector } from "react-redux";
import useHandleConsult from "../../../hooks/useHandleConsult";

const ReviewCaseButton = ({ appointment }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];
  const { handleConsult } = useHandleConsult();

  if (!roleCodes.includes("supervisor")) return null;

  return (
    <button
      className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
      onClick={() => handleConsult(appointment)}
    >
      Review Case
    </button>
  );
};

// ✅ Export a static helper like in ConsultButton
ReviewCaseButton.shouldShow = (roleCodes) => roleCodes.includes("supervisor");

export default ReviewCaseButton;
