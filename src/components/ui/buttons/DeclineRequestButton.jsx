import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 DeclineRequestButton — used for rejecting requests.
 * Access-based visibility handled internally.
 */
const DeclineRequestButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!DeclineRequestButton.shouldShow(access)) return null;

  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold shadow transition"
    >
      Decline
    </button>
  );
};

DeclineRequestButton.shouldShow = (access) =>
  Boolean(access?.canApproveAbsentRequests);

export default DeclineRequestButton;
