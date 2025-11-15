import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 DeclineRequestButton — used for rejecting requests.
 * Access-based visibility handled internally.
 */
const DeclineRequestButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const roleCodes = user?.role_codes || [];

  if (!DeclineRequestButton.shouldShow(roleCodes)) return null;

  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold shadow transition"
    >
      Decline
    </button>
  );
};

DeclineRequestButton.shouldShow = (roleCodes) => {
  const allowedRoles = ["supervisor", "coordinator"];
  return roleCodes.some((code) => allowedRoles.includes(code));
};

export default DeclineRequestButton;
